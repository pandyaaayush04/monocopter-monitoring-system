import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { MonocopterPose } from "@/data/mock-map"
import { STATUS_BADGE_CLASS, STATUS_LABEL } from "@/lib/status"
import { statusForBattery } from "@/data/mock-battery"
import { statusForSignal } from "@/data/mock-system-status"

function Bar({ pct, status }: { pct: number; status: "safe" | "warning" | "danger" }) {
  const color =
    status === "danger" ? "bg-destructive" : status === "warning" ? "bg-warning" : "bg-safe"
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.round(pct)}%` }} />
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 py-1">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="text-xs font-semibold tabular-nums">{value}</span>
    </div>
  )
}

export function LocationStatusCard({
  pose,
  batteryPct,
  signalPct,
}: {
  pose: MonocopterPose
  batteryPct: number
  signalPct: number
}) {
  const batteryStatus = statusForBattery(batteryPct)
  const signalStatus = statusForSignal(signalPct)

  return (
    <Card className="smooth-shadow-sm py-4">
      <CardHeader className="px-4">
        <CardTitle className="text-sm font-semibold">Monocopter Location & Status</CardTitle>
        <p className="text-muted-foreground text-xs">Inertial/SLAM estimate — GPS unavailable underground</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-1 px-4">
        <Row label="Position X / Y / Z" value={`${pose.x.toFixed(1)}, ${pose.y.toFixed(1)}, ${pose.z.toFixed(1)} m`} />
        <Row label="Sector" value={pose.sectorId} />
        <div className="flex items-center justify-between gap-2 py-1">
          <span className="text-muted-foreground text-xs">Flight mode</span>
          <Badge variant="outline">{pose.flightMode}</Badge>
        </div>
        <Row label="Speed" value={`${pose.speedMs.toFixed(1)} m/s`} />
        <Row label="Altitude (AGL)" value={`${pose.altitudeM.toFixed(1)} m`} />

        <div className="pt-2">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-muted-foreground text-xs">Battery</span>
            <Badge className={STATUS_BADGE_CLASS[batteryStatus]}>
              {Math.round(batteryPct)}% · {STATUS_LABEL[batteryStatus]}
            </Badge>
          </div>
          <Bar pct={batteryPct} status={batteryStatus} />
        </div>

        <div className="pt-2">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-muted-foreground text-xs">Signal</span>
            <Badge className={STATUS_BADGE_CLASS[signalStatus]}>
              {signalPct}% · {STATUS_LABEL[signalStatus]}
            </Badge>
          </div>
          <Bar pct={signalPct} status={signalStatus} />
        </div>
      </CardContent>
    </Card>
  )
}
