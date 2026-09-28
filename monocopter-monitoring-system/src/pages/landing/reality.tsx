import { EyeSlashIcon, WarningIcon, UserIcon } from "@phosphor-icons/react"

import { SectionHeading } from "@/pages/landing/section-heading"
import { Reveal } from "@/pages/landing/reveal"

const RISKS = [
  {
    image: "/images/mine-tunnel-low-vis.png",
    icon: EyeSlashIcon,
    title: "LOW VISIBILITY",
    copy: "Dust, darkness and smoke limit human perception.",
  },
  {
    image: "/images/mine-tunnel-terrain.png",
    icon: WarningIcon,
    title: "UNSTABLE TERRAIN",
    copy: "Tunnel collapses and debris increase operational risk.",
  },
  {
    image: "/images/mine-worker-risk.png",
    icon: UserIcon,
    title: "HUMAN RISK",
    copy: "Workers may be trapped or unable to communicate.",
  },
]

export function Reality() {
  return (
    <section className="border-t bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <Reveal>
          <SectionHeading
            eyebrow="The reality underground"
            title={
              <>
                WHEN VISIBILITY DISAPPEARS, <span className="text-primary">INFORMATION SHOULDN&rsquo;T.</span>
              </>
            }
          />
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {RISKS.map((r, i) => (
            <Reveal key={r.title} delay={i * 90}>
              <figure>
                <div className="aspect-[4/3] overflow-hidden rounded-xl border border-border/60">
                  <img src={r.image} alt="" className="h-full w-full object-cover" />
                </div>
                <figcaption className="flex items-start gap-3 px-1 pt-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/40 text-primary">
                    <r.icon weight="bold" className="size-4.5" />
                  </span>
                  <span>
                    <span className="block text-xs font-semibold tracking-wide">{r.title}</span>
                    <span className="text-muted-foreground mt-1 block text-xs leading-relaxed">{r.copy}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
