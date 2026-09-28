import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { THERMAL_LEGEND_STOPS, THERMAL_RANGE } from "@/data/mock-thermal"

export function TemperatureLegend({ online }: { online: boolean }) {
  const gradient = `linear-gradient(to right, ${THERMAL_LEGEND_STOPS.join(", ")})`

  return (
    <Card className="smooth-shadow-sm py-4">
      <CardHeader className="px-4">
        <CardTitle className="text-sm font-semibold">Temperature Range</CardTitle>
        <p className="text-muted-foreground text-xs">
          {online ? "Live false-color scale" : "Reference scale"}
        </p>
      </CardHeader>
      <CardContent className={`flex flex-col gap-1.5 px-4 ${online ? "" : "opacity-60"}`}>
        <div className="h-3 w-full rounded-full" style={{ background: gradient }} />
        <div className="flex items-center justify-between text-xs tabular-nums">
          <span className="text-muted-foreground">{THERMAL_RANGE.minC}°C</span>
          <span className="text-muted-foreground">{THERMAL_RANGE.maxC}°C</span>
        </div>
      </CardContent>
    </Card>
  )
}
