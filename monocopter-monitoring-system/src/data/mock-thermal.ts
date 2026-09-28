import { DETECTION_API_URL } from "@/lib/detection-api"

/** Heat-signature detection — same shape as RGB DetectionEvent, plus peak temp. */
export type ThermalDetection = {
  id: string
  time: string
  label: "Heat Signature" | "No Signature"
  confidence: number | null
  /** Peak temperature inside the signature box, °C */
  peakTempC: number | null
  sector: string
}

/** Expected false-color range once a real thermal camera is wired in. */
export const THERMAL_RANGE = { minC: 20, maxC: 45 }

/** Ironbow-style legend stops used by the temperature legend bar. */
export const THERMAL_LEGEND_STOPS = ["#0b0e14", "#7c2d12", "#ea580c", "#fbbf24", "#fefce8"]

/**
 * Future backend endpoints. detection-server/ does NOT serve these yet —
 * it needs a second camera source plus a temperature-to-color mapping
 * (same MJPEG-from-backend pattern as /video_feed). Until then the hook
 * below reports offline and the UI stays in its honest "not connected"
 * state. Do NOT fake a thermal filter over RGB footage.
 */
export const THERMAL_FEED_URL = `${DETECTION_API_URL}/thermal_feed`
export const THERMAL_HEALTH_PATH = `${DETECTION_API_URL}/api/thermal/health`
