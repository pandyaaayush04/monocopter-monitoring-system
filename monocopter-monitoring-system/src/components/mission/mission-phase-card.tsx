import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MISSION_META, type MissionPhase } from "@/data/mock-mission"
import { fmtElapsed } from "@/hooks/use-mock-mission-feed"

const PHASE_DOT: Record<MissionPhase, string> = {
  Idle: "bg-muted-foreground",
  "En Route": "bg-warning",
  Searching: "bg-primary",
  Returning: "bg-warning",
  Complete: "bg-safe",
}

export function MissionPhaseCard({
  phase,
  elapsed,
  currentObjective,
}: {
  phase: MissionPhase
  elapsed: number
  currentObjective: string
}) {
  return (
    <Card className="smooth-shadow-sm py-4">
      <CardHeader className="px-4">
        <CardTitle className="text-sm font-semibold">{MISSION_META.name}</CardTitle>
        <p className="text-muted-foreground text-xs">What's happening right now</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 px-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="gap-1.5">
            <span className={`inline-block size-2 rounded-full ${PHASE_DOT[phase]}`} />
            {phase}
          </Badge>
          <span className="text-2xl font-bold tabular-nums">{fmtElapsed(elapsed)}</span>
          <span className="text-muted-foreground text-xs">elapsed</span>
        </div>
        <div className="flex flex-col gap-1 border-t border-border/60 pt-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground text-xs">Current objective</span>
            <span className="text-xs font-semibold">{currentObjective}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground text-xs">Sector</span>
            <span className="text-xs font-semibold">{MISSION_META.sector}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground text-xs">Waypoint leg</span>
            <span className="text-xs font-semibold tabular-nums">{MISSION_META.waypoint}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
