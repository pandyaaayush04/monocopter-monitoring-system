import { useState } from "react"

import { Closing } from "@/pages/landing/closing"
import { Hero } from "@/pages/landing/hero"
import { HowItWorks } from "@/pages/landing/how-it-works"
import { MineIntel } from "@/pages/landing/mine-intel"
import { Monocopter } from "@/pages/landing/monocopter"
import { Navbar } from "@/pages/landing/navbar"
import { Reality } from "@/pages/landing/reality"
import { RescueIntel } from "@/pages/landing/rescue-intel"
import { Vision } from "@/pages/landing/vision"

const THEME_KEY = "minewatch-landing-theme"

export function LandingPage({ onExplore }: { onExplore: () => void }) {
  const [theme, setTheme] = useState<"dark" | "light">(() =>
    window.localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark",
  )

  function toggleTheme() {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark"
      window.localStorage.setItem(THEME_KEY, next)
      return next
    })
  }

  return (
    <div className={`min-h-screen bg-background text-foreground transition-colors ${theme === "dark" ? "landing-dark" : ""}`}>
      <Navbar onExplore={onExplore} theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <Hero onExplore={onExplore} />
        <Reality />
        <HowItWorks />
        <MineIntel />
        <Vision />
        <RescueIntel />
        <Monocopter />
        <Closing onExplore={onExplore} />
      </main>
    </div>
  )
}
