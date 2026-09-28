import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const ITEMS = [
  { swatch: "tunnel", label: "Mine tunnel" },
  { swatch: "path", label: "Flight path" },
  { swatch: "waypoint", label: "Waypoint" },
  { swatch: "human", label: "Detected human" },
  { swatch: "hazard", label: "Hazard zone" },
  { swatch: "blocked", label: "Blocked path" },
  { swatch: "entrance", label: "Entrance / Exit" },
]

function Swatch({ kind }: { kind: string }) {
  if (kind === "tunnel") return <span className="inline-block h-1 w-6 rounded bg-[#8b94a7]" />
  if (kind === "path") return <span className="inline-block h-0 w-6 border-t-2 border-dashed border-primary" />
  if (kind === "waypoint") return <span className="inline-flex size-4 items-center justify-center rounded-full border-2 border-primary text-[9px] font-bold text-primary">2</span>
  if (kind === "human") return <span className="inline-block size-3 rounded-full bg-destructive" />
  if (kind === "hazard") return <span className="inline-block h-3 w-6 rounded-sm border border-dashed border-destructive bg-destructive/15" />
  if (kind === "blocked") return <span className="text-sm font-bold text-warning">✕</span>
  return <span className="inline-block size-3.5 rounded border-2 border-[#22c55e]" />
}

export function MapLegend() {
  return (
    <Card className="smooth-shadow-sm py-3">
      <CardHeader className="px-4">
        <CardTitle className="text-xs font-semibold">Map Legend</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-x-4 gap-y-2 px-4">
        {ITEMS.map((i) => (
          <span key={i.label} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Swatch kind={i.swatch} />
            {i.label}
          </span>
        ))}
      </CardContent>
    </Card>
  )
}
