import { ThermometerIcon } from "@phosphor-icons/react"

import { THERMAL_FEED_URL } from "@/data/mock-thermal"

export function ThermalViewPanel({ online }: { online: boolean }) {
  const timestamp = new Date().toLocaleTimeString("en-IN", { hour12: false })

  return (
    <div className="smooth-shadow-ring-md relative aspect-video w-full overflow-hidden rounded-xl bg-neutral-950">
      {online ? (
        <img src={THERMAL_FEED_URL} alt="Live thermal feed" className="size-full object-contain" />
      ) : (
        <div className="text-neutral-400 absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
          <ThermometerIcon className="size-8" />
          <p className="text-sm font-medium">Thermal camera not connected</p>
          <p className="max-w-md text-xs opacity-80">
            Wire a thermal source into detection-server/ (second camera + temperature-to-color
            mapping serving /thermal_feed) and this panel goes live — no dashboard changes needed.
          </p>
        </div>
      )}

      {online && (
        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
          <span className="bg-destructive inline-block size-2 animate-pulse rounded-full" />
          LIVE · THERMAL
        </div>
      )}
      <div className="absolute top-3 right-3 rounded-full bg-black/60 px-2.5 py-1 font-mono text-xs tabular-nums text-white backdrop-blur-sm">
        {timestamp}
      </div>
    </div>
  )
}
