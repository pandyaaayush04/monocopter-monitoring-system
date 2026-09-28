import { useCallback, useEffect, useRef, useState } from "react"
import {
  makeAlert,
  overallAlertStatus,
  randomAlertTemplate,
  seedAlerts,
  type AlertEvent,
} from "@/data/mock-alerts"

const TICK_MS = 8000
const MAX_ALERTS = 20

/**
 * ponytail: alert rollup with acknowledge/dismiss in state. Sourced from
 * the backend event bus — the AlertEvent shape (severity + source +
 * recommendedAction) is what the feed consumes.
 */
export function useMockAlertsFeed() {
  const [alerts, setAlerts] = useState<AlertEvent[]>(() => seedAlerts())
  const counterRef = useRef(0)

  useEffect(() => {
    const id = setInterval(() => {
      // ~35% chance of a new event per tick so the feed feels live
      // without spamming. Cap the list so it stays scrollable.
      if (Math.random() > 0.35) return
      counterRef.current += 1
      const event = makeAlert(randomAlertTemplate())
      setAlerts((prev) => [event, ...prev].slice(0, MAX_ALERTS))
    }, TICK_MS)
    return () => clearInterval(id)
  }, [])

  const acknowledge = useCallback((id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)))
  }, [])

  const dismiss = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const clearAcknowledged = useCallback(() => {
    setAlerts((prev) => prev.filter((a) => !a.acknowledged))
  }, [])

  const active = alerts.filter((a) => !a.acknowledged)
  const acknowledgedCount = alerts.length - active.length

  return {
    alerts,
    active,
    acknowledgedCount,
    overall: overallAlertStatus(alerts),
    activeCount: active.length,
    dangerCount: active.filter((a) => a.severity === "danger").length,
    warningCount: active.filter((a) => a.severity === "warning").length,
    acknowledge,
    dismiss,
    clearAcknowledged,
  }
}
