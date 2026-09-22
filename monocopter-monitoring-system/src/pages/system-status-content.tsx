import { ReadinessBanner } from "@/components/monocopter/readiness-banner"
import { SignalStrengthCard } from "@/components/monocopter/signal-strength-card"
import { SystemChecklistCard } from "@/components/monocopter/system-checklist-card"
import { useMockSignalFeed } from "@/hooks/use-mock-signal-feed"
import { SYSTEM_CHECKLIST, overallReadiness } from "@/data/mock-system-status"

export function SystemStatusContent() {
  const { pct, status: signalStatus } = useMockSignalFeed()
  const readiness = overallReadiness(SYSTEM_CHECKLIST, signalStatus)

  return (
    <div className="flex flex-col gap-4">
      <ReadinessBanner status={readiness} />
      <SignalStrengthCard pct={pct} status={signalStatus} />
      <SystemChecklistCard items={SYSTEM_CHECKLIST} />
    </div>
  )
}
