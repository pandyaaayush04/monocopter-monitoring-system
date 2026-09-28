import { useId, useState } from "react"
import { EyeIcon, EyeSlashIcon } from "@phosphor-icons/react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "cn"

function strengthOf(password: string) {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++
  return Math.min(score, 4)
}

const STRENGTH_LABEL = ["Too weak", "Weak", "Fair", "Good", "Strong"]

export function PasswordField({
  label,
  value,
  onChange,
  error,
  autoComplete,
  showStrength,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string | null
  autoComplete: string
  showStrength?: boolean
}) {
  const [visible, setVisible] = useState(false)
  const id = useId()
  const errorId = `${id}-error`
  const strength = showStrength ? strengthOf(value) : 0

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className="pr-9"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute top-1/2 right-2 flex size-6 -translate-y-1/2 items-center justify-center rounded text-muted-foreground hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          aria-label={visible ? "Hide password" : "Show password"}
          tabIndex={-1}
        >
          {visible ? <EyeSlashIcon /> : <EyeIcon />}
        </button>
      </div>
      {showStrength && value.length > 0 && (
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <div className="flex flex-1 gap-1">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={cn(
                  "h-1 flex-1 rounded-full bg-muted",
                  i < strength && strength <= 1 && "bg-destructive",
                  i < strength && strength === 2 && "bg-warning",
                  i < strength && strength >= 3 && "bg-safe"
                )}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">{STRENGTH_LABEL[strength]}</span>
        </div>
      )}
      {error && (
        <p id={errorId} className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
