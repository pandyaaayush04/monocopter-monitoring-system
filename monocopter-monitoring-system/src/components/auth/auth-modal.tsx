import { useState, type FormEvent } from "react"
import { CheckCircleIcon, WarningCircleIcon } from "@phosphor-icons/react"

import { MinewatchMark } from "@/components/minewatch-mark"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PasswordField } from "@/components/auth/password-field"
import { GoogleButton } from "@/components/auth/google-button"
import { useAuth } from "@/lib/auth-context"
import { authApi, AuthApiError } from "@/lib/auth-api"

type Mode = "login" | "register" | "forgot"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Seeded on the backend (see auth-server/db.js) so it works on any machine, no setup required.
const DEMO_EMAIL = "demo@minewatch.app"
const DEMO_PASSWORD = "MineWatch#2026"

function FieldError({ id, message }: { id: string; message?: string | null }) {
  if (!message) return null
  return (
    <p id={id} className="text-xs text-destructive">
      {message}
    </p>
  )
}

export function AuthModal({
  open,
  onOpenChange,
  initialMode = "login",
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialMode?: Mode
}) {
  const { login, register, loginWithGoogle } = useAuth()
  const [mode, setMode] = useState<Mode>(initialMode)
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [forgotSent, setForgotSent] = useState(false)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  function reset() {
    setName("")
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    setFieldErrors({})
    setApiError(null)
    setForgotSent(false)
    setSubmitting(false)
  }

  function switchMode(next: Mode) {
    reset()
    setMode(next)
  }

  function handleOpenChange(next: boolean) {
    if (!next) reset()
    onOpenChange(next)
  }

  function validateLogin() {
    const errors: Record<string, string> = {}
    if (!EMAIL_RE.test(email.trim())) errors.email = "Please enter a valid email address."
    if (!password) errors.password = "Password is required."
    return errors
  }

  function validateRegister() {
    const errors: Record<string, string> = {}
    if (name.trim().length < 2) errors.name = "Please enter your full name."
    if (!EMAIL_RE.test(email.trim())) errors.email = "Please enter a valid email address."
    if (password.length < 8) errors.password = "Password must be at least 8 characters."
    else if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) errors.password = "Password must include a letter and a number."
    if (confirmPassword !== password) errors.confirmPassword = "Passwords do not match."
    return errors
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    if (submitting) return
    const errors = validateLogin()
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setSubmitting(true)
    setApiError(null)
    try {
      await login(email.trim().toLowerCase(), password)
      handleOpenChange(false)
    } catch (err) {
      setApiError(err instanceof AuthApiError ? err.message : "We couldn't connect to MineWatch. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleRegister(e: FormEvent) {
    e.preventDefault()
    if (submitting) return
    const errors = validateRegister()
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setSubmitting(true)
    setApiError(null)
    try {
      await register(name.trim(), email.trim().toLowerCase(), password)
      handleOpenChange(false)
    } catch (err) {
      setApiError(err instanceof AuthApiError ? err.message : "We couldn't connect to MineWatch. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleForgot(e: FormEvent) {
    e.preventDefault()
    if (submitting) return
    if (!EMAIL_RE.test(email.trim())) {
      setFieldErrors({ email: "Please enter a valid email address." })
      return
    }
    setSubmitting(true)
    setApiError(null)
    try {
      await authApi.forgotPassword(email.trim().toLowerCase())
      setForgotSent(true)
    } catch (err) {
      setApiError(err instanceof AuthApiError ? err.message : "We couldn't connect to MineWatch. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDemoLogin() {
    if (submitting) return
    setSubmitting(true)
    setApiError(null)
    try {
      await login(DEMO_EMAIL, DEMO_PASSWORD)
      handleOpenChange(false)
    } catch (err) {
      setApiError(err instanceof AuthApiError ? err.message : "We couldn't connect to MineWatch. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleGoogleCredential(credential: string) {
    setSubmitting(true)
    setApiError(null)
    try {
      await loginWithGoogle(credential)
      handleOpenChange(false)
    } catch (err) {
      setApiError(err instanceof AuthApiError ? err.message : "Google authentication could not be completed. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="mx-auto mb-1 flex size-10 items-center justify-center">
            <MinewatchMark className="h-8 w-8" />
          </div>
          <DialogTitle>
            {mode === "login" && "Access your mission console"}
            {mode === "register" && "Create your MineWatch account"}
            {mode === "forgot" && "Reset your password"}
          </DialogTitle>
          <DialogDescription>
            {mode === "login" && "Sign in to monitor live rescue operations."}
            {mode === "register" && "Set up credentials to access the mission console."}
            {mode === "forgot" && "Enter your email and we'll send you a reset link."}
          </DialogDescription>
        </DialogHeader>

        {apiError && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            <WarningCircleIcon className="mt-0.5 size-4 shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        {mode === "forgot" ? (
          forgotSent ? (
            <div className="flex flex-col items-center gap-3 py-2 text-center">
              <CheckCircleIcon className="size-8 text-safe" />
              <p className="text-sm text-foreground">If an account exists for that email, a reset link has been sent.</p>
              <Button variant="outline" onClick={() => switchMode("login")} className="mt-1">
                Back to sign in
              </Button>
            </div>
          ) : (
            <form onSubmit={handleForgot} noValidate className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="forgot-email">Email</Label>
                <Input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={fieldErrors.email ? "forgot-email-error" : undefined}
                />
                <FieldError id="forgot-email-error" message={fieldErrors.email} />
              </div>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Sending…" : "Send reset link"}
              </Button>
              <button
                type="button"
                onClick={() => switchMode("login")}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Back to sign in
              </button>
            </form>
          )
        ) : mode === "login" ? (
          <form onSubmit={handleLogin} noValidate className="flex flex-col gap-4">
            <Button type="button" variant="secondary" onClick={handleDemoLogin} disabled={submitting}>
              {submitting ? "Signing in…" : "Try demo account"}
            </Button>

            <div className="relative flex items-center py-1">
              <Separator className="flex-1" />
              <span className="px-2 text-xs tracking-wide text-muted-foreground">OR</span>
              <Separator className="flex-1" />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? "login-email-error" : undefined}
              />
              <FieldError id="login-email-error" message={fieldErrors.email} />
            </div>

            <PasswordField
              label="Password"
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
              error={fieldErrors.password}
            />

            <div className="-mt-2 flex justify-end">
              <button
                type="button"
                onClick={() => switchMode("forgot")}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Forgot password?
              </button>
            </div>

            <Button type="submit" disabled={submitting}>
              {submitting ? "Signing in…" : "Sign In"}
            </Button>

            <div className="relative flex items-center py-1">
              <Separator className="flex-1" />
              <span className="px-2 text-xs tracking-wide text-muted-foreground">OR</span>
              <Separator className="flex-1" />
            </div>

            <GoogleButton onCredential={handleGoogleCredential} onError={setApiError} disabled={submitting} />

            <p className="text-center text-sm text-muted-foreground">
              New here?{" "}
              <button type="button" onClick={() => switchMode("register")} className="font-medium text-foreground hover:underline">
                Create an account
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister} noValidate className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="register-name">Full Name</Label>
              <Input
                id="register-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                autoComplete="name"
                aria-invalid={!!fieldErrors.name}
                aria-describedby={fieldErrors.name ? "register-name-error" : undefined}
              />
              <FieldError id="register-name-error" message={fieldErrors.name} />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="register-email">Email</Label>
              <Input
                id="register-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? "register-email-error" : undefined}
              />
              <FieldError id="register-email-error" message={fieldErrors.email} />
            </div>

            <PasswordField
              label="Password"
              value={password}
              onChange={setPassword}
              autoComplete="new-password"
              error={fieldErrors.password}
              showStrength
            />

            <PasswordField
              label="Confirm Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              autoComplete="new-password"
              error={fieldErrors.confirmPassword}
            />

            <Button type="submit" disabled={submitting}>
              {submitting ? "Creating account…" : "Create Account"}
            </Button>

            <div className="relative flex items-center py-1">
              <Separator className="flex-1" />
              <span className="px-2 text-xs tracking-wide text-muted-foreground">OR</span>
              <Separator className="flex-1" />
            </div>

            <GoogleButton onCredential={handleGoogleCredential} onError={setApiError} disabled={submitting} />

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <button type="button" onClick={() => switchMode("login")} className="font-medium text-foreground hover:underline">
                Sign in
              </button>
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
