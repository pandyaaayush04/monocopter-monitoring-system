import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SectorInfo } from "@/data/mock-map"

export function SectorInfoCard({ sector }: { sector: SectorInfo }) {
  const rows: Array<[string, string]> = [
    ["Sector", sector.name],
    ["Average depth", `${sector.avgDepthM} m`],
    ["Total tunnel length", `${sector.tunnelLengthM.toLocaleString("en-IN")} m`],
    ["Mapped area", `${sector.mappedPct}%`],
    ["Unexplored area", `${sector.unexploredPct}%`],
  ]
  return (
    <Card className="smooth-shadow-sm py-4">
      <CardHeader className="px-4">
        <CardTitle className="text-sm font-semibold">Sector Information</CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between gap-2 py-1">
            <span className="text-muted-foreground text-xs">{k}</span>
            <span className="text-xs font-semibold tabular-nums">{v}</span>
          </div>
        ))}
        <div className="pt-2">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary" style={{ width: `${sector.mappedPct}%` }} />
          </div>
          <p className="text-muted-foreground pt-1 text-[11px]">{sector.mappedPct}% mapped</p>
        </div>
      </CardContent>
    </Card>
  )
}
