import { WifiHighIcon, WifiMediumIcon, WifiLowIcon, WifiXIcon } from "@phosphor-icons/react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Status } from "@/lib/status"
import { STATUS_BADGE_CLASS, STATUS_LABEL, STATUS_TEXT_CLASS } from "@/lib/status"

function signalIcon(pct: number) {
  if (pct >= 60) return WifiHighIcon
  if (pct >= 35) return WifiMediumIcon
  if (pct > 0) return WifiLowIcon
  return WifiXIcon
}

export function SignalStrengthCard({ pct, status }: { pct: number; status: Status }) {
  const Icon = signalIcon(pct)

  return (
    <Card className="smooth-shadow-sm py-4">
      <CardContent className="flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className={`flex size-11 shrink-0 items-center justify-center rounded-full bg-muted ${STATUS_TEXT_CLASS[status]}`}>
            <Icon weight="bold" className="size-5.5" />
          </div>
          <div>
            <p className="text-muted-foreground text-xs font-medium">Communication Link — Base Station</p>
            <p className="text-2xl font-semibold tabular-nums">
              {pct}
              <span className="text-muted-foreground ml-1 text-sm font-normal">% signal</span>
            </p>
          </div>
        </div>
        <Badge className={STATUS_BADGE_CLASS[status]}>{STATUS_LABEL[status]}</Badge>
      </CardContent>
    </Card>
  )
}
