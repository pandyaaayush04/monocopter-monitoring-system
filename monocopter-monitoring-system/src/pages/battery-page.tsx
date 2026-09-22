import { BatteryStatusBanner } from "@/components/battery/battery-status-banner"
import { BatteryGaugeCard } from "@/components/battery/battery-gauge-card"
import { BatteryDischargeChart } from "@/components/battery/battery-discharge-chart"
import { useMockBatteryFeed } from "@/hooks/use-mock-battery-feed"

export function BatteryPage() {
  const { series, pct, status, missionStart } = useMockBatteryFeed()

  return (
    <div className="flex flex-col gap-4">
      <BatteryStatusBanner status={status} />
      <BatteryGaugeCard pct={pct} status={status} missionStart={missionStart} />
      <BatteryDischargeChart series={series} status={status} />
    </div>
  )
}
