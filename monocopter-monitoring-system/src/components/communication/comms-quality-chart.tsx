import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { COMMS_CONFIG, type CommsPoint } from "@/data/mock-communication"
import { STATUS_LINE_CLASS, type Status } from "@/lib/status"

function fmtTime(t: number) {
  return new Date(t).toLocaleTimeString("en-IN", { hour12: false, minute: "2-digit", second: "2-digit" })
}

export function CommsQualityChart({ series, status }: { series: CommsPoint[]; status: Status }) {
  return (
    <Card className="smooth-shadow-sm py-4">
      <CardHeader className="px-4">
        <CardTitle className="text-sm font-semibold">
          Connection quality — last {series.length} readings
        </CardTitle>
      </CardHeader>
      <CardContent className="h-64 px-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={series} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
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
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickLine={false}
              axisLine={false}
              width={48}
              unit="%"
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelFormatter={(t) => fmtTime(Number(t))}
              formatter={(value) => [`${value} %`, "Signal"]}
            />
            <ReferenceLine
              y={COMMS_CONFIG.warnSignal}
              stroke="var(--warning)"
              strokeDasharray="4 4"
              label={{ value: "Warning", fontSize: 10, fill: "var(--warning)", position: "insideTopLeft" }}
            />
            <ReferenceLine
              y={COMMS_CONFIG.dangerSignal}
              stroke="var(--destructive)"
              strokeDasharray="4 4"
              label={{ value: "Danger", fontSize: 10, fill: "var(--destructive)", position: "insideTopLeft" }}
            />
            <Line
              type="monotone"
              dataKey="signal"
              stroke={STATUS_LINE_CLASS[status]}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
