import { useState } from "react"

import { KeyLocationsTable } from "@/components/map/key-locations-table"
import { LocationStatusCard } from "@/components/map/location-status-card"
import { MapLegend } from "@/components/map/map-legend"
import { MineMapSvg } from "@/components/map/mine-map-svg"
import { QuickActionsCard } from "@/components/map/quick-actions-card"
import { SectorInfoCard } from "@/components/map/sector-info-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { SECTORS } from "@/data/mock-map"
import { useMockBatteryFeed } from "@/hooks/use-mock-battery-feed"
import { useMockMapFeed } from "@/hooks/use-mock-map-feed"
import { useMockSignalFeed } from "@/hooks/use-mock-signal-feed"

export function MapPage() {
  const { pose, progress } = useMockMapFeed()
  const { pct: batteryPct } = useMockBatteryFeed()
  const { pct: signalPct } = useMockSignalFeed()
  const [sectorId, setSectorId] = useState("B")

  const sector = SECTORS.find((s) => s.id === sectorId) ?? SECTORS[1]
  const poseForSector = { ...pose, sectorId }

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="smooth-shadow-sm py-4 xl:col-span-2">
          <CardContent className="flex flex-col gap-3 px-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Select value={sectorId} onValueChange={setSectorId}>
                <SelectTrigger size="sm" className="w-36" aria-label="Select sector view">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SECTORS.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button variant="outline" size="sm" disabled>
                      3D View
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>3D view coming soon — 2D SLAM map only for v1</TooltipContent>
              </Tooltip>
            </div>
            <MineMapSvg progress={progress} />
            <MapLegend />
          </CardContent>
        </Card>

        <LocationStatusCard pose={poseForSector} batteryPct={batteryPct} signalPct={signalPct} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SectorInfoCard sector={sector} />
        <QuickActionsCard />
        <KeyLocationsTable />
      </div>
    </div>
  )
}
