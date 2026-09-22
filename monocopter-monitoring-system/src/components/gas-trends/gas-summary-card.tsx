import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts"
import { TrendUpIcon, TrendDownIcon, MinusIcon } from "@phosphor-icons/react"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GAS_CONFIG } from "@/data/mock-gas"
import type { GasReading } from "@/hooks/use-mock-gas-feed"
import { STATUS_BADGE_CLASS, STATUS_LABEL, STATUS_LINE_CLASS } from "@/lib/status"

export function GasSummaryCard({
  reading,
  selected,
  onSelect,
}: {
  reading: GasReading
  selected: boolean
  onSelect: () => void
}) {
  const cfg = GAS_CONFIG[reading.key]
  const delta = reading.current - reading.previous
  const TrendIcon = Math.abs(delta) < 0.01 ? MinusIcon : delta > 0 ? TrendUpIcon : TrendDownIcon
  const trendGood = cfg.invert ? delta >= 0 : delta <= 0

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => e.key === "Enter" && onSelect()}
      className={
        "smooth-shadow-sm cursor-pointer gap-2 py-3 transition-colors " +
        (selected ? "ring-2 ring-primary ring-offset-1 ring-offset-background" : "")
      }
    >
      <div className="flex items-start justify-between px-4">
        <div className="min-w-0">
          <p className="text-muted-foreground truncate text-xs font-medium">{cfg.label}</p>
          <p className="mt-0.5 text-2xl font-semibold tabular-nums">
            {reading.current.toFixed(cfg.unit === "%" ? 1 : 0)}
            <span className="text-muted-foreground ml-1 text-sm font-normal">{cfg.unit}</span>
          </p>
        </div>
        <Badge className={STATUS_BADGE_CLASS[reading.status]}>{STATUS_LABEL[reading.status]}</Badge>
      </div>

      <div className="flex items-center justify-between px-4">
        <span
          className={
            "inline-flex items-center gap-1 text-xs font-medium " +
            (trendGood ? "text-safe" : "text-warning")
          }
        >
          <TrendIcon weight="bold" className="size-3.5" />
          {Math.abs(delta).toFixed(cfg.unit === "%" ? 2 : 1)} {cfg.unit}
        </span>
      </div>

      <div className="h-12 px-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={reading.series} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
            <YAxis domain={["dataMin - 1", "dataMax + 1"]} hide />
            <defs>
              <linearGradient id={`spark-${reading.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={STATUS_LINE_CLASS[reading.status]} stopOpacity={0.35} />
                <stop offset="100%" stopColor={STATUS_LINE_CLASS[reading.status]} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={STATUS_LINE_CLASS[reading.status]}
              strokeWidth={1.75}
              fill={`url(#spark-${reading.key})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
