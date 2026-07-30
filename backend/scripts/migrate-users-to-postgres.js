import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { pool } from '../db.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const USERS_FILE = path.join(__dirname, '..', 'users.json')

async function migrate() {
  if (!fs.existsSync(USERS_FILE)) {
    console.log('No users.json found — nothing to migrate.')
    return
  }
  const data = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'))
  const entries = Object.values(data)
  console.log(`Migrating ${entries.length} user(s) from users.json to Postgres...`)
  for (const u of entries) {
    await pool.query(
      `INSERT INTO users (id, name, email, password_hash, premium)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO NOTHING`,
      [u.id, u.name, u.email, u.passwordHash, !!u.premium]
    )
    console.log(`  ✓ ${u.email}`)
  }
  console.log('Done.')
}

migrate()
  .catch((err) => {
    console.error('Migration failed:', err)
    process.exitCode = 1
  })
  .finally(() => pool.end())
