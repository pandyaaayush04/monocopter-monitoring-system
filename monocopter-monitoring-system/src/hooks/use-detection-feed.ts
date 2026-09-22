import { useEffect, useRef, useState } from "react"
import { fetchCurrentDetection, fetchDetectionHistory, fetchHealth } from "@/lib/detection-api"
import type { BoundingBox, DetectionEvent } from "@/lib/detection-types"

const POLL_MS = 1000

type LiveEvent = DetectionEvent & { box: BoundingBox | null }

const IDLE_EVENT: DetectionEvent = { id: "idle", time: "--:--:--", label: "No Person", confidence: null, sector: "—" }

/**
 * Polls the detection-server (see /detection-server) for the live YOLO
 * feed. No mock fallback: if the backend is unreachable, `online` goes
 * false and callers should show that honestly rather than fake data.
 */
export function useDetectionFeed() {
  const [event, setEvent] = useState<DetectionEvent>(IDLE_EVENT)
  const [box, setBox] = useState<BoundingBox | null>(null)
  const [history, setHistory] = useState<DetectionEvent[]>([])
  const [online, setOnline] = useState(false)
  const [cameraOpen, setCameraOpen] = useState(false)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true

    async function tick() {
      const [health, current, hist] = await Promise.all([
        fetchHealth(),
        fetchCurrentDetection<LiveEvent>(),
        fetchDetectionHistory<DetectionEvent>(),
      ])
      if (!mounted.current) return

      setOnline(health !== null)
      setCameraOpen(health?.camera_open ?? false)
      if (current) {
        const { box: b, ...rest } = current
        setEvent(rest)
        setBox(b)
      }
      if (hist) setHistory(hist)
    }

    tick()
    const id = setInterval(tick, POLL_MS)
    return () => {
      mounted.current = false
      clearInterval(id)
    }
  }, [])

  return { event, box, history, online, cameraOpen }
}
