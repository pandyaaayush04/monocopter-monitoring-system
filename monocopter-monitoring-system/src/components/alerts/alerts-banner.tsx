import { StatusBanner } from "@/components/shared/status-banner"
import type { Status } from "@/lib/status"

const CONTENT: Record<Status, { title: string; copy: string }> = {
  safe: {
    title: "No active alerts",
    copy: "All monitored modules report safe status.",
  },
  warning: {
    title: "Attention needed",
    copy: "One or more modules report a warning. Review the feed and act.",
  },
  danger: {
    title: "Critical alerts active",
    copy: "A danger-level event needs immediate action.",
  },
}

export function AlertsBanner({
  status,
  activeCount,
}: {
  status: Status
  activeCount: number
}) {
  const { title, copy } = CONTENT[status]
  return (
    <StatusBanner
      status={status}
      title={activeCount > 0 ? `${title} — ${activeCount} active` : title}
      copy={copy}
    />
  )
}
