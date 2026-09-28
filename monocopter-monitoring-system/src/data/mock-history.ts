export type MissionOutcome = "Complete" | "Partial" | "Aborted"

export type MissionSession = {
  id: string
  name: string
  /** epoch ms of mission start */
  date: number
  durationMin: number
  distanceM: number
  sectors: string[]
  detections: number
  alerts: number
  outcome: MissionOutcome
  /** fraction of the Module 7 flight path this session covered (0–1) */
  coverage: number
}

const DAY_MS = 24 * 60 * 60 * 1000

/**
 * ponytail: past-session log sourced from the persisted mission store —
 * the MissionSession shape (date + duration + distance + sectors
 * + detections + alerts + outcome + coverage) is what the table and the
 * path replay consume. Alert counts link to the alert feed (Module 6).
 */
export function seedSessions(): MissionSession[] {
  const now = Date.now()
  const sessions: MissionSession[] = [
    {
      id: "m-051",
      name: "Sector B Search",
      date: now - 1 * DAY_MS,
      durationMin: 24,
      distanceM: 640,
      sectors: ["B"],
      detections: 2,
      alerts: 3,
      outcome: "Partial",
      coverage: 0.72,
    },
    {
      id: "m-050",
      name: "Sector A Sweep",
      date: now - 3 * DAY_MS,
      durationMin: 28,
      distanceM: 810,
      sectors: ["A"],
      detections: 0,
      alerts: 1,
      outcome: "Complete",
      coverage: 0.95,
    },
    {
      id: "m-049",
      name: "Sector C Probe",
      date: now - 6 * DAY_MS,
      durationMin: 11,
      distanceM: 290,
      sectors: ["C"],
      detections: 0,
      alerts: 2,
      outcome: "Aborted",
      coverage: 0.31,
    },
    {
      id: "m-048",
      name: "Sector A–B Traverse",
      date: now - 9 * DAY_MS,
      durationMin: 26,
      distanceM: 760,
      sectors: ["A", "B"],
      detections: 1,
      alerts: 2,
      outcome: "Complete",
      coverage: 0.88,
    },
  ]
  return sessions.sort((a, b) => b.date - a.date)
}
