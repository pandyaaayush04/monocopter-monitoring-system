import { useState } from "react"
import { seedSessions } from "@/data/mock-history"

/**
 * ponytail: static past-mission log, no ticking (history doesn't change
 * live). Swap for a fetch against the persisted mission store later —
 * newest-first sessions + selected id is what the table/replay consume.
 */
export function useMockHistoryFeed() {
  const [sessions] = useState(() => seedSessions())
  const [selectedId, setSelectedId] = useState(sessions[0]?.id ?? "")

  const selected = sessions.find((s) => s.id === selectedId) ?? sessions[0]

  return { sessions, selected, selectedId, select: setSelectedId }
}
