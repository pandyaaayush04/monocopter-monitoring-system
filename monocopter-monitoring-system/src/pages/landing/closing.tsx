import { ArrowRightIcon } from "@phosphor-icons/react"

import { MinewatchMark } from "@/components/minewatch-mark"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/pages/landing/reveal"

const FOOT_LINKS: Array<[string, string]> = [
  ["Home", "#top"],
  ["System", "#system"],
  ["Features", "#features"],
  ["Technology", "#technology"],
  ["About", "#about"],
]

export function Closing({ onExplore }: { onExplore: () => void }) {
  return (
    <>
      {/* CTA band — full-bleed mine photo, no card, no inset margin */}
      <section className="relative overflow-hidden border-t">
        <img
          src="/images/hero-mine.jpg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[30%_center]"
        />
        <div className="pointer-events-none absolute inset-0 bg-black/60" aria-hidden="true" />

        <Reveal>
          <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-20 sm:px-6 sm:py-28 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl">
                Know the mine
                <br />
                before you enter it.
              </h2>
              <p className="mt-3 text-[11px] font-semibold tracking-[0.22em] text-white/70">
                MONITOR&nbsp;&nbsp;•&nbsp;&nbsp;DETECT&nbsp;&nbsp;•&nbsp;&nbsp;LOCATE&nbsp;&nbsp;•&nbsp;&nbsp;RESPOND
              </p>
            </div>
            <Button size="lg" onClick={onExplore}>
              Explore the System
              <ArrowRightIcon />
            </Button>
          </div>
        </Reveal>
      </section>

      {/* footer */}
      <footer id="about" className="scroll-mt-16 border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-10 sm:px-6 md:flex-row md:justify-between">
          <a href="#top" className="flex items-center gap-2.5">
            <MinewatchMark className="h-8 w-8" />
            <span className="flex flex-col leading-none">
              <span className="font-heading text-sm font-semibold tracking-wide">MINEWATCH</span>
              <span className="text-muted-foreground text-[10px] tracking-[0.14em]">SEE DEEPER. SAVE LIVES.</span>
            </span>
          </a>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2" aria-label="Footer">
            {FOOT_LINKS.map(([label, href]) => (
              <a key={label} href={href} className="text-muted-foreground text-xs transition-colors hover:text-foreground">
                {label}
              </a>
            ))}
          </nav>
          <p className="text-muted-foreground max-w-45 text-center text-[11px] leading-relaxed md:text-right">
            Built for safer mines and stronger rescue operations.
          </p>
        </div>
      </footer>
    </>
  )
}
