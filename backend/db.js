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
})

export async function getUserByEmail(email) {
  const { rows } = await pool.query(
    'SELECT id, name, email, password_hash AS "passwordHash", premium, stripe_customer_id AS "stripeCustomerId", stripe_subscription_id AS "stripeSubscriptionId" FROM users WHERE email = $1',
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

export async function saveComplianceChecklist({ id, userId, programReviewDate, independentEvalDate, staffTrainingDate, privacyReviewDate, acrLodgedYear }) {
  await pool.query(
    `INSERT INTO compliance_checklist (id, user_id, program_review_date, independent_eval_date, staff_training_date, privacy_review_date, acr_lodged_year, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, now())
     ON CONFLICT (user_id) DO UPDATE SET
       program_review_date = COALESCE($3, compliance_checklist.program_review_date),
       independent_eval_date = COALESCE($4, compliance_checklist.independent_eval_date),
       staff_training_date = COALESCE($5, compliance_checklist.staff_training_date),
       privacy_review_date = COALESCE($6, compliance_checklist.privacy_review_date),
       acr_lodged_year = COALESCE($7, compliance_checklist.acr_lodged_year),
       updated_at = now()`,
    [id, userId, programReviewDate ?? null, independentEvalDate ?? null, staffTrainingDate ?? null, privacyReviewDate ?? null, acrLodgedYear ?? null]
  )
}

const CLIENT_RISK_ENTRY_COLUMNS = `id, reference_label AS "referenceLabel", risk_rating AS "riskRating", cdd_type AS "cddType", onboarded_date AS "onboardedDate", last_review_date AS "lastReviewDate", next_review_date AS "nextReviewDate", status, notes, created_at AS "createdAt", updated_at AS "updatedAt"`

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

export async function updateClientRiskEntry({ id, userId, referenceLabel, riskRating, cddType, onboardedDate, lastReviewDate, nextReviewDate, status, notes }) {
  const { rows } = await pool.query(
    `UPDATE client_risk_entries SET
       reference_label = COALESCE($3, reference_label),
       risk_rating = COALESCE($4, risk_rating),
       cdd_type = COALESCE($5, cdd_type),
       onboarded_date = COALESCE($6, onboarded_date),
       last_review_date = COALESCE($7, last_review_date),
       next_review_date = COALESCE($8, next_review_date),
       status = COALESCE($9, status),
       notes = COALESCE($10, notes),
       updated_at = now()
     WHERE id = $1 AND user_id = $2
     RETURNING ${CLIENT_RISK_ENTRY_COLUMNS}`,
    [id, userId, referenceLabel ?? null, riskRating ?? null, cddType ?? null, onboardedDate ?? null, lastReviewDate ?? null, nextReviewDate ?? null, status ?? null, notes ?? null]
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

export async function updateUserStripeInfo(email, { stripeCustomerId, stripeSubscriptionId }) {
  await pool.query(
    'UPDATE users SET stripe_customer_id = $1, stripe_subscription_id = $2 WHERE email = $3',
    [stripeCustomerId, stripeSubscriptionId ?? null, email]
  )
}

export async function setPremiumByStripeCustomerId(stripeCustomerId, premium, stripeSubscriptionId) {
  await pool.query(
    'UPDATE users SET premium = $1, stripe_subscription_id = $2 WHERE stripe_customer_id = $3',
    [premium, stripeSubscriptionId ?? null, stripeCustomerId]
  )
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
