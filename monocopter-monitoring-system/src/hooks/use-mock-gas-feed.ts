import { useEffect, useRef, useState } from "react"
import { GAS_CONFIG, seedSeries, statusFor, walk, type GasKey, type GasPoint, type GasStatus } from "@/data/mock-gas"

const TICK_MS = 3000

export type GasReading = {
  key: GasKey
  series: GasPoint[]
  current: number
  previous: number
  status: GasStatus
}

/**
 * ponytail: random-walk simulation seeded per gas, ticking on an interval.
 * Swap for a poll/WebSocket hook against the sensor gateway later — the
 * GasReading shape (series + current + status) is what the chart consumes.
 */
export function useMockGasFeed() {
  const seriesRef = useRef<Record<GasKey, GasPoint[]>>(
    Object.fromEntries(
      (Object.keys(GAS_CONFIG) as GasKey[]).map((k) => [k, seedSeries(GAS_CONFIG[k])]),
    ) as Record<GasKey, GasPoint[]>,
  )
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      for (const key of Object.keys(GAS_CONFIG) as GasKey[]) {
        const cfg = GAS_CONFIG[key]
        const series = seriesRef.current[key]
        const nextValue = Number(walk(series[series.length - 1].value, cfg).toFixed(2))
        seriesRef.current[key] = [...series.slice(1), { t: Date.now(), value: nextValue }]
      }
      setTick((t) => t + 1)
    }, TICK_MS)
    return () => clearInterval(id)
  }, [])

  const readings: Record<GasKey, GasReading> = Object.fromEntries(
    (Object.keys(GAS_CONFIG) as GasKey[]).map((key) => {
      const cfg = GAS_CONFIG[key]
      const series = seriesRef.current[key]
      const current = series[series.length - 1].value
      const previous = series[series.length - 2]?.value ?? current
      return [key, { key, series, current, previous, status: statusFor(cfg, current) }]
    }),
  ) as Record<GasKey, GasReading>

  const overall: GasStatus = (["danger", "warning", "safe"] as GasStatus[]).find((s) =>
    Object.values(readings).some((r) => r.status === s),
  )!

  return { readings, overall, tick }
}
