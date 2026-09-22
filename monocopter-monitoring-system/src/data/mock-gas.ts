import type { Status } from "@/lib/status"
export type GasStatus = Status
export type GasKey = "ch4" | "co" | "o2"

export type GasPoint = { t: number; value: number }

export type GasConfig = {
  key: GasKey
  label: string
  unit: string
  warn: number
  danger: number
  invert?: boolean // true when LOWER value is worse (oxygen depletion)
  start: number
  volatility: number
}

export const GAS_CONFIG: Record<GasKey, GasConfig> = {
  ch4: { key: "ch4", label: "Methane (CH4)", unit: "ppm", warn: 1000, danger: 2500, start: 420, volatility: 60 },
  co: { key: "co", label: "Carbon Monoxide (CO)", unit: "ppm", warn: 35, danger: 100, start: 12, volatility: 4 },
  o2: {
    key: "o2",
    label: "Oxygen (O2)",
    unit: "%",
    warn: 19.5,
    danger: 18,
    invert: true,
    start: 20.8,
    volatility: 0.15,
  },
}

export function statusFor(cfg: GasConfig, value: number): GasStatus {
  if (cfg.invert) {
    if (value < cfg.danger) return "danger"
    if (value < cfg.warn) return "warning"
    return "safe"
  }
  if (value > cfg.danger) return "danger"
  if (value > cfg.warn) return "warning"
  return "safe"
}

const SERIES_LENGTH = 24

export function seedSeries(cfg: GasConfig): GasPoint[] {
  const points: GasPoint[] = []
  let value = cfg.start
  const now = Date.now()
  for (let i = SERIES_LENGTH - 1; i >= 0; i--) {
    value = walk(value, cfg)
    points.push({ t: now - i * 3000, value: Number(value.toFixed(2)) })
  }
  return points
}

export function walk(value: number, cfg: GasConfig): number {
  const delta = (Math.random() - 0.48) * cfg.volatility
  const next = value + delta
  const floor = cfg.invert ? cfg.danger - 1.5 : 0
  return Math.max(floor, next)
}
