import "dotenv/config"
import crypto from "node:crypto"
import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { OAuth2Client } from "google-auth-library"
import db from "./db.js"

const { JWT_SECRET, GOOGLE_CLIENT_ID, PORT = 8787 } = process.env
if (!JWT_SECRET) throw new Error("JWT_SECRET is required (see .env.example)")

const ORIGINS = (process.env.CORS_ORIGIN || "http://localhost:5173").split(",").map((o) => o.trim())
const COOKIE_NAME = "mw_session"
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null

const app = express()
app.use(express.json({ limit: "16kb" }))
app.use(cookieParser())
app.use(cors({ origin: ORIGINS, credentials: true }))

// CSRF mitigation: state-changing requests must come from an allowed origin.
// (Cookie is SameSite=Lax, so this covers the cross-site-form-post gap.)
app.use((req, res, next) => {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next()
  const origin = req.headers.origin
  if (origin && !ORIGINS.includes(origin)) {
    return res.status(403).json({ error: "Request origin not allowed." })
  }
  next()
})

// --- naive in-memory rate limiter: max `limit` hits per `windowMs` per IP+route ---
const hits = new Map()
function rateLimit(limit, windowMs) {
  return (req, res, next) => {
    const key = `${req.path}:${req.ip}`
    const now = Date.now()
    const entry = hits.get(key)
    if (!entry || now - entry.start > windowMs) {
      hits.set(key, { start: now, count: 1 })
      return next()
    }
    entry.count += 1
    if (entry.count > limit) {
      return res.status(429).json({ error: "Too many attempts. Please wait a moment and try again." })
    }
    next()
  }
}

// --- validation ---
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase()
}
function validatePassword(password) {
  if (typeof password !== "string" || password.length < 8) return "Password must be at least 8 characters."
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) return "Password must include a letter and a number."
  return null
}

function toPublicUser(row) {
  return { id: row.id, name: row.name, email: row.email, emailVerified: !!row.email_verified, hasPassword: !!row.password_hash }
}

function issueSession(res, user) {
  const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: "7d" })
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE_MS,
    path: "/",
  })
}

function requireAuth(req, res, next) {
  const token = req.cookies[COOKIE_NAME]
  if (!token) return res.status(401).json({ error: "Not signed in." })
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(payload.sub)
    if (!user) return res.status(401).json({ error: "Not signed in." })
    req.user = user
    next()
  } catch {
    return res.status(401).json({ error: "Session expired. Please sign in again." })
  }
}

app.get("/health", (_req, res) => res.json({ ok: true }))

app.post("/api/auth/register", rateLimit(10, 15 * 60 * 1000), (req, res) => {
  try {
    const name = String(req.body?.name || "").trim()
    const email = normalizeEmail(req.body?.email)
    const password = req.body?.password

    if (name.length < 2) return res.status(400).json({ error: "Please enter your full name." })
    if (!EMAIL_RE.test(email)) return res.status(400).json({ error: "Please enter a valid email address." })
    const pwError = validatePassword(password)
    if (pwError) return res.status(400).json({ error: pwError })

    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email)
    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists. Try signing in instead." })
    }

    const user = {
      id: crypto.randomUUID(),
      name,
      email,
      password_hash: bcrypt.hashSync(password, 12),
      created_at: Date.now(),
    }
    db.prepare(
      "INSERT INTO users (id, name, email, password_hash, created_at) VALUES (@id, @name, @email, @password_hash, @created_at)"
    ).run(user)

    issueSession(res, user)
    res.status(201).json({ user: toPublicUser(user) })
  } catch (err) {
    console.error("register failed:", err)
    res.status(500).json({ error: "We couldn't create your account. Please try again." })
  }
})

app.post("/api/auth/login", rateLimit(10, 15 * 60 * 1000), (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email)
    const password = req.body?.password
    if (!EMAIL_RE.test(email) || !password) {
      return res.status(400).json({ error: "Please enter a valid email and password." })
    }

    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email)
    if (!user || !user.password_hash || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: "The email or password is incorrect." })
    }

    issueSession(res, user)
    res.json({ user: toPublicUser(user) })
  } catch (err) {
    console.error("login failed:", err)
    res.status(500).json({ error: "We couldn't sign you in. Please try again." })
  }
})

app.post("/api/auth/google", rateLimit(20, 15 * 60 * 1000), async (req, res) => {
  if (!googleClient) return res.status(503).json({ error: "Google sign-in is not configured." })
  try {
    const credential = req.body?.credential
    if (!credential) return res.status(400).json({ error: "Missing Google credential." })

    const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: GOOGLE_CLIENT_ID })
    const payload = ticket.getPayload()
    if (!payload?.email) return res.status(400).json({ error: "Google sign-in could not be completed. Please try again." })

    const email = normalizeEmail(payload.email)
    let user = db.prepare("SELECT * FROM users WHERE google_id = ?").get(payload.sub)

    if (!user) {
      // Account-linking: an existing password account with the same, Google-verified email gets linked.
      const existing = db.prepare("SELECT * FROM users WHERE email = ?").get(email)
      if (existing) {
        db.prepare("UPDATE users SET google_id = ?, email_verified = 1 WHERE id = ?").run(payload.sub, existing.id)
        user = db.prepare("SELECT * FROM users WHERE id = ?").get(existing.id)
      } else {
        user = {
          id: crypto.randomUUID(),
          name: payload.name || email.split("@")[0],
          email,
          google_id: payload.sub,
          email_verified: 1,
          created_at: Date.now(),
        }
        db.prepare(
          "INSERT INTO users (id, name, email, google_id, email_verified, created_at) VALUES (@id, @name, @email, @google_id, @email_verified, @created_at)"
        ).run(user)
      }
    }

    issueSession(res, user)
    res.json({ user: toPublicUser(user) })
  } catch (err) {
    console.error("google sign-in failed:", err)
    res.status(401).json({ error: "Google authentication could not be completed. Please try again." })
  }
})

app.post("/api/auth/logout", (_req, res) => {
  res.clearCookie(COOKIE_NAME, { path: "/" })
  res.json({ ok: true })
})

app.get("/api/auth/me", requireAuth, (req, res) => {
  res.json({ user: toPublicUser(req.user) })
})

// ponytail: no email transport wired up yet. Token is generated and stored for real,
// just logged instead of emailed. Wire up an email provider before this ships to real users.
app.post("/api/auth/forgot-password", rateLimit(5, 15 * 60 * 1000), (req, res) => {
  const email = normalizeEmail(req.body?.email)
  const user = EMAIL_RE.test(email) ? db.prepare("SELECT * FROM users WHERE email = ?").get(email) : null

  if (user) {
    const token = crypto.randomBytes(32).toString("hex")
    db.prepare("UPDATE users SET reset_token = ?, reset_token_expires_at = ? WHERE id = ?").run(
      token,
      Date.now() + 60 * 60 * 1000,
      user.id
    )
    console.log(`[password reset] ${user.email}: token=${token} (would be emailed)`)
  }

  // Same response whether or not the account exists, so we don't leak who has an account.
  res.json({ ok: true, message: "If an account exists for that email, a reset link has been sent." })
})

app.post("/api/auth/reset-password", rateLimit(10, 15 * 60 * 1000), (req, res) => {
  const { token } = req.body || {}
  const pwError = validatePassword(req.body?.password)
  if (pwError) return res.status(400).json({ error: pwError })

  const user = token ? db.prepare("SELECT * FROM users WHERE reset_token = ?").get(token) : null
  if (!user || !user.reset_token_expires_at || user.reset_token_expires_at < Date.now()) {
    return res.status(400).json({ error: "This reset link is invalid or has expired." })
  }

  db.prepare("UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires_at = NULL WHERE id = ?").run(
    bcrypt.hashSync(req.body.password, 12),
    user.id
  )
  res.json({ ok: true })
})

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error("unhandled error:", err)
  res.status(500).json({ error: "Something went wrong. Please try again." })
})

app.listen(PORT, () => console.log(`MineWatch auth server on http://localhost:${PORT}`))
