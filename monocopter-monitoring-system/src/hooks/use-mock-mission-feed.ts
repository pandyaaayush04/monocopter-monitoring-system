import { useEffect, useRef, useState } from "react"
import { phaseForObjectives, seedObjectives, type MissionObjective } from "@/data/mock-mission"

const ADVANCE_MS = 30000

/**
 * ponytail: mission feed with a real wall-clock elapsed timer
 * (same pattern as Module 3's Mission Flight Time). Sourced from the
 * mission planner / autonomy stack — phase + objectives + missionStart
 * is what the cards consume.
 */
export function useMockMissionFeed() {
  const missionStartRef = useRef(Date.now())
  const [objectives, setObjectives] = useState<MissionObjective[]>(() => seedObjectives())
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const id = setInterval(
      () => setElapsed(Math.floor((Date.now() - missionStartRef.current) / 1000)),
      1000,
    )
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      setObjectives((prev) => {
        const next = prev.find((o) => !o.done)
        if (!next) return prev
        // Hold at Returning: leave the final "Return to base" for the operator.
        if (next.id === "return") return prev
        return prev.map((o) => (o.id === next.id ? { ...o, done: true } : o))
      })
    }, ADVANCE_MS)
    return () => clearInterval(id)
  }, [])

  const done = objectives.filter((o) => o.done).length

  return {
    objectives,
    phase: phaseForObjectives(objectives),
    done,
    total: objectives.length,
    elapsed,
    missionStart: missionStartRef.current,
  }
}

export function fmtElapsed(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  const mm = m.toString().padStart(2, "0")
  const ss = s.toString().padStart(2, "0")
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}
