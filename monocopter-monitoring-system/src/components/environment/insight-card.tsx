import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ENV_CONFIG } from "@/data/mock-environment"
import type { EnvReading } from "@/hooks/use-mock-environment-feed"
import { STATUS_BADGE_CLASS, STATUS_LABEL, STATUS_LINE_CLASS } from "@/lib/status"

export function InsightCard({ reading }: { reading: EnvReading }) {
  const cfg = ENV_CONFIG[reading.key]
  const status = cfg.statusFor(reading.current)

  return (
    <Card className="smooth-shadow-sm gap-3 py-4">
      <div className="flex items-start justify-between px-4">
        <div className="min-w-0">
          <p className="text-muted-foreground text-xs font-medium">{cfg.label}</p>
          <p className="mt-0.5 text-2xl font-semibold tabular-nums">
            {reading.current.toFixed(1)}
            <span className="text-muted-foreground ml-1 text-sm font-normal">{cfg.unit}</span>
          </p>
        </div>
        <Badge className={STATUS_BADGE_CLASS[status]}>{STATUS_LABEL[status]}</Badge>
      </div>

      <div className="h-14 px-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={reading.series} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
            <YAxis domain={["dataMin - 1", "dataMax + 1"]} hide />
            <defs>
              <linearGradient id={`env-spark-${reading.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={STATUS_LINE_CLASS[status]} stopOpacity={0.35} />
                <stop offset="100%" stopColor={STATUS_LINE_CLASS[status]} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={STATUS_LINE_CLASS[status]}
              strokeWidth={1.75}
              fill={`url(#env-spark-${reading.key})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <p className="text-muted-foreground border-t px-4 pt-3 text-xs leading-relaxed">
        {cfg.interpretation[status]}
      </p>
    </Card>
  )
}
