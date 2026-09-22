import { StatusBanner } from "@/components/shared/status-banner"
import { STATUS_LABEL, type Status } from "@/lib/status"

const COPY: Record<Status, string> = {
  safe: "Battery healthy. Mission can continue as planned.",
  warning: "Battery running low. Begin planning a return to base.",
  danger: "Critical battery level. Return to base immediately.",
}

export function BatteryStatusBanner({ status }: { status: Status }) {
  return <StatusBanner status={status} title={`Battery Status: ${STATUS_LABEL[status]}`} copy={COPY[status]} />
}
