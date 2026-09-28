import { useMemo } from "react"

import { synthesizeRescueSituation } from "@/data/mock-rescue-intel"
import { useAlertsBus } from "@/lib/alerts-bus"

/**
 * ponytail: reads the shared alerts bus (same stream as Module 6) and
 * synthesizes the single highest-priority rescue situation. Swap the
 * rules in synthesizeRescueSituation for the backend recommendation
 * service later.
 */
export function useMockRescueIntelFeed() {
  const { alerts } = useAlertsBus()

  const situation = useMemo(() => synthesizeRescueSituation(alerts), [alerts])

  return { situation, alertCount: alerts.filter((a) => !a.acknowledged).length }
}
