import { useState } from "react"

import { BackToTop } from "@/pages/landing/back-to-top"
import { Closing } from "@/pages/landing/closing"
import { Hero } from "@/pages/landing/hero"
import { HowItWorks } from "@/pages/landing/how-it-works"
import { MineIntel } from "@/pages/landing/mine-intel"
import { Monocopter } from "@/pages/landing/monocopter"
import { Navbar } from "@/pages/landing/navbar"
import { Reality } from "@/pages/landing/reality"
import { RescueIntel } from "@/pages/landing/rescue-intel"
import { Vision } from "@/pages/landing/vision"
import { AuthModal } from "@/components/auth/auth-modal"
import { useAuth } from "@/lib/auth-context"

const THEME_KEY = "minewatch-landing-theme"

export function LandingPage({ onExplore }: { onExplore: () => void }) {
  const [theme, setTheme] = useState<"dark" | "light">(() =>
    window.localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark",
  )
  const { status } = useAuth()
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "register">("login")

  function toggleTheme() {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark"
      window.localStorage.setItem(THEME_KEY, next)
      return next
    })
  }

  function openAuth(mode: "login" | "register") {
    setAuthMode(mode)
    setAuthOpen(true)
  }

  function handleExplore() {
    if (status === "signed-in") {
      onExplore()
    } else {
      openAuth("login")
    }
  }

  return (
    <div className={`min-h-screen bg-background text-foreground transition-colors ${theme === "dark" ? "landing-dark" : ""}`}>
      <Navbar onExplore={handleExplore} theme={theme} onToggleTheme={toggleTheme} onOpenAuth={openAuth} />
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} initialMode={authMode} />
      <main>
        <Hero onExplore={handleExplore} />
        <Reality />
        <HowItWorks />
        <MineIntel />
        <Vision />
        <RescueIntel />
        <Monocopter />
        <Closing onExplore={handleExplore} />
      </main>
      <BackToTop />
    </div>
  )
}
