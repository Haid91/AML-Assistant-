import pg from 'pg'

const { Pool } = pg

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set. Add your Supabase Postgres connection string to backend/.env — see .env.example.')
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

export async function getUserByEmail(email) {
  const { rows } = await pool.query(
    'SELECT id, name, email, password_hash AS "passwordHash", premium FROM users WHERE email = $1',
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

export async function createSession(token, email) {
  await pool.query('INSERT INTO sessions (token, email) VALUES ($1, $2)', [token, email])
}

export async function getSessionEmail(token) {
  const { rows } = await pool.query('SELECT email FROM sessions WHERE token = $1', [token])
  return rows[0]?.email || null
}

export async function deleteSession(token) {
  await pool.query('DELETE FROM sessions WHERE token = $1', [token])
}
