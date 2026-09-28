import { useState } from "react"
import { CheckCircleIcon } from "@phosphor-icons/react"

import { AlertCard } from "@/components/alerts/alert-card"
import { AlertsBanner } from "@/components/alerts/alerts-banner"
import { Button } from "@/components/ui/button"
import { useAlertsBus } from "@/lib/alerts-bus"
import { ALERT_SOURCE_LABEL, type AlertSeverity, type AlertSource } from "@/data/mock-alerts"

type SeverityFilter = "all" | AlertSeverity
type SourceFilter = "all" | AlertSource

const SEVERITY_TABS: Array<{ key: SeverityFilter; label: string }> = [
  { key: "all", label: "All" },
  { key: "danger", label: "Danger" },
  { key: "warning", label: "Warning" },
]

const SOURCE_TABS: Array<{ key: SourceFilter; label: string }> = [
  { key: "all", label: "All sources" },
  ...(Object.keys(ALERT_SOURCE_LABEL) as AlertSource[]).map((s) => ({
    key: s as SourceFilter,
    label: ALERT_SOURCE_LABEL[s],
  })),
]

export function AlertsPage() {
  const {
    alerts,
    overall,
    activeCount,
    acknowledgedCount,
    acknowledge,
    dismiss,
    clearAcknowledged,
  } = useAlertsBus()
  const [severity, setSeverity] = useState<SeverityFilter>("all")
  const [source, setSource] = useState<SourceFilter>("all")

  const visible = alerts.filter(
    (a) =>
      (severity === "all" || a.severity === severity) &&
      (source === "all" || a.source === source),
  )

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <AlertsBanner status={overall} activeCount={activeCount} />

      <div className="flex flex-wrap items-center gap-2">
        {SEVERITY_TABS.map((t) => (
          <Button
            key={t.key}
            variant={severity === t.key ? "default" : "outline"}
            size="sm"
            onClick={() => setSeverity(t.key)}
          >
            {t.label}
          </Button>
        ))}
        <span className="text-muted-foreground mx-1 hidden text-xs sm:inline">·</span>
        <select
          value={source}
          onChange={(e) => setSource(e.target.value as SourceFilter)}
          className="h-8 rounded-lg border border-border bg-card px-2 text-xs font-medium"
          aria-label="Filter by source module"
        >
          {SOURCE_TABS.map((t) => (
            <option key={t.key} value={t.key}>
              {t.label}
            </option>
          ))}
        </select>
        {acknowledgedCount > 0 && (
          <Button variant="ghost" size="sm" className="ml-auto" onClick={clearAcknowledged}>
            Clear {acknowledgedCount} acknowledged
          </Button>
        )}
      </div>

      {visible.length === 0 ? (
        <div className="text-muted-foreground flex flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-12 text-center">
          <CheckCircleIcon weight="fill" className="text-safe size-8" />
          <p className="text-sm font-medium">No active alerts</p>
          <p className="max-w-sm text-xs">
            Nothing has crossed a warning or danger threshold. New events from
            battery, gas, detection, monocopter, environment or comms will
            appear here.
          </p>
        </div>
      ) : (
        <div className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto pr-0.5">
          {visible.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onAcknowledge={() => acknowledge(alert.id)}
              onDismiss={() => dismiss(alert.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
