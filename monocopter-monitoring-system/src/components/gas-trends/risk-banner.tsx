import { CheckCircleIcon, WarningIcon, WarningOctagonIcon } from "@phosphor-icons/react"
import type { GasStatus } from "@/data/mock-gas"
import { STATUS_LABEL } from "@/lib/status"
import { StatusBanner } from "@/components/shared/status-banner"

const ICON: Record<GasStatus, typeof CheckCircleIcon> = {
  safe: CheckCircleIcon,
  warning: WarningIcon,
  danger: WarningOctagonIcon,
}

const COPY: Record<GasStatus, string> = {
  safe: "All gas readings within safe limits.",
  warning: "One or more readings approaching hazardous levels. Monitor closely.",
  danger: "Hazardous gas level detected. Evacuate sector and alert rescue team.",
}

export function RiskBanner({ status }: { status: GasStatus }) {
  return (
    <StatusBanner
      status={status}
      icon={ICON[status]}
      title={`Environment Risk: ${STATUS_LABEL[status]}`}
      copy={COPY[status]}
    />
  )
}
