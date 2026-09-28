import Database from "better-sqlite3"
import bcrypt from "bcryptjs"
import path from "node:path"

const db = new Database(path.join(import.meta.dirname, "minewatch.db"))
db.pragma("journal_mode = WAL")

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT,
    google_id TEXT UNIQUE,
    email_verified INTEGER NOT NULL DEFAULT 0,
    reset_token TEXT,
    reset_token_expires_at INTEGER,
    created_at INTEGER NOT NULL
  );
`)

// Seeded demo account so anyone can sign in without registering or configuring Google OAuth.
// Same fixed credentials on every machine - fine for a hackathon demo, not for real users.
export const DEMO_EMAIL = "demo@minewatch.app"
export const DEMO_PASSWORD = "MineWatch#2026"

db.prepare(
  `INSERT INTO users (id, name, email, password_hash, email_verified, created_at)
   VALUES ('demo-user', 'Demo Operator', ?, ?, 1, 0)
   ON CONFLICT(email) DO NOTHING`
).run(DEMO_EMAIL, bcrypt.hashSync(DEMO_PASSWORD, 12))

export default db
