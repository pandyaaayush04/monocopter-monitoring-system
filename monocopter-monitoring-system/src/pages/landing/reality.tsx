import { EyeSlashIcon, WarningIcon, UserIcon } from "@phosphor-icons/react"

import { Card, CardContent } from "@/components/ui/card"
import { SectionHeading } from "@/pages/landing/section-heading"
import { TunnelArt } from "@/pages/landing/tunnel-art"
import { Reveal } from "@/pages/landing/reveal"

const RISKS = [
  {
    variant: "dim" as const,
    icon: EyeSlashIcon,
    title: "LOW VISIBILITY",
    copy: "Dust, darkness and smoke limit human perception.",
  },
  {
    variant: "rubble" as const,
    icon: WarningIcon,
    title: "UNSTABLE TERRAIN",
    copy: "Tunnel collapses and debris increase operational risk.",
  },
  {
    variant: "figure" as const,
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
              <Card className="overflow-hidden py-0">
                <div className="overflow-hidden">
                  <TunnelArt variant={r.variant} label={r.title} className="block h-auto w-full" />
                </div>
                <CardContent className="flex items-start gap-3 px-5 py-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <r.icon weight="bold" className="size-4.5" />
                  </span>
                  <span>
                    <span className="block text-xs font-semibold tracking-wide">{r.title}</span>
                    <span className="text-muted-foreground mt-1 block text-xs leading-relaxed">{r.copy}</span>
                  </span>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
