import { MissionObjectivesCard } from "@/components/mission/mission-objectives-card"
import { MissionPhaseCard } from "@/components/mission/mission-phase-card"
import { useMockMissionFeed } from "@/hooks/use-mock-mission-feed"

export function MissionPage() {
  const { objectives, phase, done, total, elapsed } = useMockMissionFeed()
  const current = objectives.find((o) => !o.done)?.label ?? "All objectives complete"

  return (
    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:p-6">
      <MissionPhaseCard phase={phase} elapsed={elapsed} currentObjective={current} />
      <MissionObjectivesCard objectives={objectives} done={done} total={total} />
    </div>
  )
}
