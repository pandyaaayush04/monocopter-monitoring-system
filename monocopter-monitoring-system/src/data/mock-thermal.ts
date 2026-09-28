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

// Real thermal-camera footage (simulation clip), served as a static asset and looped
// client-side - not a filter over RGB footage. Swap this file to point at a live thermal
// feed later (e.g. detection-server serving /thermal_feed) without touching the panel.
export const THERMAL_FEED_URL = "/video/thermal.mp4"
