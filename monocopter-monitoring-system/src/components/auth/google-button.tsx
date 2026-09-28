import { useEffect, useRef, useState } from "react"

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string
            callback: (response: { credential: string }) => void
            error_callback?: (error: { type: string }) => void
          }) => void
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void
        }
      }
    }
  }
}

const GSI_SCRIPT_SRC = "https://accounts.google.com/gsi/client"
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined

let scriptPromise: Promise<void> | null = null
function loadGoogleScript() {
  if (scriptPromise) return scriptPromise
  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${GSI_SCRIPT_SRC}"]`)
    if (existing) return resolve()
    const script = document.createElement("script")
    script.src = GSI_SCRIPT_SRC
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error("Failed to load Google Sign-In."))
    document.head.appendChild(script)
  })
  return scriptPromise
}

export function GoogleButton({
  onCredential,
  onError,
  disabled,
}: {
  onCredential: (credential: string) => void
  onError: (message: string) => void
  disabled?: boolean
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!CLIENT_ID) {
      onError("Google sign-in is not configured for this deployment.")
      return
    }
    let cancelled = false

    loadGoogleScript()
      .then(() => {
        if (cancelled || !window.google || !containerRef.current) return
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: (response) => onCredential(response.credential),
          error_callback: () => onError("Google sign-in was cancelled or could not be completed."),
        })
        window.google.accounts.id.renderButton(containerRef.current, {
          theme: "outline",
          size: "large",
          width: 320,
          text: "continue_with",
        })
        setReady(true)
      })
      .catch(() => onError("Google authentication could not be completed. Please try again."))

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="relative" aria-disabled={disabled} style={{ pointerEvents: disabled ? "none" : "auto", opacity: disabled ? 0.6 : 1 }}>
      {/* Google's SDK writes its button directly into this node - React must never touch its children. */}
      <div
        ref={containerRef}
        className="flex justify-center [&>div]:!w-full [&_iframe]:!w-full"
        style={{ visibility: ready ? "visible" : "hidden" }}
      />
      {!ready && <div className="absolute inset-0 h-10 w-full animate-pulse rounded-lg bg-muted" aria-hidden="true" />}
    </div>
  )
}
