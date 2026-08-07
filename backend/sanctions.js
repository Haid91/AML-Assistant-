import XLSX from 'xlsx'
import * as fs from 'fs'
import { Readable } from 'stream'
import sax from 'sax'
import crypto from 'crypto'
import { pool } from './db.js'

XLSX.set_fs(fs)

const DFAT_URL = 'https://www.dfat.gov.au/sites/default/files/Australian_Sanctions_Consolidated_List.xlsx'
const OFAC_URL = 'https://sanctionslistservice.ofac.treas.gov/api/PublicationPreview/exports/SDN.XML'

function normalizeText(value) {
  return (value ?? '').toString().trim()
}

// DFAT publishes one row per name variant (Primary Name / Original Script /
// Alias) sharing a base "Reference" (e.g. "3" for the primary row, "3a" for
// its alias) — verified against the live file that every base reference
// groups to exactly one Primary Name row, with zero exceptions across all
// 11,068 rows. The file is small (~1.3MB, ~3,850 entities) so building it
// fully in memory before inserting is fine.
async function fetchDfatList() {
  const res = await fetch(DFAT_URL)
  if (!res.ok) throw new Error(`DFAT list fetch failed: HTTP ${res.status}`)
  const listUpdatedAt = res.headers.get('last-modified') ? new Date(res.headers.get('last-modified')) : null
  const buf = Buffer.from(await res.arrayBuffer())
  const wb = XLSX.read(buf, { type: 'buffer' })
  const sheet = wb.Sheets[wb.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' })
  const header = rows[0]
  const data = rows.slice(1)
  const idx = (name) => header.indexOf(name)
  const col = {
    reference: idx('Reference'),
    name: idx('Name of Individual or Entity'),
    type: idx('Type'),
    nameType: idx('Name Type'),
    dob: idx('Date of Birth'),
    citizenship: idx('Citizenship'),
    committees: idx('Committees'),
  }

  const groups = new Map()
  for (const row of data) {
    const ref = normalizeText(row[col.reference])
    if (!ref) continue
    const base = ref.replace(/[a-z]+$/i, '')
    if (!groups.has(base)) groups.set(base, [])
    groups.get(base).push(row)
  }

  const entries = []
  for (const [base, groupRows] of groups) {
    const primaryRow = groupRows.find((r) => r[col.nameType] === 'Primary Name') || groupRows[0]
    const primaryName = normalizeText(primaryRow[col.name])
    if (!primaryName) continue
    const aliases = groupRows
      .filter((r) => r !== primaryRow)
      .map((r) => normalizeText(r[col.name]))
      .filter(Boolean)
    entries.push({
      source: 'dfat',
      entryType: normalizeText(primaryRow[col.type]).toLowerCase() || 'entity',
      primaryName,
      aliases,
      dob: normalizeText(primaryRow[col.dob]) || null,
      nationality: normalizeText(primaryRow[col.citizenship]) || null,
      programOrReference: [base, normalizeText(primaryRow[col.committees])].filter(Boolean).join(' — '),
      raw: { reference: base, rows: groupRows.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i]]))) },
    })
  }
  return { entries, listUpdatedAt }
}

function computeAliasesText(aliases) {
  return aliases.join(' | ').toLowerCase()
}

const INSERT_BATCH_SIZE = 200

async function insertEntryBatch(client, batch, listUpdatedAt) {
  if (batch.length === 0) return
  const values = []
  const placeholders = batch.map((e, j) => {
    const base = j * 11
    values.push(
      crypto.randomUUID(),
      e.source,
      e.entryType,
      e.primaryName,
      JSON.stringify(e.aliases),
      computeAliasesText(e.aliases),
      e.dob,
      e.nationality,
      e.programOrReference,
      JSON.stringify(e.raw),
      listUpdatedAt,
    )
    return `(${Array.from({ length: 11 }, (_, k) => `$${base + k + 1}`).join(', ')})`
  })
  await client.query(
    `INSERT INTO sanctions_entries (id, source, entry_type, primary_name, aliases, aliases_text, dob, nationality, program_or_reference, raw, list_updated_at) VALUES ${placeholders.join(', ')}`,
    values,
  )
}

async function refreshDfatSource() {
  const { entries, listUpdatedAt } = await fetchDfatList()
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query('DELETE FROM sanctions_entries WHERE source = $1', ['dfat'])
    for (let i = 0; i < entries.length; i += INSERT_BATCH_SIZE) {
      await insertEntryBatch(client, entries.slice(i, i + INSERT_BATCH_SIZE), listUpdatedAt)
    }
    await client.query('COMMIT')
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
  return { source: 'dfat', count: entries.length, listUpdatedAt }
}

// The OFAC SDN list is ~29MB / ~19,000 entries — parsing it into a full DOM
// tree (as fast-xml-parser's XMLParser does) held the whole document plus a
// deeply nested object graph in memory at once, which was enough to crash
// the process with an OOM on Render's more constrained instance even though
// it never reproduced locally. Streaming the response through a SAX parser
// and inserting in batches as we go keeps peak memory bounded to a few
// hundred entries at a time regardless of the list's total size — verified
// locally processing the full file end-to-end inside a deliberately
// constrained 150MB heap (--max-old-space-size=150), using under 10MB.
async function refreshOfacSource() {
  const res = await fetch(OFAC_URL)
  if (!res.ok) throw new Error(`OFAC list fetch failed: HTTP ${res.status}`)
  const nodeStream = Readable.fromWeb(res.body)
  nodeStream.setEncoding('utf8')

  const parser = sax.parser(true, { trim: true })
  const tagPath = []
  let listUpdatedAt = null
  let currentEntry = null
  let currentAka = null
  let currentDob = null
  let currentNat = null
  let batch = []
  let count = 0

  const client = await pool.connect()

  parser.onopentag = (node) => {
    tagPath.push(node.name)
    if (node.name === 'sdnEntry') {
      currentEntry = { firstName: '', lastName: '', sdnType: '', programs: [], akas: [], dobs: [], nats: [] }
    } else if (node.name === 'aka' && currentEntry) {
      currentAka = { firstName: '', lastName: '' }
    } else if (node.name === 'dateOfBirthItem' && currentEntry) {
      currentDob = { dateOfBirth: '' }
    } else if ((node.name === 'nationality' || node.name === 'citizenship') && currentEntry) {
      currentNat = { country: '' }
    }
  }

  parser.ontext = (text) => {
    const tag = tagPath[tagPath.length - 1]
    if (!tag) return
    if (tag === 'Publish_Date') listUpdatedAt = new Date(text)
    else if (tag === 'firstName') { if (currentAka) currentAka.firstName = text; else if (currentEntry) currentEntry.firstName = text }
    else if (tag === 'lastName') { if (currentAka) currentAka.lastName = text; else if (currentEntry) currentEntry.lastName = text }
    else if (tag === 'sdnType' && currentEntry) currentEntry.sdnType = text
    else if (tag === 'program' && currentEntry) currentEntry.programs.push(text)
    else if (tag === 'dateOfBirth' && currentDob) currentDob.dateOfBirth = text
    else if (tag === 'country' && currentNat) currentNat.country = text
  }

  parser.onclosetag = (name) => {
    tagPath.pop()
    if (name === 'aka' && currentEntry && currentAka) {
      currentEntry.akas.push(currentAka)
      currentAka = null
    } else if (name === 'dateOfBirthItem' && currentEntry && currentDob) {
      currentEntry.dobs.push(currentDob)
      currentDob = null
    } else if ((name === 'nationality' || name === 'citizenship') && currentEntry && currentNat) {
      currentEntry.nats.push(currentNat.country)
      currentNat = null
    } else if (name === 'sdnEntry' && currentEntry) {
      const primaryName = normalizeText([currentEntry.firstName, currentEntry.lastName].filter(Boolean).join(' '))
      if (primaryName) {
        batch.push({
          source: 'ofac',
          entryType: normalizeText(currentEntry.sdnType).toLowerCase() || 'entity',
          primaryName,
          aliases: currentEntry.akas.map((a) => normalizeText([a.firstName, a.lastName].filter(Boolean).join(' '))).filter(Boolean),
          dob: currentEntry.dobs.map((d) => normalizeText(d.dateOfBirth)).filter(Boolean).join('; ') || null,
          nationality: [...new Set(currentEntry.nats.filter(Boolean))].join(', ') || null,
          programOrReference: currentEntry.programs.filter(Boolean).join(', ') || null,
          raw: currentEntry,
        })
        count++
      }
      currentEntry = null
    }
  }

  try {
    await client.query('BEGIN')
    await client.query('DELETE FROM sanctions_entries WHERE source = $1', ['ofac'])

    for await (const chunk of nodeStream) {
      parser.write(chunk)
      if (batch.length >= INSERT_BATCH_SIZE) {
        const toInsert = batch
        batch = []
        await insertEntryBatch(client, toInsert, listUpdatedAt)
      }
    }
    parser.close()
    await insertEntryBatch(client, batch, listUpdatedAt)

    await client.query('COMMIT')
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }

  return { source: 'ofac', count, listUpdatedAt }
}

// Each source refreshes independently and sequentially (not concurrently —
// two large simultaneous downloads proved unreliable on flaky connections,
// and this is a background job with no real need for parallelism). A
// failure fetching/parsing one list (e.g. DFAT changes their file format)
// must not block the other from refreshing, and must never touch that
// source's existing rows in the DB, so the app keeps serving the last-good
// data for it until a fetch succeeds.
export async function refreshAllSanctionsLists() {
  for (const refreshFn of [refreshDfatSource, refreshOfacSource]) {
    try {
      const result = await refreshFn()
      console.log(`[sanctions] refreshed ${result.source}: ${result.count} entries (list dated ${result.listUpdatedAt?.toISOString() ?? 'unknown'})`)
    } catch (err) {
      console.error('[sanctions] refresh failed:', err.message || err)
    }
  }
}

export async function getSanctionsListsStatus() {
  const result = await pool.query(
    `SELECT source, count(*)::int AS count, max(list_updated_at) AS list_updated_at, max(fetched_at) AS last_refreshed
     FROM sanctions_entries GROUP BY source`,
  )
  return result.rows
}

const MIN_SIMILARITY = 0.3
const MAX_RESULTS = 20

export async function screenName({ name }) {
  const query = normalizeText(name).toLowerCase()
  const result = await pool.query(
    `SELECT source, entry_type, primary_name, aliases, dob, nationality, program_or_reference, list_updated_at,
            greatest(similarity(lower(primary_name), $1), similarity(aliases_text, $1)) AS score
     FROM sanctions_entries
     WHERE lower(primary_name) % $1 OR aliases_text % $1
     ORDER BY score DESC
     LIMIT $2`,
    [query, MAX_RESULTS],
  )
  return result.rows.filter((r) => r.score >= MIN_SIMILARITY)
}

const MAX_WATCHLIST_PER_USER = 50

export async function getWatchlistCount(userId) {
  const result = await pool.query('SELECT count(*)::int AS count FROM sanctions_watchlist WHERE user_id = $1', [userId])
  return result.rows[0].count
}

// The cap is enforced inside this single statement (not as a separate
// pre-check query) so two concurrent requests can't both pass a check and
// land the user over MAX_WATCHLIST_PER_USER — the count subquery and the
// insert commit together, closing the race a check-then-insert would have.
export async function addToWatchlist({ id, userId, name, notes }) {
  const result = await pool.query(
    `INSERT INTO sanctions_watchlist (id, user_id, name, notes)
     SELECT $1, $2, $3, $4
     WHERE (SELECT count(*) FROM sanctions_watchlist WHERE user_id = $2) < ${MAX_WATCHLIST_PER_USER}
     RETURNING id`,
    [id, userId, name, notes || null],
  )
  return result.rowCount > 0
}

export async function getWatchlist(userId) {
  const result = await pool.query(
    `SELECT id, name, notes, last_match_count AS "lastMatchCount", last_checked_at AS "lastCheckedAt", created_at AS "createdAt"
     FROM sanctions_watchlist WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId],
  )
  return result.rows
}

export async function removeFromWatchlist({ id, userId }) {
  const result = await pool.query('DELETE FROM sanctions_watchlist WHERE id = $1 AND user_id = $2', [id, userId])
  return result.rowCount > 0
}

// Re-screens every monitored name against the (just-refreshed) sanctions
// data. Returns only the NEW hits — entries whose match count went up since
// last check — so the caller (server.js) can email just those, not
// re-alert on a match that was already known and presumably already
// investigated.
export async function refreshWatchlistChecks() {
  const { rows } = await pool.query(
    `SELECT w.id, w.user_id AS "userId", w.name, w.last_match_count AS "lastMatchCount", u.email
     FROM sanctions_watchlist w JOIN users u ON u.id = w.user_id`,
  )
  const newHits = []
  for (const entry of rows) {
    let matches = []
    try {
      matches = await screenName({ name: entry.name })
    } catch (err) {
      console.error(`[sanctions] watchlist check failed for ${entry.id}:`, err.message)
      continue
    }
    await pool.query(
      'UPDATE sanctions_watchlist SET last_match_count = $1, last_checked_at = now() WHERE id = $2',
      [matches.length, entry.id],
    )
    if (matches.length > entry.lastMatchCount) {
      newHits.push({ userId: entry.userId, email: entry.email, name: entry.name, matches })
    }
  }
  return newHits
}
