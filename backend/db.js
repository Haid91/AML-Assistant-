import pg from 'pg'

const { Pool, types } = pg

// Return SQL `date` columns as plain 'YYYY-MM-DD' strings instead of JS Date
// objects — pg's default parsing interprets the string in the server's local
// timezone before converting to a UTC Date, which can shift the calendar day
// by one once the app formats it back. Compliance-calendar due-date math
// depends on getting the literal date, not a timezone-shifted timestamp.
types.setTypeParser(1082, (val) => val)

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set. Add your Supabase Postgres connection string to backend/.env — see .env.example.')
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  // Above pg's default of 10 — the sanctions list refresh (startup + every
  // 24h) holds one connection for the full ~15-20s OFAC insert transaction,
  // by design (that transaction's atomicity — full replace or full
  // rollback — is the whole point, so shortening the hold time isn't worth
  // trading away). Extra headroom here means that one long-held connection
  // doesn't meaningfully reduce what's available for concurrent requests.
  max: 15,
})

export async function getUserByEmail(email) {
  const { rows } = await pool.query(
    'SELECT id, name, email, password_hash AS "passwordHash", premium, plan, stripe_customer_id AS "stripeCustomerId", stripe_subscription_id AS "stripeSubscriptionId" FROM users WHERE email = $1',
    [email]
  )
  return rows[0] || null
}

export async function createUser({ id, name, email, passwordHash, premium }) {
  await pool.query(
    'INSERT INTO users (id, name, email, password_hash, premium) VALUES ($1, $2, $3, $4, $5)',
    [id, name, email, passwordHash, premium]
  )
}

export async function updateUserName(email, name) {
  await pool.query('UPDATE users SET name = $1 WHERE email = $2', [name, email])
}

export async function updateUserPassword(email, passwordHash) {
  await pool.query('UPDATE users SET password_hash = $1 WHERE email = $2', [passwordHash, email])
}

export async function getProgramDraft(userId) {
  const { rows } = await pool.query(
    'SELECT id, business_name AS "businessName", intake, draft_text AS "draftText", created_at AS "createdAt", updated_at AS "updatedAt" FROM program_drafts WHERE user_id = $1',
    [userId]
  )
  return rows[0] || null
}

export async function saveProgramDraft({ id, userId, businessName, intake, draftText }) {
  await pool.query(
    `INSERT INTO program_drafts (id, user_id, business_name, intake, draft_text, updated_at)
     VALUES ($1, $2, $3, $4, $5, now())
     ON CONFLICT (user_id) DO UPDATE SET
       business_name = EXCLUDED.business_name,
       intake = EXCLUDED.intake,
       draft_text = EXCLUDED.draft_text,
       updated_at = now()`,
    [id, userId, businessName, intake, draftText]
  )
}

export async function getPrivacyDraft(userId) {
  const { rows } = await pool.query(
    'SELECT id, business_name AS "businessName", intake, draft_text AS "draftText", created_at AS "createdAt", updated_at AS "updatedAt" FROM privacy_drafts WHERE user_id = $1',
    [userId]
  )
  return rows[0] || null
}

export async function savePrivacyDraft({ id, userId, businessName, intake, draftText }) {
  await pool.query(
    `INSERT INTO privacy_drafts (id, user_id, business_name, intake, draft_text, updated_at)
     VALUES ($1, $2, $3, $4, $5, now())
     ON CONFLICT (user_id) DO UPDATE SET
       business_name = EXCLUDED.business_name,
       intake = EXCLUDED.intake,
       draft_text = EXCLUDED.draft_text,
       updated_at = now()`,
    [id, userId, businessName, intake, draftText]
  )
}

export async function saveMockExamAttempt({ id, userId, score, total, passed, chapterBreakdown }) {
  await pool.query(
    'INSERT INTO mock_exam_attempts (id, user_id, score, total, passed, chapter_breakdown) VALUES ($1, $2, $3, $4, $5, $6)',
    [id, userId, score, total, passed, chapterBreakdown]
  )
}

export async function getMockExamAttempts(userId, limit = 20) {
  const { rows } = await pool.query(
    'SELECT id, score, total, passed, chapter_breakdown AS "chapterBreakdown", created_at AS "createdAt" FROM mock_exam_attempts WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
    [userId, limit]
  )
  return rows
}

export async function getComplianceChecklist(userId) {
  const { rows } = await pool.query(
    'SELECT program_review_date AS "programReviewDate", independent_eval_date AS "independentEvalDate", staff_training_date AS "staffTrainingDate", privacy_review_date AS "privacyReviewDate", acr_lodged_year AS "acrLodgedYear", updated_at AS "updatedAt" FROM compliance_checklist WHERE user_id = $1',
    [userId]
  )
  return rows[0] || null
}

const COMPLIANCE_CHECKLIST_COLUMNS = {
  programReviewDate: 'program_review_date',
  independentEvalDate: 'independent_eval_date',
  staffTrainingDate: 'staff_training_date',
  privacyReviewDate: 'privacy_review_date',
  acrLodgedYear: 'acr_lodged_year',
}

// Only columns whose key is actually present on `fields` are written — a
// key with value `null` clears that column, while an omitted key leaves the
// existing value untouched. Building the SET clause dynamically (rather
// than COALESCE-ing every column against every call) is what makes "clear
// this field" and "don't touch this field" distinguishable at the SQL level.
export async function saveComplianceChecklist({ id, userId, ...fields }) {
  const presentKeys = Object.keys(fields).filter((k) => k in COMPLIANCE_CHECKLIST_COLUMNS)
  const params = [id, userId]
  const insertCols = ['id', 'user_id']
  const setClauses = []
  for (const key of presentKeys) {
    params.push(fields[key])
    const col = COMPLIANCE_CHECKLIST_COLUMNS[key]
    insertCols.push(col)
    setClauses.push(`${col} = $${params.length}`)
  }
  const placeholders = params.map((_, i) => `$${i + 1}`).join(', ')
  const setSql = setClauses.length ? `${setClauses.join(', ')}, updated_at = now()` : 'updated_at = now()'
  await pool.query(
    `INSERT INTO compliance_checklist (${insertCols.join(', ')}, updated_at)
     VALUES (${placeholders}, now())
     ON CONFLICT (user_id) DO UPDATE SET ${setSql}`,
    params
  )
}

const CLIENT_RISK_ENTRY_COLUMNS = `id, reference_label AS "referenceLabel", risk_rating AS "riskRating", cdd_type AS "cddType", onboarded_date AS "onboardedDate", last_review_date AS "lastReviewDate", next_review_date AS "nextReviewDate", status, notes, case_status AS "caseStatus", created_at AS "createdAt", updated_at AS "updatedAt"`

export async function getClientRiskEntries(userId) {
  const { rows } = await pool.query(
    `SELECT ${CLIENT_RISK_ENTRY_COLUMNS} FROM client_risk_entries WHERE user_id = $1 ORDER BY next_review_date ASC NULLS LAST, created_at DESC`,
    [userId]
  )
  return rows
}

export async function createClientRiskEntry({ id, userId, referenceLabel, riskRating, cddType, onboardedDate, nextReviewDate, notes }) {
  const { rows } = await pool.query(
    `INSERT INTO client_risk_entries (id, user_id, reference_label, risk_rating, cdd_type, onboarded_date, next_review_date, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING ${CLIENT_RISK_ENTRY_COLUMNS}`,
    [id, userId, referenceLabel, riskRating, cddType, onboardedDate ?? null, nextReviewDate ?? null, notes ?? null]
  )
  return rows[0]
}

const CLIENT_RISK_ENTRY_SETTABLE_COLUMNS = {
  referenceLabel: 'reference_label',
  riskRating: 'risk_rating',
  cddType: 'cdd_type',
  onboardedDate: 'onboarded_date',
  lastReviewDate: 'last_review_date',
  nextReviewDate: 'next_review_date',
  status: 'status',
  notes: 'notes',
  caseStatus: 'case_status',
}

// Same dynamic-SET approach as saveComplianceChecklist above — only keys
// present on `fields` are written, so a field can be explicitly cleared
// (value: null) without also silently reverting every omitted field.
export async function updateClientRiskEntry({ id, userId, ...fields }) {
  const presentKeys = Object.keys(fields).filter((k) => k in CLIENT_RISK_ENTRY_SETTABLE_COLUMNS)
  const params = [id, userId]
  const setClauses = []
  for (const key of presentKeys) {
    params.push(fields[key])
    setClauses.push(`${CLIENT_RISK_ENTRY_SETTABLE_COLUMNS[key]} = $${params.length}`)
  }
  const setSql = setClauses.length ? `${setClauses.join(', ')}, updated_at = now()` : 'updated_at = now()'
  const { rows } = await pool.query(
    `UPDATE client_risk_entries SET ${setSql}
     WHERE id = $1 AND user_id = $2
     RETURNING ${CLIENT_RISK_ENTRY_COLUMNS}`,
    params
  )
  return rows[0] || null
}

export async function deleteClientRiskEntry(id, userId) {
  const { rowCount } = await pool.query(
    'DELETE FROM client_risk_entries WHERE id = $1 AND user_id = $2',
    [id, userId]
  )
  return rowCount > 0
}

const CASE_NOTE_COLUMNS = `id, entry_id AS "entryId", note, created_at AS "createdAt"`

export async function getCaseNotes(entryId, userId) {
  const { rows } = await pool.query(
    `SELECT ${CASE_NOTE_COLUMNS} FROM client_risk_case_notes WHERE entry_id = $1 AND user_id = $2 ORDER BY created_at ASC`,
    [entryId, userId]
  )
  return rows
}

// Guards against attaching a note to an entry_id the caller doesn't own —
// the WHERE EXISTS makes the insert a no-op (rowCount 0) rather than
// trusting entry_id on its own, since it arrives as a route param.
export async function addCaseNote({ id, entryId, userId, note }) {
  const { rows } = await pool.query(
    `INSERT INTO client_risk_case_notes (id, entry_id, user_id, note)
     SELECT $1, $2, $3, $4
     WHERE EXISTS (SELECT 1 FROM client_risk_entries WHERE id = $2 AND user_id = $3)
     RETURNING ${CASE_NOTE_COLUMNS}`,
    [id, entryId, userId, note]
  )
  return rows[0] || null
}

export async function deleteCaseNote(id, userId) {
  const { rowCount } = await pool.query(
    'DELETE FROM client_risk_case_notes WHERE id = $1 AND user_id = $2',
    [id, userId]
  )
  return rowCount > 0
}

const CHAT_SESSION_COLUMNS = `id, title, messages, created_at AS "createdAt", updated_at AS "updatedAt"`

export async function getChatSessions(userId) {
  const { rows } = await pool.query(
    `SELECT ${CHAT_SESSION_COLUMNS} FROM chat_sessions WHERE user_id = $1 ORDER BY updated_at DESC`,
    [userId]
  )
  return rows
}

export async function createChatSession({ id, userId, title, messages }) {
  const { rows } = await pool.query(
    `INSERT INTO chat_sessions (id, user_id, title, messages) VALUES ($1, $2, $3, $4) RETURNING ${CHAT_SESSION_COLUMNS}`,
    [id, userId, title, JSON.stringify(messages || [])]
  )
  return rows[0]
}

export async function updateChatSession({ id, userId, title, messages }) {
  const { rows } = await pool.query(
    `UPDATE chat_sessions SET
       title = COALESCE($3, title),
       messages = COALESCE($4, messages),
       updated_at = now()
     WHERE id = $1 AND user_id = $2
     RETURNING ${CHAT_SESSION_COLUMNS}`,
    [id, userId, title ?? null, messages ? JSON.stringify(messages) : null]
  )
  return rows[0] || null
}

export async function deleteChatSession(id, userId) {
  const { rowCount } = await pool.query(
    'DELETE FROM chat_sessions WHERE id = $1 AND user_id = $2',
    [id, userId]
  )
  return rowCount > 0
}

export async function createDocumentVersion({ id, userId, docType, businessName, intake, draftText }) {
  await pool.query(
    'INSERT INTO document_versions (id, user_id, doc_type, business_name, intake, draft_text) VALUES ($1, $2, $3, $4, $5, $6)',
    [id, userId, docType, businessName ?? null, intake, draftText ?? null]
  )
}

export async function getDocumentVersions(userId, docType, limit = 20) {
  const { rows } = await pool.query(
    'SELECT id, business_name AS "businessName", intake, draft_text AS "draftText", created_at AS "createdAt" FROM document_versions WHERE user_id = $1 AND doc_type = $2 ORDER BY created_at DESC LIMIT $3',
    [userId, docType, limit]
  )
  return rows
}

export async function logAiUsage({ id, userId, route, model, inputTokens, outputTokens }) {
  await pool.query(
    'INSERT INTO ai_usage_log (id, user_id, route, model, input_tokens, output_tokens) VALUES ($1, $2, $3, $4, $5, $6)',
    [id, userId, route, model, inputTokens, outputTokens]
  )
}

// Cost is derived here from raw token counts rather than stored per-row, so
// updating these constants to match Anthropic's actual published rate
// re-prices every historical row correctly instead of leaving old rows
// stuck with whatever rate was baked in at insert time. Defaults are a
// placeholder for Claude Haiku — replace with the confirmed current rate
// from console.anthropic.com/settings/billing before treating the dollar
// figures as more than a rough order of magnitude.
const HAIKU_INPUT_COST_PER_MTOK = Number(process.env.AI_COST_INPUT_PER_MTOK || 1)
const HAIKU_OUTPUT_COST_PER_MTOK = Number(process.env.AI_COST_OUTPUT_PER_MTOK || 5)

export async function getAiUsageSummary({ since } = {}) {
  const params = []
  let whereClause = ''
  if (since) {
    params.push(since)
    whereClause = 'WHERE created_at >= $1'
  }

  const [totalsResult, byUserResult, byRouteResult] = await Promise.all([
    pool.query(
      `SELECT count(*)::int AS requests, coalesce(sum(input_tokens), 0)::bigint AS "inputTokens", coalesce(sum(output_tokens), 0)::bigint AS "outputTokens"
       FROM ai_usage_log ${whereClause}`,
      params
    ),
    pool.query(
      `SELECT u.id AS "userId", u.email, u.name, count(*)::int AS requests,
              coalesce(sum(l.input_tokens), 0)::bigint AS "inputTokens", coalesce(sum(l.output_tokens), 0)::bigint AS "outputTokens"
       FROM ai_usage_log l JOIN users u ON u.id = l.user_id
       ${whereClause}
       GROUP BY u.id, u.email, u.name
       ORDER BY sum(l.input_tokens + l.output_tokens) DESC
       LIMIT 100`,
      params
    ),
    pool.query(
      `SELECT route, count(*)::int AS requests, coalesce(sum(input_tokens), 0)::bigint AS "inputTokens", coalesce(sum(output_tokens), 0)::bigint AS "outputTokens"
       FROM ai_usage_log ${whereClause}
       GROUP BY route
       ORDER BY sum(input_tokens + output_tokens) DESC`,
      params
    ),
  ])

  const estimateCost = (inputTokens, outputTokens) =>
    (Number(inputTokens) / 1_000_000) * HAIKU_INPUT_COST_PER_MTOK + (Number(outputTokens) / 1_000_000) * HAIKU_OUTPUT_COST_PER_MTOK

  const totals = totalsResult.rows[0]
  return {
    ratesUsed: { inputPerMTok: HAIKU_INPUT_COST_PER_MTOK, outputPerMTok: HAIKU_OUTPUT_COST_PER_MTOK },
    totals: { ...totals, estimatedCostUsd: estimateCost(totals.inputTokens, totals.outputTokens) },
    byUser: byUserResult.rows.map((r) => ({ ...r, estimatedCostUsd: estimateCost(r.inputTokens, r.outputTokens) })),
    byRoute: byRouteResult.rows.map((r) => ({ ...r, estimatedCostUsd: estimateCost(r.inputTokens, r.outputTokens) })),
  }
}

export async function updateUserStripeInfo(email, { stripeCustomerId, stripeSubscriptionId }) {
  await pool.query(
    'UPDATE users SET stripe_customer_id = $1, stripe_subscription_id = $2 WHERE email = $3',
    [stripeCustomerId, stripeSubscriptionId ?? null, email]
  )
}

export async function setPremiumByStripeCustomerId(stripeCustomerId, premium, stripeSubscriptionId, plan) {
  const { rows } = await pool.query(
    'UPDATE users SET premium = $1, stripe_subscription_id = $2, plan = COALESCE($4, plan) WHERE stripe_customer_id = $3 RETURNING email, name',
    [premium, stripeSubscriptionId ?? null, stripeCustomerId, plan ?? null]
  )
  return rows[0] || null
}

const SESSION_TTL = '30 days'

export async function createSession(token, email) {
  // Opportunistic cleanup so the table doesn't grow unbounded — cheap enough
  // to run on every login without a separate cron job.
  await pool.query(`DELETE FROM sessions WHERE created_at <= now() - interval '${SESSION_TTL}'`)
  await pool.query('INSERT INTO sessions (token, email) VALUES ($1, $2)', [token, email])
}

export async function getSessionEmail(token) {
  const { rows } = await pool.query(
    `SELECT email FROM sessions WHERE token = $1 AND created_at > now() - interval '${SESSION_TTL}'`,
    [token]
  )
  return rows[0]?.email || null
}

export async function deleteSession(token) {
  await pool.query('DELETE FROM sessions WHERE token = $1', [token])
}
