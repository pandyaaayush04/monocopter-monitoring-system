import type { Status } from "@/lib/status"

export type ChecklistItem = {
  id: string
  label: string
  status: Status
  detail: string
}

// ponytail: static checklist — swap for the flight controller's real
// pre-flight diagnostic report later. GPS is deliberately absent: it
// doesn't work underground, so inertial/SLAM nav is what's actually true.
export const SYSTEM_CHECKLIST: ChecklistItem[] = [
  { id: "motors", label: "Motors & ESCs", status: "safe", detail: "All 4 motors responding, no fault codes" },
  { id: "imu", label: "IMU / Gyroscope", status: "safe", detail: "Calibrated, stable reading" },
  { id: "nav", label: "Inertial / SLAM Navigation", status: "safe", detail: "GPS unavailable underground — using inertial nav" },
  { id: "camera", label: "Camera Feed", status: "safe", detail: "RGB stream active" },
  { id: "obstacle", label: "Obstacle Sensors", status: "warning", detail: "Rear sensor reading intermittent — monitor" },
  { id: "comms", label: "Communication Link", status: "safe", detail: "Telemetry uplink stable" },
]

export const SIGNAL_CONFIG = {
  start: 82,
  volatility: 4,
  warn: 60,
  danger: 35,
}

export function statusForSignal(pct: number): Status {
  if (pct < SIGNAL_CONFIG.danger) return "danger"
  if (pct < SIGNAL_CONFIG.warn) return "warning"
  return "safe"
}

export function overallReadiness(items: ChecklistItem[], signalStatus: Status): Status {
  const statuses = [...items.map((i) => i.status), signalStatus]
  if (statuses.includes("danger")) return "danger"
  if (statuses.includes("warning")) return "warning"
  return "safe"
}
