import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { MissionSession, MissionOutcome } from "@/data/mock-history"

const OUTCOME_CLASS: Record<MissionOutcome, string> = {
  Complete: "bg-safe/10 text-safe",
  Partial: "bg-warning/10 text-warning",
  Aborted: "bg-destructive/10 text-destructive",
}

function fmtDate(date: number) {
  return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
}

export function HistoryTable({
  sessions,
  selectedId,
  onSelect,
}: {
  sessions: MissionSession[]
  selectedId: string
  onSelect: (id: string) => void
}) {
  return (
    <Card className="smooth-shadow-sm py-4">
      <CardHeader className="px-4">
        <CardTitle className="text-sm font-semibold">Past Missions</CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-muted-foreground text-left">
                <th className="py-1 pr-2 font-medium">Mission</th>
                <th className="py-1 pr-2 font-medium">Date</th>
                <th className="py-1 pr-2 font-medium">Duration</th>
                <th className="py-1 pr-2 font-medium">Det.</th>
                <th className="py-1 font-medium">Outcome</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr
                  key={s.id}
                  onClick={() => onSelect(s.id)}
                  onKeyDown={(e) => e.key === "Enter" && onSelect(s.id)}
                  tabIndex={0}
                  className={
                    "cursor-pointer border-t border-border/60 transition-colors hover:bg-muted/50 " +
                    (s.id === selectedId ? "bg-muted/60" : "")
                  }
                >
                  <td className="py-2 pr-2 font-medium">{s.name}</td>
                  <td className="text-muted-foreground py-2 pr-2 tabular-nums">{fmtDate(s.date)}</td>
                  <td className="py-2 pr-2 tabular-nums">{s.durationMin} min</td>
                  <td className="py-2 pr-2 tabular-nums">{s.detections}</td>
                  <td className="py-2">
                    <Badge className={OUTCOME_CLASS[s.outcome]}>{s.outcome}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
