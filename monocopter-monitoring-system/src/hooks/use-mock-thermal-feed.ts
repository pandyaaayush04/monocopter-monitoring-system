import { useState } from "react"
import type { ThermalDetection } from "@/data/mock-thermal"

/** Static thermal clip bundled with the app - "online" just tracks whether it loaded. */
export function useMockThermalFeed() {
  const [online, setOnline] = useState(true)
  const [detections] = useState<ThermalDetection[]>([])

  return { online, setOnline, detections }
}
