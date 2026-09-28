import { useCallback, useRef, useState } from "react"
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react"

import { Badge } from "@/components/ui/badge"
import { SectionHeading } from "@/pages/landing/section-heading"
import { Reveal } from "@/pages/landing/reveal"
import { THERMAL_RANGE } from "@/data/mock-thermal"

/** Draggable RGB / thermal comparison — the signature interaction. */
function CompareSlider() {
  const [pos, setPos] = useState(25)
  const trackRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)

  const setFromClientX = useCallback((clientX: number) => {
    const el = trackRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPos(Math.min(96, Math.max(4, pct)))
  }, [])

  return (
    <div
      ref={trackRef}
      role="slider"
      tabIndex={0}
      aria-label="Reveal thermal view"
      aria-valuenow={Math.round(pos)}
      aria-valuemin={0}
      aria-valuemax={100}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") setPos((p) => Math.max(4, p - 4))
        if (e.key === "ArrowRight") setPos((p) => Math.min(96, p + 4))
      }}
      onPointerDown={(e) => {
        draggingRef.current = true
          ; (e.target as HTMLElement).setPointerCapture?.(e.pointerId)
        setFromClientX(e.clientX)
      }}
      onPointerMove={(e) => {
        if (draggingRef.current) setFromClientX(e.clientX)
      }}
      onPointerUp={() => {
        draggingRef.current = false
      }}
      className="relative aspect-video cursor-ew-resize touch-none overflow-hidden rounded-xl border shadow-lg select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      {/* thermal layer (base) — real thermal-camera readout, cropped past the device bezel */}
      <div className="absolute inset-0 overflow-hidden bg-black" aria-hidden="true">
        <img
          src="/images/thermal-readout.png"
          alt=""
          className="absolute top-1/2 left-1/2 h-[145%] w-[145%] -translate-x-1/2 -translate-y-1/2 object-cover"
        />
        <span className="absolute top-3 right-3 rounded-md bg-black/60 px-2 py-1 text-[10px] font-semibold tracking-wider text-white">
          THERMAL VIEW
        </span>
      </div>

      {/* normal layer (clipped) — same centered zoom as the thermal layer so both views match */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <div style={{ width: `${(100 / pos) * 100}%` }} className="relative h-full">
          <img src="/images/low_visibility_card.png" alt="" className="absolute top-1/2 left-1/2 h-[145%] w-[145%] -translate-x-1/2 -translate-y-1/2 object-cover brightness-50" />
        </div>
        <span className="absolute top-3 left-3 rounded-md bg-black/60 px-2 py-1 text-[10px] font-semibold tracking-wider text-white">
          NORMAL VIEW
        </span>
      </div>

      {/* handle */}
      <div className="absolute inset-y-0" style={{ left: `calc(${pos}% - 1px)` }} aria-hidden="true">
        <div className="h-full w-0.5 bg-white/90" />
        <div className="absolute top-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-card text-foreground shadow-md">
          <CaretLeftIcon weight="bold" className="size-4" />
          <CaretRightIcon weight="bold" className="size-4" />
        </div>
      </div>
    </div>
  )
}

export function Vision() {
  return (
    <section id="technology" className="scroll-mt-16 border-t bg-muted/40">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[1fr_1.6fr]">
        <Reveal>
          <SectionHeading
            eyebrow="Vision under darkness"
            title={
              <>
                WHEN THE HUMAN EYE STOPS SEEING, <span className="text-primary">THE SYSTEM KEEPS LOOKING.</span>
              </>
            }
            copy="Automatically switches to thermal vision in low visibility conditions, revealing workers and surroundings hidden to the naked eye. Drag the handle to compare."
          />
          <div className="mt-4 flex items-center gap-2">
            <Badge variant="outline" className="tabular-nums">
              {THERMAL_RANGE.minC}°C – {THERMAL_RANGE.maxC}°C
            </Badge>
            <span className="text-muted-foreground text-xs">false-color range</span>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <CompareSlider />
        </Reveal>
      </div>
    </section>
  )
}
