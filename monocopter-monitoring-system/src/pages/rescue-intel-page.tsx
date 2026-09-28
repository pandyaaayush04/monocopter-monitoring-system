import { NoSituationCard } from "@/components/rescue-intel/no-situation-card"
import { RescueSituationPanel } from "@/components/rescue-intel/rescue-situation-panel"
import { useMockRescueIntelFeed } from "@/hooks/use-mock-rescue-intel-feed"

export function RescueIntelPage() {
  const { situation, alertCount } = useMockRescueIntelFeed()

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <div>
        <h2 className="text-base font-semibold">Rescue Intelligence & Recommended Actions</h2>
        <p className="text-muted-foreground text-sm tabular-nums">
          Single highest-priority synthesis from {alertCount} active alert{alertCount === 1 ? "" : "s"} on the shared bus
        </p>
      </div>
      {situation ? <RescueSituationPanel situation={situation} /> : <NoSituationCard />}
    </div>
  )
}
