import { CheckCircleIcon, CircleIcon } from "@phosphor-icons/react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { MissionObjective } from "@/data/mock-mission"

export function MissionObjectivesCard({
  objectives,
  done,
  total,
}: {
  objectives: MissionObjective[]
  done: number
  total: number
}) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)

  return (
    <Card className="smooth-shadow-sm py-4">
      <CardHeader className="px-4">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm font-semibold">Objectives</CardTitle>
          <span className="text-muted-foreground text-xs tabular-nums">
            {done}/{total} · {pct}%
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-1 px-4">
        <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex flex-col divide-y divide-border/60">
          {objectives.map((o) => {
            const Icon = o.done ? CheckCircleIcon : CircleIcon
            return (
              <div key={o.id} className="flex items-start gap-2.5 py-2 first:pt-0 last:pb-0">
                <Icon
                  weight={o.done ? "fill" : "regular"}
                  className={`mt-0.5 size-4.5 shrink-0 ${o.done ? "text-safe" : "text-muted-foreground"}`}
                />
                <div className="min-w-0">
                  <p className={`text-sm font-medium ${o.done ? "" : "text-foreground"}`}>{o.label}</p>
                  <p className="text-muted-foreground text-xs">{o.detail}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
