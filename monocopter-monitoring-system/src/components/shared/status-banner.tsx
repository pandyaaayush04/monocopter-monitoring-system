import { CheckCircleIcon, WarningIcon, WarningOctagonIcon, type Icon } from "@phosphor-icons/react"
import type { Status } from "@/lib/status"
import { STATUS_BANNER_CLASS } from "@/lib/status"

const DEFAULT_ICON: Record<Status, Icon> = {
  safe: CheckCircleIcon,
  warning: WarningIcon,
  danger: WarningOctagonIcon,
}

export function StatusBanner({
  status,
  title,
  copy,
  icon,
}: {
  status: Status
  title: string
  copy: string
  icon?: Icon
}) {
  const Icon = icon ?? DEFAULT_ICON[status]
  return (
    <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${STATUS_BANNER_CLASS[status]}`}>
      <Icon weight="fill" className="size-5 shrink-0" />
      <div className="min-w-0">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs opacity-80">{copy}</p>
      </div>
    </div>
  )
}
