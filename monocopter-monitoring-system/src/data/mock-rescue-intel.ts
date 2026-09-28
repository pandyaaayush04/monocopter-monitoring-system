import { ALERT_SOURCE_LABEL, type AlertEvent, type AlertSource } from "@/data/mock-alerts"

export type RescueFactor = {
  source: AlertSource
  summary: string
}

export type RescueSituation = {
  id: string
  severity: "warning" | "danger"
  headline: string
  victimLocation: string | null
  factors: RescueFactor[]
  recommendation: string
  /** epoch ms of the newest contributing alert */
  updatedAt: number
}

function factorFor(a: AlertEvent): RescueFactor {
  return { source: a.source, summary: `${ALERT_SOURCE_LABEL[a.source]}: ${a.title}` }
}

/**
 * ponytail: rule-based synthesis over the shared alerts bus (same
 * AlertEvents + same overallAlertStatus as Module 6 — one definition of
 * "how bad is bad enough"). Swap the rules for the backend's rescue
 * recommendation service later; the RescueSituation shape (headline +
 * victim location + factors + plain-language recommendation) is what the
 * panel consumes. Returns null when nothing rises to rescue level — the
 * page shows a quiet empty state instead of a fabricated situation.
 *
 * Escalation rules:
 * - any unacknowledged danger → situation (victim framing if a detection
 *   alert is among them, hazard framing otherwise)
 * - a detection sighting combined with any gas warning/danger → situation
 *   (the brief's worked example: person + gas)
 * - otherwise null
 */
export function synthesizeRescueSituation(alerts: AlertEvent[]): RescueSituation | null {
  const active = alerts.filter((a) => !a.acknowledged)
  if (active.length === 0) return null

  const dangers = active.filter((a) => a.severity === "danger")
  const sighting = active.find((a) => a.source === "detection")
  const gasWarningOrWorse = active.find((a) => a.source === "gas")

  const combo = sighting && gasWarningOrWorse
  const trigger: AlertEvent[] = dangers.length > 0 ? dangers : combo ? [sighting!, gasWarningOrWorse!] : []
  if (trigger.length === 0) return null

  const hasVictim = trigger.some((a) => a.source === "detection")
  const hasGas = trigger.some((a) => a.source === "gas")
  const hasComms = trigger.some((a) => a.source === "comms")
  const hasBattery = trigger.some((a) => a.source === "battery")

  const severity = trigger.some((a) => a.severity === "danger") ? "danger" : "warning"

  const headline = hasVictim
    ? "Possible survivor — Sector B"
    : `Hazard response — ${ALERT_SOURCE_LABEL[trigger[0].source]} ${severity === "danger" ? "danger" : "watch"}`

  const factors = trigger.slice(0, 4).map(factorFor)

  const parts: string[] = []
  if (hasVictim && hasGas) {
    parts.push("Do not send a rescue team without breathing apparatus — gas readings are unsafe in the same sector as the sighting.")
    parts.push("Prioritize evacuation of Sector B and confirm the sighting with a second monocopter pass.")
  } else if (hasVictim) {
    parts.push("Dispatch a rescue team to the last known position and keep the monocopter overhead for a live feed.")
  } else if (hasGas) {
    parts.push("Evacuate the affected sector and cut ignition sources before sending anyone in.")
  }
  if (hasComms) {
    parts.push("Restore the relay link first — do not commit a crew while telemetry is critical.")
  }
  if (hasBattery) {
    parts.push("Recall the monocopter to base before its battery goes critical.")
  }
  if (parts.length === 0) {
    parts.push(trigger[0].recommendedAction)
  }

  return {
    id: trigger.map((a) => a.id).join("+"),
    severity,
    headline,
    victimLocation: hasVictim ? "Sector B — last known detection position" : null,
    factors,
    recommendation: parts.join(" "),
    updatedAt: Math.max(...trigger.map((a) => a.time)),
  }
}
