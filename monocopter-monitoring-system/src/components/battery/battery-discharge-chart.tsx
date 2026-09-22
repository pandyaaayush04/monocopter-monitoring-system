import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BATTERY_CONFIG, type BatteryPoint } from "@/data/mock-battery"
import { STATUS_LINE_CLASS, type Status } from "@/lib/status"

function fmtTime(t: number) {
  return new Date(t).toLocaleTimeString("en-IN", { hour12: false, minute: "2-digit", second: "2-digit" })
}

export function BatteryDischargeChart({ series, status }: { series: BatteryPoint[]; status: Status }) {
  const lineColor = STATUS_LINE_CLASS[status]

  return (
    <Card className="smooth-shadow-sm py-4">
      <CardHeader className="px-4">
        <CardTitle className="text-sm font-semibold">Battery Discharge — last {series.length} readings</CardTitle>
      </CardHeader>
      <CardContent className="h-64 px-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={series} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="battery-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={lineColor} stopOpacity={0.3} />
                <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="t"
              tickFormatter={fmtTime}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickLine={false}
              axisLine={{ stroke: "var(--border)" }}
              minTickGap={40}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickLine={false}
              axisLine={false}
              width={40}
              unit="%"
            />
            <Tooltip
              contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
              labelFormatter={(t) => fmtTime(Number(t))}
              formatter={(value) => [`${value}%`, "Battery"]}
            />
            <ReferenceLine
              y={BATTERY_CONFIG.warnPct}
              stroke="var(--warning)"
              strokeDasharray="4 4"
              label={{ value: "Warning", fontSize: 10, fill: "var(--warning)", position: "insideTopLeft" }}
            />
            <ReferenceLine
              y={BATTERY_CONFIG.dangerPct}
              stroke="var(--destructive)"
              strokeDasharray="4 4"
              label={{ value: "Critical", fontSize: 10, fill: "var(--destructive)", position: "insideBottomLeft" }}
            />
            <Area type="monotone" dataKey="pct" stroke={lineColor} strokeWidth={2} fill="url(#battery-fill)" isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
