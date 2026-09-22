import { useRef, useState } from "react"
import {
  CameraIcon,
  RecordIcon,
  CornersOutIcon,
  SlidersHorizontalIcon,
  VideoCameraSlashIcon,
  ThermometerIcon,
  PlugsConnectedIcon,
} from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { DETECTION_API_URL, VIDEO_FEED_URL } from "@/lib/detection-api"

export function VideoPanel({
  online,
  cameraOpen,
}: {
  online: boolean
  cameraOpen: boolean
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [source, setSource] = useState<"rgb" | "thermal">("rgb")
  const [recording, setRecording] = useState(false)

  const ready = online && cameraOpen

  async function handleSnapshot() {
    if (!ready) return
    const res = await fetch(`${DETECTION_API_URL}/api/snapshot`)
    if (!res.ok) return
    const blob = await res.blob()
    const link = document.createElement("a")
    link.download = `mine-rescue-snapshot-${Date.now()}.jpg`
    link.href = URL.createObjectURL(blob)
    link.click()
    URL.revokeObjectURL(link.href)
  }

  function handleFullscreen() {
    panelRef.current?.requestFullscreen().catch(() => {})
  }

  const timestamp = new Date().toLocaleTimeString("en-IN", { hour12: false })

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Live Camera Feed & Human Detection</h2>
          <p className="text-muted-foreground text-sm">
            Real-time video stream with AI-based human detection
          </p>
        </div>
        <Tabs value={source} onValueChange={(v) => setSource(v as typeof source)}>
          <TabsList>
            <TabsTrigger value="rgb">RGB Camera</TabsTrigger>
            <TabsTrigger value="thermal">Thermal Camera</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div
        ref={panelRef}
        className="smooth-shadow-ring-md relative aspect-video w-full overflow-hidden rounded-xl bg-neutral-950"
      >
        {source === "rgb" ? (
          <>
            {ready ? (
              <img src={VIDEO_FEED_URL} alt="Live detection feed" className="size-full object-contain" />
            ) : (
              <div className="text-neutral-400 absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
                {online ? <VideoCameraSlashIcon className="size-8" /> : <PlugsConnectedIcon className="size-8" />}
                <p className="text-sm">
                  {online
                    ? "Detection server running, but no camera is open — check CAMERA_SOURCE in detection-server"
                    : "Detection service offline — run the detection-server (see README) to see the live feed"}
                </p>
              </div>
            )}

            {ready && (
              <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                <span className="bg-destructive inline-block size-2 animate-pulse rounded-full" />
                LIVE
              </div>
            )}
            <div className="absolute top-3 right-3 rounded-full bg-black/60 px-2.5 py-1 font-mono text-xs tabular-nums text-white backdrop-blur-sm">
              {timestamp}
            </div>
          </>
        ) : (
          <div className="text-neutral-400 absolute inset-0 flex flex-col items-center justify-center gap-2">
            <ThermometerIcon className="size-8" />
            <p className="text-sm">Thermal camera not connected</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleSnapshot} disabled={!ready}>
          <CameraIcon />
          Snapshot
        </Button>
        <Button
          variant={recording ? "default" : "outline"}
          size="sm"
          onClick={() => setRecording((r) => !r)}
          disabled={!ready}
        >
          <RecordIcon weight="fill" className={recording ? "" : "text-destructive"} />
          {recording ? "Recording…" : "Record"}
        </Button>
        <Button variant="outline" size="sm" onClick={handleFullscreen} disabled={!ready}>
          <CornersOutIcon />
          Fullscreen
        </Button>

        <Tooltip>
          <TooltipTrigger asChild>
            <span className="ml-auto">
              <Button variant="outline" size="sm" disabled>
                <SlidersHorizontalIcon />
                Camera Settings
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>Arrives with camera calibration module</TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
