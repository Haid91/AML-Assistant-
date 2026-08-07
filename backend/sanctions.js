import { XMLParser } from 'fast-xml-parser'
import XLSX from 'xlsx'
import * as fs from 'fs'
import crypto from 'crypto'
import { pool } from './db.js'

XLSX.set_fs(fs)

const DFAT_URL = 'https://www.dfat.gov.au/sites/default/files/Australian_Sanctions_Consolidated_List.xlsx'
const OFAC_URL = 'https://sanctionslistservice.ofac.treas.gov/api/PublicationPreview/exports/SDN.XML'

// fast-xml-parser collapses a repeated tag into a single object instead of a
// one-item array when only one instance is present in a given entry — force
// these paths to always be arrays so downstream code doesn't need to guard
// against both shapes.
const FORCE_ARRAY_TAGS = new Set(['sdnEntry', 'aka', 'dateOfBirthItem', 'program', 'nationality', 'citizenship', 'address', 'id'])

function normalizeText(value) {
  return (value ?? '').toString().trim()
}

function toArray(value) {
  if (value == null) return []
  return Array.isArray(value) ? value : [value]
}

// DFAT publishes one row per name variant (Primary Name / Original Script /
// Alias) sharing a base "Reference" (e.g. "3" for the primary row, "3a" for
// its alias) — verified against the live file that every base reference
// groups to exactly one Primary Name row, with zero exceptions across all
// 11,068 rows.
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

async function fetchOfacList() {
  const res = await fetch(OFAC_URL)
  if (!res.ok) throw new Error(`OFAC list fetch failed: HTTP ${res.status}`)
  const xml = await res.text()
  const parser = new XMLParser({ ignoreAttributes: true, isArray: (name) => FORCE_ARRAY_TAGS.has(name) })
  const doc = parser.parse(xml)
  const sdnEntries = doc.sdnList?.sdnEntry || []
  const publishDate = doc.sdnList?.publshInformation?.Publish_Date
  const listUpdatedAt = publishDate ? new Date(publishDate) : null

  const entries = []
  for (const e of sdnEntries) {
    const primaryName = normalizeText([e.firstName, e.lastName].filter(Boolean).join(' '))
    if (!primaryName) continue
    const aliases = toArray(e.akaList?.aka)
      .map((a) => normalizeText([a.firstName, a.lastName].filter(Boolean).join(' ')))
      .filter(Boolean)
    const dob = toArray(e.dateOfBirthList?.dateOfBirthItem)
      .map((d) => normalizeText(d.dateOfBirth))
      .filter(Boolean)
      .join('; ') || null
    const nationalities = new Set()
    for (const n of toArray(e.nationalityList?.nationality)) if (n.country) nationalities.add(n.country)
    for (const c of toArray(e.citizenshipList?.citizenship)) if (c.country) nationalities.add(c.country)
    const programs = toArray(e.programList?.program).filter(Boolean)
    entries.push({
      source: 'ofac',
      entryType: normalizeText(e.sdnType).toLowerCase() || 'entity',
      primaryName,
      aliases,
      dob,
      nationality: [...nationalities].join(', ') || null,
      programOrReference: programs.join(', ') || null,
      raw: e,
    })
  }
  return { entries, listUpdatedAt }
}

function computeAliasesText(aliases) {
  return aliases.join(' | ').toLowerCase()
}

const INSERT_BATCH_SIZE = 200

async function replaceSourceEntries(client, source, entries, listUpdatedAt) {
  await client.query('DELETE FROM sanctions_entries WHERE source = $1', [source])
  for (let i = 0; i < entries.length; i += INSERT_BATCH_SIZE) {
    const batch = entries.slice(i, i + INSERT_BATCH_SIZE)
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
}

async function refreshSource(source, fetchFn) {
  const { entries, listUpdatedAt } = await fetchFn()
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await replaceSourceEntries(client, source, entries, listUpdatedAt)
    await client.query('COMMIT')
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
  return { source, count: entries.length, listUpdatedAt }
}

// Each source refreshes independently and sequentially (not concurrently —
// two large simultaneous downloads proved unreliable on flaky connections,
// and this is a background job with no real need for parallelism). A
// failure fetching/parsing one list (e.g. DFAT changes their file format)
// must not block the other from refreshing, and must never touch that
// source's existing rows in the DB, so the app keeps serving the last-good
// data for it until a fetch succeeds.
export async function refreshAllSanctionsLists() {
  for (const [source, fetchFn] of [['dfat', fetchDfatList], ['ofac', fetchOfacList]]) {
    try {
      const result = await refreshSource(source, fetchFn)
      console.log(`[sanctions] refreshed ${result.source}: ${result.count} entries (list dated ${result.listUpdatedAt?.toISOString() ?? 'unknown'})`)
    } catch (err) {
      console.error(`[sanctions] refresh failed for ${source}:`, err.message || err)
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
