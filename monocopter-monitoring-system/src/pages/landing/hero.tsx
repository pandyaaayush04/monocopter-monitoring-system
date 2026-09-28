import { ArrowRightIcon, PlayCircleIcon } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { TunnelArt } from "@/pages/landing/tunnel-art"
import { Reveal } from "@/pages/landing/reveal"

const TELEMETRY: Array<[string, string, boolean?]> = [
  ["ALTITUDE", "42.8 m", false],
  ["TEMPERATURE", "31.4 °C", false],
  ["HUMIDITY", "68 %", false],
  ["VISIBILITY", "LOW", true],
]

const PILLARS: Array<[string, string, string]> = [
  ["01", "EXPLORE", "HAZARDOUS ZONES"],
  ["02", "DETECT", "WORKERS & RISKS"],
  ["03", "SUPPORT", "RESCUE OPERATIONS"],
]

export function Hero({ onExplore }: { onExplore: () => void }) {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* mine backdrop with a light legibility wash */}
      <img
        src="/images/hero-mine.jpg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[70%_center]"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/15" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pt-12 pb-14 sm:px-6 lg:grid-cols-[1.02fr_1fr] lg:pt-16">
        <Reveal>
          <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] text-primary uppercase">
            <span className="inline-block h-px w-6 bg-primary" aria-hidden="true" />
            AI powered underground monitoring
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            SEE WHAT&rsquo;S HIDDEN.
            <br />
            <span className="text-primary">PROTECT WHAT&rsquo;S INSIDE.</span>
          </h1>
          <p className="text-muted-foreground mt-4 max-w-md text-sm leading-relaxed sm:text-base">
            An intelligent aerial exploration and monitoring system for hazardous underground
            mines, designed to detect risks, locate trapped workers and support faster, safer
            rescue operations.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button size="lg" onClick={onExplore}>
              Explore System
              <ArrowRightIcon />
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#technology">
                <PlayCircleIcon />
                Watch Demo
              </a>
            </Button>
          </div>
          <dl className="mt-10 grid grid-cols-3 gap-4 border-t pt-6">
            {PILLARS.map(([n, title, sub]) => (
              <div key={n}>
                <dt className="text-muted-foreground text-xs font-medium tabular-nums">{n}</dt>
                <dd className="mt-1 text-xs font-semibold tracking-wide">{title}</dd>
                <dd className="text-muted-foreground text-[11px]">{sub}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={120}>
          <div className="relative mx-auto w-full max-w-md lg:ml-auto">
            {/* telemetry card */}
            <div className="rounded-xl border bg-card/95 p-4 shadow-lg backdrop-blur">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold tracking-wider text-muted-foreground">MISSION 07</p>
                <p className="flex items-center gap-1 text-[11px] font-semibold text-safe">
                  <span className="inline-block size-1.5 animate-pulse rounded-full bg-safe" />
                  LIVE
                </p>
              </div>
              <div className="mt-2 flex flex-col divide-y divide-border/70">
                {TELEMETRY.map(([k, v, alert]) => (
                  <div key={k} className="flex items-center justify-between py-1.5 text-xs">
                    <span className="text-muted-foreground">{k}</span>
                    <span className={`font-semibold tabular-nums ${alert ? "text-destructive" : ""}`}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* detection card */}
            <div className="mt-4 rounded-xl border bg-card/95 p-4 shadow-lg backdrop-blur">
              <p className="text-[11px] font-semibold tracking-wider text-muted-foreground">WORKER DETECTED</p>
              <div className="relative mt-2 overflow-hidden rounded-md border">
                <TunnelArt variant="figure" label="Detected worker thumbnail" className="block h-auto w-full" />
                <span className="absolute inset-x-6 top-2 bottom-2 rounded-sm border-2 border-warning" aria-hidden="true" />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">CONFIDENCE</span>
                <span className="font-semibold text-safe tabular-nums">94.7%</span>
              </div>
              <p className="text-xs text-muted-foreground tabular-nums">SECTOR B-4</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
