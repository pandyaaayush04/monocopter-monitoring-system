import { InsightCard } from "@/components/environment/insight-card"
import { useMockEnvironmentFeed } from "@/hooks/use-mock-environment-feed"
import type { EnvKey } from "@/data/mock-environment"

export function EnvironmentInsightsContent() {
  const { readings } = useMockEnvironmentFeed()

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {(Object.keys(readings) as EnvKey[]).map((key) => (
        <InsightCard key={key} reading={readings[key]} />
      ))}
    </div>
  )
}
