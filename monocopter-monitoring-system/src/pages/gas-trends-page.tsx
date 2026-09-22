import { useState } from "react"

import { RiskBanner } from "@/components/gas-trends/risk-banner"
import { GasSummaryCard } from "@/components/gas-trends/gas-summary-card"
import { GasTrendChart } from "@/components/gas-trends/gas-trend-chart"
import { useMockGasFeed } from "@/hooks/use-mock-gas-feed"
import type { GasKey } from "@/data/mock-gas"

export function GasTrendsPage() {
  const { readings, overall } = useMockGasFeed()
  const [selected, setSelected] = useState<GasKey>("ch4")

  return (
    <div className="flex flex-col gap-4">
      <RiskBanner status={overall} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {(Object.keys(readings) as GasKey[]).map((key) => (
          <GasSummaryCard
            key={key}
            reading={readings[key]}
            selected={selected === key}
            onSelect={() => setSelected(key)}
          />
        ))}
      </div>

      <GasTrendChart reading={readings[selected]} />
    </div>
  )
}
