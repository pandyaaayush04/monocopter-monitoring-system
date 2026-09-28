import { useEffect, useState } from "react"
import { THERMAL_HEALTH_PATH, type ThermalDetection } from "@/data/mock-thermal"

const POLL_MS = 5000

/**
 * ponytail: NOT a simulation — this is a real endpoint probe. There is no
 * mock thermal data by design (a fake heat filter over RGB would
 * misrepresent a sensor reading that doesn't exist). When
 * detection-server/ gains a thermal source + temperature-to-color mapping,
 * serve THERMAL_HEALTH_PATH + /thermal_feed and this hook lights up with
 * no dashboard changes.
 */
export function useMockThermalFeed() {
  const [online, setOnline] = useState(false)
  const [detections] = useState<ThermalDetection[]>([])

  useEffect(() => {
    let cancelled = false
    async function probe() {
      try {
        const res = await fetch(THERMAL_HEALTH_PATH)
        if (!cancelled) setOnline(res.ok)
      } catch {
        if (!cancelled) setOnline(false)
      }
    }
    probe()
    const id = setInterval(probe, POLL_MS)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  return { online, detections }
}
