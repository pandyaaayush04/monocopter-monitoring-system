import { useEffect, useState } from "react"
import { SIGNAL_CONFIG, statusForSignal } from "@/data/mock-system-status"

const TICK_MS = 3000

export function useMockSignalFeed() {
  const [pct, setPct] = useState(SIGNAL_CONFIG.start)

  useEffect(() => {
    const id = setInterval(() => {
      setPct((prev) => {
        const next = prev + (Math.random() - 0.5) * SIGNAL_CONFIG.volatility
        return Math.min(100, Math.max(0, Number(next.toFixed(0))))
      })
    }, TICK_MS)
    return () => clearInterval(id)
  }, [])

  return { pct, status: statusForSignal(pct) }
}
