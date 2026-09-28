import { ArrowRightIcon, BellIcon, CheckCircleIcon, MapPinIcon, UserIcon, VideoCameraIcon } from "@phosphor-icons/react"

import { Reveal } from "@/pages/landing/reveal"

const NODES = [
  { icon: VideoCameraIcon, title: "DETECTION", lines: ["Person detected", "in live feed."] },
  { icon: CheckCircleIcon, title: "VERIFICATION", lines: ["AI confidence", "94.7%"] },
  { icon: MapPinIcon, title: "LOCALIZATION", lines: ["Sector B-4", "Depth 42.8 m"] },
  { icon: BellIcon, title: "ALERT", lines: ["Rescue priority", "HIGH"], alert: true },
  { icon: UserIcon, title: "OPERATOR", lines: ["Live visual", "confirmed."] },
]

export function RescueIntel() {
  return (
    <section id="live" className="scroll-mt-16 border-t bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <Reveal>
          <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] text-primary uppercase">
            <span className="inline-block h-px w-6 bg-primary" aria-hidden="true" />
            Rescue intelligence
          </p>
          <p className="mt-3 max-w-xl text-xl leading-relaxed font-medium text-balance sm:text-2xl">
            From detection to decision, enabling faster and safer rescue operations.
          </p>
        </Reveal>
        <ol className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {NODES.map((n, i) => (
            <Reveal key={n.title} delay={i * 70}>
              <li className="relative rounded-xl border bg-card px-4 py-5 text-center shadow-sm">
                <span className="mx-auto flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <n.icon weight="bold" className="size-5" />
                </span>
                <p className="mt-3 text-[11px] font-semibold tracking-wider">{n.title}</p>
                {n.lines.map((l) => (
                  <p key={l} className={`text-xs ${n.alert && l === "HIGH" ? "font-bold text-destructive" : "text-muted-foreground"}`}>
                    {l}
                  </p>
                ))}
                {i < NODES.length - 1 && (
                  <ArrowRightIcon weight="bold" className="absolute top-1/2 -right-3.5 hidden size-4 -translate-y-1/2 text-muted-foreground lg:block" aria-hidden="true" />
                )}
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
