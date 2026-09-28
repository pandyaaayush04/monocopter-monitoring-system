import { useEffect, useRef, useState } from "react"
import {
  latencyForSignal,
  lossForSignal,
  ratesForSignal,
  seedCommsSeries,
  seedConnectionEvents,
  statusForSignal,
  walkSignal,
  type CommsPoint,
  type ConnectionEvent,
} from "@/data/mock-communication"

const TICK_MS = 3000
const MAX_EVENTS = 15

function makeId(): string {
  return `${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`
}

/**
 * ponytail: radio link feed, ticking on an interval. Latency /
 * loss / rates are derived from signal strength (estimated
 * correlation). Sourced from the radio telemetry stream — the series
 * + current-values + events shape is what the cards/chart/log consume.
 */
export function useMockCommunicationFeed() {
  const seriesRef = useRef<CommsPoint[]>(seedCommsSeries())
  const [events, setEvents] = useState<ConnectionEvent[]>(() => seedConnectionEvents())
  const [, force] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      const series = seriesRef.current
      const prev = series[series.length - 1].signal
      const next = Math.round(walkSignal(prev))
      seriesRef.current = [...series.slice(1), { t: Date.now(), signal: next }]

      // Emit a connection event when crossing thresholds (edge-triggered).
      const prevStatus = statusForSignal(prev)
      const nextStatus = statusForSignal(next)
      if (prevStatus !== nextStatus) {
        const kind = nextStatus === "safe" ? "reconnect" : nextStatus === "warning" ? "weak" : "drop"
        const detail =
          kind === "reconnect"
            ? `Telemetry uplink recovered to ${next}% signal`
            : kind === "weak"
              ? `Signal ${prev}% → ${next}%, link degraded`
              : `Signal ${prev}% → ${next}%, link critical`
        const event: ConnectionEvent = { id: makeId(), time: Date.now(), kind, detail }
        setEvents((prevEvents) => [event, ...prevEvents].slice(0, MAX_EVENTS))
      }

      force((n) => n + 1)
    }, TICK_MS)
    return () => clearInterval(id)
  }, [])

  const series = seriesRef.current
  const signal = series[series.length - 1].signal
  const status = statusForSignal(signal)
  const latencyMs = latencyForSignal(signal)
  const lossPct = lossForSignal(signal)
  const { upKbps, downKbps } = ratesForSignal(signal)

  return { series, signal, status, overall: status, latencyMs, lossPct, upKbps, downKbps, events }
}
