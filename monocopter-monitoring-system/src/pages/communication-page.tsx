import { CommsEventsLog } from "@/components/communication/comms-events-log"
import { CommsOverviewCard } from "@/components/communication/comms-overview-card"
import { CommsQualityChart } from "@/components/communication/comms-quality-chart"
import { StatusBanner } from "@/components/shared/status-banner"
import { useMockCommunicationFeed } from "@/hooks/use-mock-communication-feed"
import type { Status } from "@/lib/status"

const BANNER: Record<Status, { title: string; copy: string }> = {
  safe: { title: "Link Stable", copy: "Telemetry uplink is healthy." },
  warning: { title: "Link Degraded", copy: "Signal is weak — avoid deep tunnels until it recovers." },
  danger: { title: "Link Critical", copy: "Signal is critical — return toward the relay to restore telemetry." },
}

export function CommunicationPage() {
  const { series, signal, status, overall, latencyMs, lossPct, upKbps, downKbps, events } =
    useMockCommunicationFeed()
  const { title, copy } = BANNER[overall]

  return (
    <div className="flex flex-col gap-4">
      <StatusBanner status={overall} title={title} copy={copy} />
      <CommsOverviewCard
        signal={signal}
        status={status}
        latencyMs={latencyMs}
        lossPct={lossPct}
        upKbps={upKbps}
        downKbps={downKbps}
      />
      <CommsQualityChart series={series} status={status} />
      <CommsEventsLog events={events} />
    </div>
  )
}
