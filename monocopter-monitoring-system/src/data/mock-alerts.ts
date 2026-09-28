import type { Status } from "@/lib/status"

export type AlertSeverity = "warning" | "danger"

export type AlertSource = "battery" | "gas" | "detection" | "monocopter" | "environment" | "comms"

export type AlertEvent = {
  id: string
  severity: AlertSeverity
  title: string
  detail: string
  source: AlertSource
  /** epoch ms */
  time: number
  recommendedAction: string
  acknowledged: boolean
}

export const ALERT_SOURCE_LABEL: Record<AlertSource, string> = {
  battery: "Battery",
  gas: "Gas",
  detection: "Detection",
  monocopter: "Monocopter",
  environment: "Environment",
  comms: "Comms",
}

type AlertTemplate = Omit<AlertEvent, "id" | "time" | "acknowledged">

const TEMPLATES: AlertTemplate[] = [
  {
    severity: "warning",
    source: "battery",
    title: "Battery low — 28%",
    detail: "Charge dropped below the 30% warning threshold.",
    recommendedAction: "Plan return to base within 8 minutes.",
  },
  {
    severity: "danger",
    source: "battery",
    title: "Battery critical — 14%",
    detail: "Charge dropped below the 15% critical threshold.",
    recommendedAction: "Return to base immediately and land.",
  },
  {
    severity: "warning",
    source: "gas",
    title: "CO rising — 42 ppm",
    detail: "Carbon monoxide crossed the 35 ppm warning line.",
    recommendedAction: "Ventilate the sector and limit crew exposure.",
  },
  {
    severity: "danger",
    source: "gas",
    title: "Methane danger — 2600 ppm",
    detail: "Methane crossed the 2500 ppm danger line.",
    recommendedAction: "Evacuate the sector and cut ignition sources.",
  },
  {
    severity: "warning",
    source: "gas",
    title: "Oxygen low — 19.2%",
    detail: "Oxygen fell below the 19.5% warning line.",
    recommendedAction: "Supply fresh air before sending a crew in.",
  },
  {
    severity: "warning",
    source: "detection",
    title: "Person detected — Sector B",
    detail: "AI detection flagged a possible survivor with 0.82 confidence.",
    recommendedAction: "Send the monocopter back for a closer pass.",
  },
  {
    severity: "warning",
    source: "monocopter",
    title: "Rear obstacle sensor intermittent",
    detail: "Pre-flight check flagged the rear obstacle sensor.",
    recommendedAction: "Fly forward-only profiles until it stabilises.",
  },
  {
    severity: "warning",
    source: "comms",
    title: "Signal weak — 52%",
    detail: "Base-station link dropped below the 60% warning line.",
    recommendedAction: "Hold position and avoid entering deep tunnels.",
  },
  {
    severity: "danger",
    source: "comms",
    title: "Link critical — 30%",
    detail: "Base-station link dropped below the 35% danger line.",
    recommendedAction: "Return toward the relay to restore telemetry.",
  },
  {
    severity: "warning",
    source: "environment",
    title: "High temperature — 38.5°C",
    detail: "Ambient temperature entered the heat-stress band.",
    recommendedAction: "Shorten crew shifts and monitor cooling.",
  },
]

function makeId(): string {
  return `${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`
}

export function makeAlert(template: AlertTemplate, time = Date.now()): AlertEvent {
  return { ...template, id: makeId(), time, acknowledged: false }
}

export function randomAlertTemplate(): AlertTemplate {
  return TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)]
}

/**
 * ponytail: seeded local alert rollup. Later this should read the Status
 * each module already computes (battery %, gas readings, detection state,
 * signal %) — either by polling those hooks or via a shared alerts bus —
 * instead of generating its own templates.
 */
export function seedAlerts(): AlertEvent[] {
  const now = Date.now()
  const picks: Array<[number, number]> = [
    [5, 14 * 60 * 1000],
    [2, 9 * 60 * 1000],
    [6, 4 * 60 * 1000],
  ]
  return picks
    .map(([templateIdx, ageMs]) =>
      makeAlert(TEMPLATES[templateIdx % TEMPLATES.length], now - ageMs),
    )
    .sort((a, b) => b.time - a.time)
}

export function overallAlertStatus(alerts: AlertEvent[]): Status {
  const active = alerts.filter((a) => !a.acknowledged)
  if (active.some((a) => a.severity === "danger")) return "danger"
  if (active.some((a) => a.severity === "warning")) return "warning"
  return "safe"
}
