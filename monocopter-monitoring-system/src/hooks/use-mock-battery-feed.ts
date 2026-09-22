import { useEffect, useRef, useState } from "react"
import { BATTERY_CONFIG, seedBatterySeries, statusForBattery, type BatteryPoint } from "@/data/mock-battery"

const TICK_MS = 3000

/**
 * ponytail: linear-drain simulation with light noise, ticking on an
 * interval. Swap for telemetry from the flight controller later — the
 * series + pct + status shape is what the gauge/chart consume.
 */
export function useMockBatteryFeed() {
  const seriesRef = useRef<BatteryPoint[]>(seedBatterySeries())
  const missionStartRef = useRef(Date.now())
  const [, force] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      const series = seriesRef.current
      const last = series[series.length - 1].pct
      const next = Math.max(0, last - BATTERY_CONFIG.drainPerTick - (Math.random() - 0.5) * 0.1)
      seriesRef.current = [...series.slice(1), { t: Date.now(), pct: Number(next.toFixed(2)) }]
      force((n) => n + 1)
    }, TICK_MS)
    return () => clearInterval(id)
  }, [])

  const series = seriesRef.current
  const pct = series[series.length - 1].pct

  return {
    series,
    pct,
    status: statusForBattery(pct),
    missionStart: missionStartRef.current,
  }
}
