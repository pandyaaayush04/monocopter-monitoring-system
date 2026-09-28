import { ThermometerIcon } from "@phosphor-icons/react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ThermalDetection } from "@/data/mock-thermal"

export function ThermalDetectionsCard({ detections, online }: { detections: ThermalDetection[]; online: boolean }) {
  return (
    <Card className="smooth-shadow-sm py-4">
      <CardHeader className="px-4">
        <CardTitle className="text-sm font-semibold">Heat Signatures</CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        {!online || detections.length === 0 ? (
          <div className="text-muted-foreground flex flex-col items-center gap-2 py-6 text-center">
            <ThermometerIcon className="size-7" />
            <p className="text-xs">
              {!online
                ? "No heat signatures — thermal camera offline."
                : "No heat signatures detected yet."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-border/60">
            {detections.map((d) => (
              <div key={d.id} className="flex items-center justify-between gap-2 py-2 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{d.label}</p>
                  <p className="text-muted-foreground text-xs tabular-nums">
                    {d.time} · {d.sector}
                    {d.peakTempC != null && ` · ${d.peakTempC.toFixed(1)}°C`}
                  </p>
                </div>
                <span className="text-xs font-semibold tabular-nums">
                  {d.confidence != null ? d.confidence.toFixed(2) : "—"}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
