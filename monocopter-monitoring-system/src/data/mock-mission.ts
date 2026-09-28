export type MissionPhase = "Idle" | "En Route" | "Searching" | "Returning" | "Complete"

export type MissionObjective = {
  id: string
  label: string
  detail: string
  done: boolean
}

export const PHASE_ORDER: MissionPhase[] = ["Idle", "En Route", "Searching", "Returning", "Complete"]

/**
 * ponytail: static mission script. Swap for the real mission-planner state
 * later — the phase + objectives + wall-clock start shape is what the
 * status cards consume. "Now" only; past missions belong to Module 11.
 */
export function seedObjectives(): MissionObjective[] {
  return [
    { id: "reach", label: "Reach Sector B", detail: "Navigate via WP-1 → WP-2 → WP-3", done: true },
    { id: "scan", label: "Scan for survivors", detail: "RGB detection sweep, 0.80+ confidence", done: true },
    { id: "hazard", label: "Map hazard zone B-2", detail: "Outline boundary on the SLAM map", done: false },
    { id: "return", label: "Return to base", detail: "Reverse path to Main Entrance", done: false },
  ]
}

export function phaseForObjectives(objectives: MissionObjective[]): MissionPhase {
  const done = objectives.filter((o) => o.done).length
  if (done === 0) return "En Route"
  if (done < objectives.length - 1) return "Searching"
  if (done === objectives.length - 1) return "Returning"
  return "Complete"
}

export const MISSION_META = {
  name: "Sector B Search",
  sector: "Sector B",
  waypoint: "WP-3 → WP-4",
}
