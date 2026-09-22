import { useEffect, useRef, useState } from "react"
import { ENV_CONFIG, seedEnvSeries, walkEnv, type EnvKey, type EnvPoint } from "@/data/mock-environment"

const TICK_MS = 3000

export type EnvReading = { key: EnvKey; series: EnvPoint[]; current: number }

/**
 * ponytail: random-walk simulation, same pattern as the gas/battery feeds.
 * Swap for the real temperature/humidity sensor poll later.
 */
export function useMockEnvironmentFeed() {
  const seriesRef = useRef<Record<EnvKey, EnvPoint[]>>(
    Object.fromEntries(
      (Object.keys(ENV_CONFIG) as EnvKey[]).map((k) => [k, seedEnvSeries(ENV_CONFIG[k])]),
    ) as Record<EnvKey, EnvPoint[]>,
  )
  const [, force] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      for (const key of Object.keys(ENV_CONFIG) as EnvKey[]) {
        const cfg = ENV_CONFIG[key]
        const series = seriesRef.current[key]
        const nextValue = Number(walkEnv(series[series.length - 1].value, cfg).toFixed(1))
        seriesRef.current[key] = [...series.slice(1), { t: Date.now(), value: nextValue }]
      }
      force((n) => n + 1)
    }, TICK_MS)
    return () => clearInterval(id)
  }, [])

  const readings: Record<EnvKey, EnvReading> = Object.fromEntries(
    (Object.keys(ENV_CONFIG) as EnvKey[]).map((key) => {
      const series = seriesRef.current[key]
      return [key, { key, series, current: series[series.length - 1].value }]
    }),
  ) as Record<EnvKey, EnvReading>

  return { readings }
}
