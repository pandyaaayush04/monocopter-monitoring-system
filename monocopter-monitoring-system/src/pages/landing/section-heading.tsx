import type { ReactNode } from "react"

/** Eyebrow + heading lockup shared by every section (reference rhythm). */
export function SectionHeading({
  eyebrow,
  title,
  copy,
  align = "left",
}: {
  eyebrow: string
  title: ReactNode
  copy?: string
  align?: "left" | "center"
}) {
  const alignCls = align === "center" ? "items-center text-center" : "items-start text-left"
  return (
    <div className={`flex flex-col gap-3 ${alignCls}`}>
      <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] text-primary uppercase">
        <span className="inline-block h-px w-6 bg-primary" aria-hidden="true" />
        {eyebrow}
      </p>
      <h2 className="max-w-xl text-3xl font-bold tracking-tight text-balance sm:text-4xl">{title}</h2>
      {copy && <p className="text-muted-foreground max-w-xl text-sm leading-relaxed">{copy}</p>}
    </div>
  )
}
