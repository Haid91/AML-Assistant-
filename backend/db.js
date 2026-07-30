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
