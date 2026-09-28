import { CameraIcon, DroneIcon, ThermometerIcon, WifiHighIcon } from "@phosphor-icons/react"

import { Reveal } from "@/pages/landing/reveal"

const SPECS = [
  { icon: CameraIcon, title: "45° angle facing camera", sub: "(RGB + Thermal)" },
  { icon: ThermometerIcon, title: "Sensor array", sub: "Gas, temperature, humidity" },
  { icon: DroneIcon, title: "Stable and compact design", sub: "For confined spaces" },
  { icon: WifiHighIcon, title: "Real-time communication", sub: "With surface station" },
]

export function Monocopter() {
  return (
    <section className="relative overflow-hidden border-t">
      <div className="mx-auto grid max-w-6xl items-stretch gap-8 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-2">
        <Reveal className="flex flex-col justify-center">
          <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] text-primary uppercase">
            <span className="inline-block h-px w-6 bg-primary" aria-hidden="true" />
            The monocopter
          </p>
          <p className="mt-3 max-w-md text-xl leading-relaxed font-medium text-balance sm:text-2xl">
            A compact aerial platform designed for underground exploration in confined and hazardous spaces.
          </p>
          <ul className="mt-8 flex flex-col gap-5">
            {SPECS.map((s) => (
              <li key={s.title} className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-primary/40 text-primary">
                  <s.icon weight="bold" className="size-5" />
                </span>
                <span>
                  <span className="block text-sm font-medium">{s.title}</span>
                  <span className="text-muted-foreground block text-xs">{s.sub}</span>
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={120} className="relative min-h-72 overflow-hidden rounded-xl lg:min-h-full">
          <img
            src="/images/monocopter.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-background/20 to-transparent"
            aria-hidden="true"
          />
        </Reveal>
      </div>
    </section>
  )
}
