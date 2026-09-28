import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MineMapSvg } from "@/components/map/mine-map-svg"
import type { MissionSession } from "@/data/mock-history"

function fmtDateTime(date: number) {
  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 py-1">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="text-xs font-semibold tabular-nums">{value}</span>
    </div>
  )
}

export function HistoryDetailCard({ session }: { session: MissionSession }) {
  return (
    <Card className="smooth-shadow-sm py-4">
      <CardHeader className="px-4">
        <CardTitle className="text-sm font-semibold">{session.name}</CardTitle>
        <p className="text-muted-foreground text-xs tabular-nums">
          {fmtDateTime(session.date)} · {session.id.toUpperCase()}
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 px-4">
        <MineMapSvg progress={session.coverage} />
        <p className="text-muted-foreground text-[11px]">
          Recorded flight path — {Math.round(session.coverage * 100)}% of the mapped route.
        </p>
        <div className="border-t border-border/60 pt-1">
          <Stat label="Duration" value={`${session.durationMin} min`} />
          <Stat label="Distance covered" value={`${session.distanceM.toLocaleString("en-IN")} m`} />
          <Stat label="Sectors visited" value={session.sectors.join(", ")} />
          <Stat label="Detections made" value={`${session.detections}`} />
          <Stat label="Alerts triggered" value={`${session.alerts}`} />
          <Stat label="Outcome" value={session.outcome} />
        </div>
      </CardContent>
    </Card>
  )
}
