import { PlugsConnectedIcon, WarningIcon, WifiXIcon } from "@phosphor-icons/react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ConnectionEvent } from "@/data/mock-communication"

const KIND_ICON = {
  reconnect: PlugsConnectedIcon,
  weak: WarningIcon,
  drop: WifiXIcon,
}

const KIND_COLOR = {
  reconnect: "text-safe",
  weak: "text-warning",
  drop: "text-destructive",
}

function fmtClock(time: number) {
  return new Date(time).toLocaleTimeString("en-IN", { hour12: false })
}

export function CommsEventsLog({ events }: { events: ConnectionEvent[] }) {
  return (
    <Card className="smooth-shadow-sm py-4">
      <CardHeader className="px-4">
        <CardTitle className="text-sm font-semibold">Connection Events</CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        {events.length === 0 ? (
          <p className="text-muted-foreground py-4 text-center text-xs">
            No connection events — link has been stable.
          </p>
        ) : (
          <div className="flex max-h-56 flex-col gap-0 divide-y divide-border/60 overflow-y-auto">
            {events.map((e) => {
              const Icon = KIND_ICON[e.kind]
              return (
                <div key={e.id} className="flex items-start gap-2.5 py-2 first:pt-0 last:pb-0">
                  <Icon weight="fill" className={`mt-0.5 size-4 shrink-0 ${KIND_COLOR[e.kind]}`} />
                  <div className="min-w-0">
                    <p className="text-xs font-medium">{e.detail}</p>
                    <p className="text-muted-foreground text-[11px] tabular-nums">{fmtClock(e.time)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
