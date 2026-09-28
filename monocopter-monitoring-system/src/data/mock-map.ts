import type { Status } from "@/lib/status"

export type MapPoint = { x: number; y: number }

export type Waypoint = MapPoint & { id: string; label: string; visited: boolean }

export type SectorInfo = {
  id: string
  name: string
  avgDepthM: number
  tunnelLengthM: number
  mappedPct: number
  unexploredPct: number
}

export type KeyLocationType = "entrance" | "waypoint" | "hazard" | "human"

export type KeyLocation = {
  id: string
  type: KeyLocationType
  name: string
  distanceM: number
  status: Status
}

export type MonocopterPose = {
  /** SLAM-estimated position in metres, mine-local frame (NOT GPS) */
  x: number
  y: number
  z: number
  sectorId: string
  flightMode: "Autonomous" | "Manual"
  speedMs: number
  altitudeM: number
}

// --- Static mine geometry (SVG viewBox 0 0 400 300) ---

export const TUNNEL_PATHS: string[] = [
  "M 20 250 L 90 250 L 140 210 L 220 210 L 270 160 L 360 160",
  "M 140 210 L 140 120 L 200 80 L 300 80",
  "M 220 210 L 220 260 L 320 260",
  "M 90 250 L 90 180 L 140 120",
  "M 270 160 L 270 110 L 300 80",
]

export const FLIGHT_PATH: MapPoint[] = [
  { x: 20, y: 250 },
  { x: 90, y: 250 },
  { x: 140, y: 210 },
  { x: 220, y: 210 },
  { x: 270, y: 160 },
  { x: 360, y: 160 },
]

export const WAYPOINTS: Waypoint[] = [
  { id: "wp1", label: "WP-1", x: 90, y: 250, visited: true },
  { id: "wp2", label: "WP-2", x: 140, y: 210, visited: true },
  { id: "wp3", label: "WP-3", x: 220, y: 210, visited: true },
  { id: "wp4", label: "WP-4", x: 270, y: 160, visited: false },
  { id: "wp5", label: "WP-5", x: 360, y: 160, visited: false },
]

export const HUMAN_MARKER: MapPoint & { label: string; confidence: number } = {
  x: 248,
  y: 188,
  label: "Detected human — last known",
  confidence: 0.82,
}

export const HAZARD_ZONE = { x: 250, y: 230, w: 60, h: 40, label: "Hazard zone" }

export const BLOCKED_PATH: MapPoint & { label: string } = {
  x: 300,
  y: 80,
  label: "Blocked path",
}

export const ENTRANCE: MapPoint & { label: string } = {
  x: 20,
  y: 250,
  label: "Entrance / Exit",
}

export const SECTORS: SectorInfo[] = [
  { id: "A", name: "Sector A", avgDepthM: 42, tunnelLengthM: 1240, mappedPct: 78, unexploredPct: 22 },
  { id: "B", name: "Sector B", avgDepthM: 65, tunnelLengthM: 1860, mappedPct: 54, unexploredPct: 46 },
  { id: "C", name: "Sector C", avgDepthM: 88, tunnelLengthM: 960, mappedPct: 31, unexploredPct: 69 },
]

export const KEY_LOCATIONS: KeyLocation[] = [
  { id: "entrance", type: "entrance", name: "Main Entrance", distanceM: 0, status: "safe" },
  { id: "wp2", type: "waypoint", name: "WP-2", distanceM: 180, status: "safe" },
  { id: "wp4", type: "waypoint", name: "WP-4", distanceM: 420, status: "warning" },
  { id: "haz1", type: "hazard", name: "Hazard Zone B-2", distanceM: 510, status: "danger" },
  { id: "hum1", type: "human", name: "Detected Human B", distanceM: 455, status: "warning" },
]

export const KEY_TYPE_LABEL: Record<KeyLocationType, string> = {
  entrance: "Entrance",
  waypoint: "Waypoint",
  hazard: "Hazard",
  human: "Human",
}

/** Seed pose: part-way along the flight path in Sector B. */
export function seedPose(): MonocopterPose {
  return {
    x: 186.4,
    y: 42.1,
    z: -65.0,
    sectorId: "B",
    flightMode: "Autonomous",
    speedMs: 1.8,
    altitudeM: 2.4,
  }
}

/** Advance the SLAM-estimated pose a little each tick (sensor drift). */
export function walkPose(prev: MonocopterPose): MonocopterPose {
  return {
    ...prev,
    x: Number((prev.x + 0.3 + (Math.random() - 0.5) * 0.4).toFixed(1)),
    y: Number((prev.y + 0.1 + (Math.random() - 0.5) * 0.3).toFixed(1)),
    speedMs: Number(Math.max(0, Math.min(4, prev.speedMs + (Math.random() - 0.5) * 0.4)).toFixed(1)),
    altitudeM: Number(
      Math.max(0.5, Math.min(5, prev.altitudeM + (Math.random() - 0.5) * 0.3)).toFixed(1),
    ),
  }
}

/** SVG position of the monocopter = projection of flight-path progress. */
export function poseToSvg(progress: number): MapPoint {
  const segs = FLIGHT_PATH.length - 1
  const clamped = Math.max(0, Math.min(0.999, progress))
  const idx = Math.floor(clamped * segs)
  const frac = clamped * segs - idx
  const a = FLIGHT_PATH[idx]
  const b = FLIGHT_PATH[idx + 1]
  return { x: a.x + (b.x - a.x) * frac, y: a.y + (b.y - a.y) * frac }
}
