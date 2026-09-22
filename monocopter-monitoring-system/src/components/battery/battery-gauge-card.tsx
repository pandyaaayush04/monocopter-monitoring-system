import { useEffect, useState } from "react"
import { BatteryChargingIcon, ClockIcon, LightningIcon } from "@phosphor-icons/react"

import { Card, CardContent } from "@/components/ui/card"
import { estimatedMinutesRemaining, voltageForPct } from "@/data/mock-battery"
import { STATUS_LINE_CLASS, STATUS_TEXT_CLASS, type Status } from "@/lib/status"

const RADIUS = 54
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function fmtMinutes(mins: number) {
  const m = Math.floor(mins)
  const s = Math.round((mins - m) * 60)
  return `${m}m ${s.toString().padStart(2, "0")}s`
}

function fmtElapsed(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
}

function Stat({ icon: Icon, label, value }: { icon: typeof ClockIcon; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="bg-muted text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-full">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <p className="text-muted-foreground text-xs">{label}</p>
        <p className="text-sm font-semibold tabular-nums">{value}</p>
      </div>
    </div>
  )
}

export function BatteryGaugeCard({ pct, status, missionStart }: { pct: number; status: Status; missionStart: number }) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - missionStart) / 1000)), 1000)
    return () => clearInterval(id)
  }, [missionStart])

  const offset = CIRCUMFERENCE * (1 - pct / 100)

  return (
    <Card className="smooth-shadow-sm py-5">
      <CardContent className="flex flex-col items-center gap-5 px-5 sm:flex-row sm:items-center">
        <div className="relative flex size-36 shrink-0 items-center justify-center">
          <svg width="144" height="144" viewBox="0 0 144 144" className="-rotate-90">
            <circle cx="72" cy="72" r={RADIUS} fill="none" stroke="var(--muted)" strokeWidth="10" />
            <circle
              cx="72"
              cy="72"
              r={RADIUS}
              fill="none"
              stroke={STATUS_LINE_CLASS[status]}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 600ms var(--ease, ease-out)" }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-bold tabular-nums">{Math.round(pct)}%</span>
            <span className={`text-xs font-medium ${STATUS_TEXT_CLASS[status]}`}>
              {status === "danger" ? "Critical" : status === "warning" ? "Low" : "Healthy"}
            </span>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3 sm:pl-2">
          <Stat icon={LightningIcon} label="Estimated Flight Time Remaining" value={fmtMinutes(estimatedMinutesRemaining(pct))} />
          <Stat icon={ClockIcon} label="Mission Flight Time" value={fmtElapsed(elapsed)} />
          <Stat icon={BatteryChargingIcon} label="Battery Voltage" value={`${voltageForPct(pct).toFixed(1)} V`} />
        </div>
      </CardContent>
    </Card>
  )
}
