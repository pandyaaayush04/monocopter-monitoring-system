import { PersonSimpleIcon, WarningIcon } from "@phosphor-icons/react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { DetectionEvent } from "@/lib/detection-types"

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

export function DetectionStatusCard({ event }: { event: DetectionEvent }) {
  const detected = event.label === "Person Detected"

  return (
    <Card className="smooth-shadow-sm py-4">
      <CardHeader className="px-4">
        <CardTitle className="text-sm font-semibold">Detection Status</CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <div className="mb-3 flex items-center gap-3">
          <div
            className={
              "flex size-11 shrink-0 items-center justify-center rounded-full " +
              (detected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")
            }
          >
            {detected ? (
              <PersonSimpleIcon weight="fill" className="size-5.5" />
            ) : (
              <WarningIcon className="size-5.5" />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{event.label}</p>
            {detected && (
              <p className="text-muted-foreground text-xs">
                Confidence: <span className="font-medium">{Math.round((event.confidence ?? 0) * 100)}%</span>
              </p>
            )}
          </div>
        </div>

        <Separator className="mb-1" />
        <Row label="Detection Time" value={<span className="font-mono tabular-nums">{event.time}</span>} />
        <Row label="Objects Detected" value={detected ? "1 Person" : "0"} />
        <Row label="Location (Map)" value={event.sector} />
        <Row
          label="Status"
          value={
            <Badge variant={detected ? "default" : "secondary"} className="text-[11px]">
              {detected ? "Active" : "Idle"}
            </Badge>
          }
        />
      </CardContent>
    </Card>
  )
}
