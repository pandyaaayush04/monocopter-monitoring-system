import type { Status } from "@/lib/status"

export type BatteryPoint = { t: number; pct: number }

export const BATTERY_CONFIG = {
  totalFlightMinutes: 28,
  warnPct: 30,
  dangerPct: 15,
  cells: 4,
  cellFullV: 4.2,
  cellEmptyV: 3.3,
  startPct: 78,
  drainPerTick: 0.35,
}

export function statusForBattery(pct: number): Status {
  if (pct <= BATTERY_CONFIG.dangerPct) return "danger"
  if (pct <= BATTERY_CONFIG.warnPct) return "warning"
  return "safe"
}

export function voltageForPct(pct: number) {
  const { cells, cellFullV, cellEmptyV } = BATTERY_CONFIG
  const perCell = cellEmptyV + (cellFullV - cellEmptyV) * (pct / 100)
  return perCell * cells
}

export function estimatedMinutesRemaining(pct: number) {
  return (pct / 100) * BATTERY_CONFIG.totalFlightMinutes
}

const SERIES_LENGTH = 20

export function seedBatterySeries(): BatteryPoint[] {
  const points: BatteryPoint[] = []
  let pct = BATTERY_CONFIG.startPct + BATTERY_CONFIG.drainPerTick * SERIES_LENGTH
  const now = Date.now()
  for (let i = SERIES_LENGTH - 1; i >= 0; i--) {
    pct -= BATTERY_CONFIG.drainPerTick + (Math.random() - 0.5) * 0.1
    points.push({ t: now - i * 3000, pct: Number(pct.toFixed(2)) })
  }
  return points
}
