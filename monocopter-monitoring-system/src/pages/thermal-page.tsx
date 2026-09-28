import { TemperatureLegend } from "@/components/thermal/temperature-legend"
import { ThermalDetectionsCard } from "@/components/thermal/thermal-detections-card"
import { ThermalViewPanel } from "@/components/thermal/thermal-view-panel"
import { useMockThermalFeed } from "@/hooks/use-mock-thermal-feed"

/**
 * Standalone thermal page (same panels as the Live Feed → Thermal Camera
 * tab). Not separately routed for v1 — the tab is the primary surface so
 * the video-panel/detection pattern isn't duplicated across routes.
 */
export function ThermalPage() {
  const { online, detections } = useMockThermalFeed()

  return (
    <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-[1fr_320px] lg:p-6">
      <div className="flex flex-col gap-3">
        <div>
          <h2 className="text-base font-semibold">Thermal View & Detection</h2>
          <p className="text-muted-foreground text-sm">
            False-color heat view with heat-signature detection — once thermal hardware is wired in
          </p>
        </div>
        <ThermalViewPanel online={online} />
      </div>

      <div className="flex flex-col gap-4">
        <TemperatureLegend online={online} />
        <ThermalDetectionsCard detections={detections} online={online} />
      </div>
    </div>
  )
}
