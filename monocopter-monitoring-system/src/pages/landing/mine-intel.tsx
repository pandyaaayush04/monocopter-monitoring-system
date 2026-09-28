import { MapTrifoldIcon, MapPinIcon, ThermometerIcon, VideoCameraIcon } from "@phosphor-icons/react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SectionHeading } from "@/pages/landing/section-heading"
import { Reveal } from "@/pages/landing/reveal"

const FEATURES = [
  { icon: ThermometerIcon, text: "Gas, temperature and humidity monitoring" },
  { icon: VideoCameraIcon, text: "Live video and thermal feed" },
  { icon: MapPinIcon, text: "Worker detection and localization" },
  { icon: MapTrifoldIcon, text: "Mine mapping and mission tracking" },
]

const ENV: Array<[string, string, boolean?]> = [
  ["Temperature", "31.4 °C", false],
  ["Humidity", "68 %", false],
  ["Gas (CO)", "12 ppm", false],
  ["Visibility", "LOW", true],
]

export function MineIntel() {
  return (
    <section id="features" className="scroll-mt-16 border-t">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[1fr_1.5fr]">
        <Reveal>
          <SectionHeading
            eyebrow="Mine intelligence"
            copy="Real-time environmental monitoring and spatial awareness for informed decision making."
            title={<>EVERY READING, <span className="text-primary">ON ONE MAP.</span></>}
          />
          <ul className="mt-6 flex flex-col gap-4">
            {FEATURES.map((f) => (
              <li key={f.text} className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/40 text-primary">
                  <f.icon weight="bold" className="size-4.5" />
                </span>
                <span className="text-sm">{f.text}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={120}>
          <div className="grid gap-4 sm:grid-cols-[1.6fr_1fr]">
            <Card className="py-4">
              <CardHeader className="px-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-semibold tracking-wider text-muted-foreground">MISSION 07</CardTitle>
                  <p className="flex items-center gap-1 text-[11px] font-semibold text-safe">
                    <span className="inline-block size-1.5 animate-pulse rounded-full bg-safe" />
                    LIVE
                  </p>
                </div>
              </CardHeader>
              <CardContent className="px-4">
                <div className="relative overflow-hidden rounded-lg border">
                  <img src="/images/mine-map.jpg" alt="Live SLAM mine map — Sector B" className="block h-auto w-full" />
                  <div className="absolute top-2 left-2 w-20 overflow-hidden rounded-md border border-white/20 shadow-md sm:w-24">
                    <img src="/images/mine-tunnel-terrain.png" alt="Sector B-4 camera feed" className="block aspect-[4/3] h-auto w-full object-cover" />
                    <span className="absolute inset-x-0 bottom-0 bg-black/70 px-1.5 py-0.5 text-[8px] font-semibold tracking-wider text-white">SECTOR B-4</span>
                  </div>
                </div>
                <p className="text-muted-foreground mt-2 text-[11px]">Live SLAM map from the console.</p>
              </CardContent>
            </Card>
            <div className="flex flex-col gap-4">
              <Card className="py-4">
                <CardHeader className="px-4">
                  <CardTitle className="text-xs font-semibold tracking-wider text-muted-foreground">ENVIRONMENT</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col divide-y divide-border/70 px-4">
                  {ENV.map(([k, v, alert]) => (
                    <div key={k} className="flex items-center justify-between py-1.5 text-xs">
                      <span className="text-muted-foreground">{k}</span>
                      <span className={`font-semibold tabular-nums ${alert ? "text-destructive" : ""}`}>{v}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card className="py-4">
                <CardHeader className="px-4">
                  <CardTitle className="text-xs font-semibold tracking-wider text-muted-foreground">DETECTIONS</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col divide-y divide-border/70 px-4">
                  {[
                    ["Person 1", "1"],
                    ["Confidence", "94.7%"],
                    ["Time", "14:31:48"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between py-1.5 text-xs">
                      <span className="text-muted-foreground">{k}</span>
                      <span className="font-semibold tabular-nums">{v}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
