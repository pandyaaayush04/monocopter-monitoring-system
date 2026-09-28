import { ShieldCheckIcon } from "@phosphor-icons/react"

export function NoSituationCard() {
  return (
    <div className="text-muted-foreground flex flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-12 text-center">
      <ShieldCheckIcon weight="fill" className="text-safe size-8" />
      <p className="text-sm font-medium">No active rescue situation</p>
      <p className="max-w-sm text-xs">
        Nothing currently rises to rescue level. Individual warnings still appear in the
        Alerts feed — this panel only speaks up when events combine into a situation.
      </p>
    </div>
  )
}
