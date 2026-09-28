const BASE_URL = import.meta.env.VITE_AUTH_API_URL || "http://localhost:8787"

export type AuthUser = {
  id: string
  name: string
  email: string
  emailVerified: boolean
  hasPassword: boolean
}

export class AuthApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      ...options,
    })
  } catch {
    throw new AuthApiError("We couldn't connect to MineWatch. Please check your connection and try again.", 0)
  }

  let body: unknown = null
  try {
    body = await res.json()
  } catch {
    // no/invalid body
  }

  if (!res.ok) {
    const message =
      (body as { error?: string } | null)?.error ||
      (res.status === 429
        ? "Too many attempts. Please wait a moment and try again."
        : "Something went wrong. Please try again.")
    throw new AuthApiError(message, res.status)
  }

  return body as T
}

export const authApi = {
  me: () => request<{ user: AuthUser }>("/api/auth/me"),
  register: (name: string, email: string, password: string) =>
    request<{ user: AuthUser }>("/api/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) }),
  login: (email: string, password: string) =>
    request<{ user: AuthUser }>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  loginWithGoogle: (credential: string) =>
    request<{ user: AuthUser }>("/api/auth/google", { method: "POST", body: JSON.stringify({ credential }) }),
  logout: () => request<{ ok: boolean }>("/api/auth/logout", { method: "POST" }),
  forgotPassword: (email: string) =>
    request<{ ok: boolean; message: string }>("/api/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }),
}
