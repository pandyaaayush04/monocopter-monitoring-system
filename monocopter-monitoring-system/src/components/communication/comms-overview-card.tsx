import { WifiHighIcon, WifiMediumIcon, WifiLowIcon, WifiXIcon } from "@phosphor-icons/react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { COMMS_CONFIG } from "@/data/mock-communication"
import { STATUS_BADGE_CLASS, STATUS_LABEL, STATUS_TEXT_CLASS, type Status } from "@/lib/status"

function signalIcon(pct: number) {
  if (pct >= 60) return WifiHighIcon
  if (pct >= 35) return WifiMediumIcon
  if (pct > 0) return WifiLowIcon
  return WifiXIcon
}

function Metric({ label, value, status }: { label: string; value: string; status?: Status }) {
  return (
    <div className="min-w-0">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className={`text-sm font-semibold tabular-nums ${status ? STATUS_TEXT_CLASS[status] : ""}`}>
        {value}
      </p>
    </div>
  )
}

function latencyStatus(ms: number): Status {
  if (ms >= COMMS_CONFIG.dangerLatencyMs) return "danger"
  if (ms >= COMMS_CONFIG.warnLatencyMs) return "warning"
  return "safe"
}

function lossStatus(pct: number): Status {
  if (pct >= COMMS_CONFIG.dangerLossPct) return "danger"
  if (pct >= COMMS_CONFIG.warnLossPct) return "warning"
  return "safe"
}

export function CommsOverviewCard({
  signal,
  status,
  latencyMs,
  lossPct,
  upKbps,
  downKbps,
}: {
  signal: number
  status: Status
  latencyMs: number
  lossPct: number
  upKbps: number
  downKbps: number
}) {
  const Icon = signalIcon(signal)

  return (
    <Card className="smooth-shadow-sm py-4">
      <CardContent className="flex flex-col gap-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex size-11 shrink-0 items-center justify-center rounded-full bg-muted ${STATUS_TEXT_CLASS[status]}`}>
              <Icon weight="bold" className="size-5.5" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-medium">Communication Link — Base Station</p>
              <p className="text-2xl font-semibold tabular-nums">
                {signal}
                <span className="text-muted-foreground ml-1 text-sm font-normal">% signal</span>
              </p>
            </div>
          </div>
          <Badge className={STATUS_BADGE_CLASS[status]}>{STATUS_LABEL[status]}</Badge>
        </div>
        <div className="grid grid-cols-2 gap-3 border-t border-border/60 pt-3 sm:grid-cols-4">
          <Metric label="Latency" value={`${latencyMs} ms`} status={latencyStatus(latencyMs)} />
          <Metric label="Packet loss" value={`${lossPct.toFixed(1)} %`} status={lossStatus(lossPct)} />
          <Metric label="Uplink" value={`${upKbps} kbps`} />
          <Metric label="Downlink" value={`${downKbps} kbps`} />
        </div>
      </CardContent>
    </Card>
  )
}
