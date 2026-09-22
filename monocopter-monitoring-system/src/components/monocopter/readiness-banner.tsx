import { StatusBanner } from "@/components/shared/status-banner"
import type { Status } from "@/lib/status"

const CONTENT: Record<Status, { title: string; copy: string }> = {
  safe: { title: "Ready for Operation", copy: "All systems nominal. Monocopter is cleared for launch." },
  warning: { title: "Pre-Flight Check Required", copy: "One or more subsystems need attention before launch." },
  danger: { title: "Not Ready — Do Not Launch", copy: "Critical system fault detected. Resolve before flight." },
}

export function ReadinessBanner({ status }: { status: Status }) {
  const { title, copy } = CONTENT[status]
  return <StatusBanner status={status} title={title} copy={copy} />
}
