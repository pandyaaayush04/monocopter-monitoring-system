import { WarningIcon, WarningOctagonIcon } from "@phosphor-icons/react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ALERT_SOURCE_LABEL, type AlertEvent } from "@/data/mock-alerts"
import { STATUS_BADGE_CLASS, STATUS_LABEL, STATUS_TEXT_CLASS } from "@/lib/status"

function timeAgo(time: number): string {
  const seconds = Math.max(1, Math.floor((Date.now() - time) / 1000))
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  return `${hours}h ago`
}

const SEVERITY_ICON = {
  warning: WarningIcon,
  danger: WarningOctagonIcon,
}

export function AlertCard({
  alert,
  onAcknowledge,
  onDismiss,
}: {
  alert: AlertEvent
  onAcknowledge: () => void
  onDismiss: () => void
}) {
  const Icon = SEVERITY_ICON[alert.severity]

  return (
    <Card
      className={`smooth-shadow-sm py-3 ${alert.acknowledged ? "opacity-60" : ""}`}
    >
      <CardContent className="flex flex-col gap-2 px-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-start gap-2.5">
            <Icon
              weight="fill"
              className={`mt-0.5 size-5 shrink-0 ${STATUS_TEXT_CLASS[alert.severity]}`}
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold">{alert.title}</p>
              <p className="text-muted-foreground text-xs">
                {ALERT_SOURCE_LABEL[alert.source]} · {timeAgo(alert.time)}
              </p>
            </div>
          </div>
          <Badge className={STATUS_BADGE_CLASS[alert.severity]}>
            {STATUS_LABEL[alert.severity]}
          </Badge>
        </div>

        <p className="text-muted-foreground text-xs leading-relaxed">{alert.detail}</p>
        <p className="rounded-lg bg-muted/60 px-2.5 py-2 text-xs leading-relaxed">
          <span className="font-semibold">Recommended: </span>
          {alert.recommendedAction}
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          {!alert.acknowledged && (
            <Button variant="outline" size="sm" onClick={onAcknowledge}>
              Acknowledge
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onDismiss}>
            Dismiss
          </Button>
          {alert.acknowledged && (
            <span className="text-muted-foreground text-xs">Acknowledged</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
