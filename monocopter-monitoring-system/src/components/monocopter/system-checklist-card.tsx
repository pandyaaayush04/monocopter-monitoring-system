import { CheckCircleIcon, WarningIcon, XCircleIcon } from "@phosphor-icons/react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ChecklistItem } from "@/data/mock-system-status"
import { STATUS_TEXT_CLASS } from "@/lib/status"

const ICON = { safe: CheckCircleIcon, warning: WarningIcon, danger: XCircleIcon }

export function SystemChecklistCard({ items }: { items: ChecklistItem[] }) {
  return (
    <Card className="smooth-shadow-sm py-4">
      <CardHeader className="px-4">
        <CardTitle className="text-sm font-semibold">Pre-Flight System Checklist</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col divide-y px-4">
        {items.map((item) => {
          const Icon = ICON[item.status]
          return (
            <div key={item.id} className="flex items-start gap-3 py-2.5 first:pt-0 last:pb-0">
              <Icon weight="fill" className={`mt-0.5 size-4.5 shrink-0 ${STATUS_TEXT_CLASS[item.status]}`} />
              <div className="min-w-0">
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-muted-foreground text-xs">{item.detail}</p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
