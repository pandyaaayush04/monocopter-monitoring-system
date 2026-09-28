import { ArrowRight, Hexagon, Target, MapPin, Eye } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/pages/landing/reveal"

const METRICS = [
  { title: "MONITOR", copy: "Hazards in real-time", icon: Hexagon },
  { title: "DETECT", copy: "Workers & risks", icon: Target },
  { title: "LOCATE", copy: "Underground", icon: MapPin },
  { title: "RESPOND", copy: "Faster & safer", icon: Eye },
]

export function Closing({ onExplore }: { onExplore: () => void }) {
  return (
    <footer id="about" className="landing-dark bg-[#0f1115] py-20 lg:py-28 relative overflow-hidden border-t border-white/10">
      <div className="absolute inset-0 z-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MDAiIGhlaWdodD0iODAwIiB2aWV3Qm94PSIwIDAgODAwIDgwMCI+CjxwYXRoIGQ9Ik0wLDQwMCBDMTAwLDMwMCAzMDAsMjAwIDQwMCwyMDAgQzUwMCwyMDAgNzAwLDI1MCA4MDAsNDAwIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMSIvPgo8cGF0aCBkPSJNMAs0NTAgQzEwMCwzNTAgMzAwLDI1MCA0MDAsMjUwIEM1MDAsMjUwIDcwMCwzMDAgODAwLDQ1MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEiLz4KPHBhdGggZD0iTTAsNTAwIEMxMDAsNDAwIDMwMCwzMDAgNDAwLDMwMCBDNTAwLDMwMCA3MDAsMzUwIDgwMCw1MDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxIi8+Cjwvc3ZnPg==')] bg-cover bg-center" aria-hidden="true" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 grid lg:grid-cols-[1.5fr_1fr] gap-16 lg:gap-12 items-center">
        <Reveal>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-[2px] w-8 bg-primary"></div>
            <p className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-zinc-400 uppercase">
              SAFER MINES. STRONGER RESCUE OPERATIONS.
            </p>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
            Know the mine<br />
            before you enter it.
          </h2>
          
          <p className="text-zinc-400 text-lg leading-relaxed max-w-md mb-10 font-light">
            Real-time insights for safer and more effective underground rescue operations.
          </p>
          
          <Button size="lg" onClick={onExplore} className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 rounded-md font-semibold text-base transition-all hover:translate-x-1">
            Explore the System
            <ArrowRight weight="bold" className="ml-2" />
          </Button>
        </Reveal>

        <Reveal delay={100} className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4 mt-8 lg:mt-0">
          {METRICS.map((m) => (
            <div key={m.title} className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center text-primary mb-4">
                <m.icon weight="regular" className="w-10 h-10" />
              </div>
              <h4 className="text-[10px] font-bold tracking-widest text-white uppercase">{m.title}</h4>
              <p className="text-[11px] text-zinc-400 font-medium mt-1">{m.copy}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </footer>
  )
}
