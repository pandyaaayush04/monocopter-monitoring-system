# MineWatch Auth Server

Minimal real auth backend for the MineWatch dashboard: email/password (bcrypt + JWT httpOnly cookie sessions) and Google Sign-In. SQLite file DB, zero external services required to run locally.

## Setup

```bash
cd auth-server
npm install
cp .env.example .env   # fill in JWT_SECRET and GOOGLE_CLIENT_ID
npm run dev
```

Serves on `http://localhost:8787`. The dashboard (`monocopter-monitoring-system/`) talks to it via `VITE_AUTH_API_URL` (defaults to that URL).

## Endpoints

| Endpoint | Body | Notes |
|---|---|---|
| `POST /api/auth/register` | `{ name, email, password }` | bcrypt-hashes password, sets session cookie |
| `POST /api/auth/login` | `{ email, password }` | |
| `POST /api/auth/google` | `{ credential }` | Google ID token from Google Identity Services, verified server-side |
| `POST /api/auth/logout` | — | clears session cookie |
| `GET /api/auth/me` | — | current user from session cookie |
| `POST /api/auth/forgot-password` | `{ email }` | generates + stores a reset token, **logs it to the console** instead of emailing (no mail provider wired up yet) |
| `POST /api/auth/reset-password` | `{ token, password }` | |

## Demo account

A fixed demo account is seeded on first run so anyone can sign in on any machine without registering or configuring Google OAuth:

```
email:    demo@minewatch.app
password: MineWatch#2026
```

Same credentials everywhere on purpose - convenient for a hackathon demo, not something to keep around for real users.

## Security notes

- Sessions are a JWT in an `httpOnly`, `SameSite=Lax` cookie — never touched by frontend JS, never put in localStorage.
- Passwords are hashed with bcrypt (cost 12); plaintext is never stored or logged.
- State-changing requests are rejected unless their `Origin` matches `CORS_ORIGIN` (CSRF mitigation for the SameSite=Lax gap).
- Auth endpoints are rate-limited per IP (in-memory — fine for one instance; swap for a shared store like Redis before scaling past one process).
- Error responses are generic by design; real errors go to `console.error` only.

## Known gaps (flagged, not hidden)

- No email delivery — password reset tokens are logged, not emailed. Wire up an email provider (Resend, SES, etc.) before this handles real users.
- Rate limiting is in-memory, per-process. Fine for a single instance / demo.
