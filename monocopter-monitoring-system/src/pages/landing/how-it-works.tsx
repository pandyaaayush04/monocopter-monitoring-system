import { ArrowRightIcon } from "@phosphor-icons/react"

import { SectionHeading } from "@/pages/landing/section-heading"
import { Reveal } from "@/pages/landing/reveal"

const STEPS: Array<{ n: string; title: string; tile: React.ReactNode; copy: string }> = [
  {
    n: "01",
    title: "EXPLORE",
    copy: "Monocopter enters hazardous zones.",
    tile: (
      <svg viewBox="0 0 120 72" className="block h-auto w-full" aria-hidden="true">
        <rect width="120" height="72" fill="#0B0605" />
        <ellipse cx="60" cy="40" rx="44" ry="30" fill="#160D08" />
        <ellipse cx="60" cy="40" rx="24" ry="17" fill="#050302" />
        <ellipse cx="60" cy="40" rx="10" ry="8" fill="#F5A524" opacity="0.5" />
        <ellipse cx="60" cy="26" rx="26" ry="4" fill="none" stroke="#8A6A4A" strokeWidth="1.5" />
        <rect x="56" y="24" width="8" height="12" rx="4" fill="#3A2412" />
      </svg>
    ),
  },
  {
    n: "02",
    title: "PERCEIVE",
    copy: "RGB and thermal vision observe the environment.",
    tile: (
      <svg viewBox="0 0 120 72" className="block h-auto w-full" aria-hidden="true">
        <rect width="120" height="72" fill="#0B0605" />
        <circle cx="60" cy="36" r="10" fill="none" stroke="#F5A524" strokeWidth="2" />
        <circle cx="60" cy="36" r="18" fill="none" stroke="#8A6A4A" strokeWidth="1.5" />
        <circle cx="60" cy="36" r="26" fill="none" stroke="#8A6A4A" strokeWidth="1" opacity="0.6" />
        <circle cx="60" cy="36" r="3" fill="#FBD9A8" />
      </svg>
    ),
  },
  {
    n: "03",
    title: "ANALYZE",
    copy: "AI identifies workers, hazards and anomalies.",
    tile: (
      <svg viewBox="0 0 120 72" className="block h-auto w-full" aria-hidden="true">
        <rect width="120" height="72" fill="#0B0605" />
        <rect x="46" y="12" width="28" height="48" fill="none" stroke="#22C55E" strokeWidth="2" />
        <circle cx="60" cy="24" r="5" fill="#4A2E18" />
        <rect x="53" y="30" width="14" height="18" rx="5" fill="#5A3A22" />
        <rect x="48" y="8" width="44" height="10" rx="2" fill="#22C55E" opacity="0.25" />
        <text x="60" y="15.5" textAnchor="middle" fontSize="6" fill="#4ADE80" fontFamily="monospace">0.94</text>
      </svg>
    ),
  },
  {
    n: "04",
    title: "LOCATE",
    copy: "Detected workers are mapped to mission position.",
    tile: (
      <svg viewBox="0 0 120 72" className="block h-auto w-full" aria-hidden="true">
        <rect width="120" height="72" fill="#0B0605" />
        <path d="M8 56 L38 56 L52 40 L78 40 L92 24 L112 24" fill="none" stroke="#4A3A28" strokeWidth="4" strokeLinecap="round" />
        <path d="M8 56 L38 56 L52 40 L78 40" fill="none" stroke="#F5A524" strokeWidth="2" strokeDasharray="4 3" />
        <circle cx="52" cy="40" r="4" fill="none" stroke="#F5A524" strokeWidth="1.5" />
        <circle cx="78" cy="40" r="5" fill="#EF4444" />
        <circle cx="78" cy="32" r="2.5" fill="#EF4444" />
      </svg>
    ),
  },
  {
    n: "05",
    title: "RESPOND",
    copy: "Surface operators receive real-time alerts and data.",
    tile: (
      <svg viewBox="0 0 120 72" className="block h-auto w-full" aria-hidden="true">
        <rect width="120" height="72" fill="#0B0605" />
        <rect x="18" y="12" width="34" height="26" rx="3" fill="#160D08" stroke="#8A6A4A" />
        <rect x="56" y="12" width="34" height="26" rx="3" fill="#160D08" stroke="#8A6A4A" />
        <rect x="37" y="20" width="30" height="4" rx="2" fill="#F5A524" opacity="0.7" />
        <rect x="60" y="20" width="22" height="4" rx="2" fill="#4ADE80" opacity="0.6" />
        <circle cx="60" cy="52" r="7" fill="#3A2412" />
        <rect x="52" y="56" width="16" height="10" rx="4" fill="#241509" />
      </svg>
    ),
  },
]

export function HowItWorks() {
  return (
    <section id="system" className="scroll-mt-16 border-t">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <Reveal>
          <SectionHeading eyebrow="How the system works" title="FROM TUNNEL TO DECISION IN FIVE STEPS." />
        </Reveal>
        <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 70}>
              <li className="relative">
                <p className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-primary tabular-nums">{s.n}</span>
                  <span className="text-xs font-semibold tracking-wide">{s.title}</span>
                </p>
                <div className="mt-3 overflow-hidden rounded-lg border">{s.tile}</div>
                <p className="text-muted-foreground mt-2 text-xs leading-relaxed">{s.copy}</p>
                {i < STEPS.length - 1 && (
                  <ArrowRightIcon weight="bold" className="absolute top-1/2 -right-3 hidden size-4 text-muted-foreground lg:block" aria-hidden="true" />
                )}
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
