import type { Status } from "@/lib/status"

export type CommsPoint = { t: number; signal: number }

export type ConnectionEvent = {
  id: string
  /** epoch ms */
  time: number
  kind: "reconnect" | "weak" | "drop"
  detail: string
}

export const COMMS_CONFIG = {
  startSignal: 82,
  volatility: 4,
  warnSignal: 60,
  dangerSignal: 35,
  warnLatencyMs: 300,
  dangerLatencyMs: 800,
  warnLossPct: 2,
  dangerLossPct: 8,
}

export function statusForSignal(pct: number): Status {
  if (pct < COMMS_CONFIG.dangerSignal) return "danger"
  if (pct < COMMS_CONFIG.warnSignal) return "warning"
  return "safe"
}

/** Latency rises as signal falls (estimated correlation). */
export function latencyForSignal(signal: number): number {
  const base = 60 + (100 - signal) * 6 + (Math.random() - 0.5) * 30
  return Math.max(20, Number(base.toFixed(0)))
}

/** Packet loss rises as signal falls (estimated correlation). */
export function lossForSignal(signal: number): number {
  const base = Math.max(0, (65 - signal) * 0.22) + Math.random() * 0.6
  return Number(base.toFixed(1))
}

/** Link rates fall as signal falls (estimated correlation). */
export function ratesForSignal(signal: number): { upKbps: number; downKbps: number } {
  const upKbps = Math.max(40, Number((signal * 9 + (Math.random() - 0.5) * 40).toFixed(0)))
  const downKbps = Math.max(120, Number((signal * 28 + (Math.random() - 0.5) * 120).toFixed(0)))
  return { upKbps, downKbps }
}

const SERIES_LENGTH = 24

export function seedCommsSeries(): CommsPoint[] {
  const points: CommsPoint[] = []
  let signal = COMMS_CONFIG.startSignal
  const now = Date.now()
  for (let i = SERIES_LENGTH - 1; i >= 0; i--) {
    signal = walkSignal(signal)
    points.push({ t: now - i * 3000, signal: Math.round(signal) })
  }
  return points
}

export function walkSignal(prev: number): number {
  const next = prev + (Math.random() - 0.5) * COMMS_CONFIG.volatility
  return Math.min(100, Math.max(0, next))
}

function makeId(): string {
  return `${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`
}

export function seedConnectionEvents(): ConnectionEvent[] {
  const now = Date.now()
  const events: ConnectionEvent[] = [
    { id: makeId(), time: now - 22 * 60 * 1000, kind: "reconnect", detail: "Telemetry uplink re-established at 78% signal" },
    { id: makeId(), time: now - 11 * 60 * 1000, kind: "weak", detail: "Signal dipped to 55% entering Sector B tunnel" },
  ]
  return events.sort((a, b) => b.time - a.time)
}
