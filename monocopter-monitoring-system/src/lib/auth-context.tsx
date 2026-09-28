import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

import { authApi, type AuthUser } from "@/lib/auth-api"

type AuthContextValue = {
  user: AuthUser | null
  status: "loading" | "signed-in" | "signed-out"
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  loginWithGoogle: (credential: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [status, setStatus] = useState<AuthContextValue["status"]>("loading")

  useEffect(() => {
    authApi
      .me()
      .then(({ user }) => {
        setUser(user)
        setStatus("signed-in")
      })
      .catch(() => setStatus("signed-out"))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { user } = await authApi.login(email, password)
    setUser(user)
    setStatus("signed-in")
  }, [])

  const register = useCallback(async (name: string, email: string, password: string) => {
    const { user } = await authApi.register(name, email, password)
    setUser(user)
    setStatus("signed-in")
  }, [])

  const loginWithGoogle = useCallback(async (credential: string) => {
    const { user } = await authApi.loginWithGoogle(credential)
    setUser(user)
    setStatus("signed-in")
  }, [])

  const logout = useCallback(async () => {
    await authApi.logout().catch(() => {})
    setUser(null)
    setStatus("signed-out")
  }, [])

  const value = useMemo(
    () => ({ user, status, login, register, loginWithGoogle, logout }),
    [user, status, login, register, loginWithGoogle, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
