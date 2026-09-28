import { MapPinIcon, WarningOctagonIcon, WarningIcon } from "@phosphor-icons/react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ALERT_SOURCE_LABEL } from "@/data/mock-alerts"
import type { RescueSituation } from "@/data/mock-rescue-intel"
import { STATUS_BADGE_CLASS, STATUS_LABEL } from "@/lib/status"

export function RescueSituationPanel({ situation }: { situation: RescueSituation }) {
  const Icon = situation.severity === "danger" ? WarningOctagonIcon : WarningIcon

  return (
    <Card className="smooth-shadow-sm py-4">
      <CardHeader className="px-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2.5">
            <Icon weight="fill" className="mt-0.5 size-6 shrink-0 text-destructive" />
            <div>
              <CardTitle className="text-base font-semibold">{situation.headline}</CardTitle>
              <p className="text-muted-foreground text-xs tabular-nums">
                Updated {new Date(situation.updatedAt).toLocaleTimeString("en-IN", { hour12: false })}
              </p>
            </div>
          </div>
          <Badge className={STATUS_BADGE_CLASS[situation.severity]}>
            {STATUS_LABEL[situation.severity]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 px-4">
        {situation.victimLocation && (
          <div className="flex items-center gap-2 rounded-lg bg-muted/60 px-3 py-2 text-xs font-medium">
            <MapPinIcon weight="fill" className="size-4 shrink-0 text-destructive" />
            {situation.victimLocation}
          </div>
        )}

        <div>
          <p className="text-muted-foreground pb-1 text-xs font-medium">Contributing factors</p>
          <ul className="flex flex-col gap-1">
            {situation.factors.map((f, i) => (
              <li key={`${f.source}-${i}`} className="flex items-center gap-2 text-xs">
                <Badge variant="outline">{ALERT_SOURCE_LABEL[f.source]}</Badge>
                <span className="text-muted-foreground">{f.summary}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="rounded-lg bg-muted/60 px-3 py-2.5 text-sm leading-relaxed">
          <span className="font-semibold">Recommended action: </span>
          {situation.recommendation}
        </p>
      </CardContent>
    </Card>
  )
}
