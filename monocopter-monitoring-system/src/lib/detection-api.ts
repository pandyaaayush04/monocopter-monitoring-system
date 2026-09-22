// Base URL of the detection-server (see /detection-server at the repo root).
// Override with VITE_DETECTION_API_URL in a .env file if it's not running
// on the same machine as the dashboard.
export const DETECTION_API_URL = import.meta.env.VITE_DETECTION_API_URL ?? "http://localhost:8000"

export const VIDEO_FEED_URL = `${DETECTION_API_URL}/video_feed`

export async function fetchHealth(): Promise<{ model_loaded: boolean; camera_open: boolean } | null> {
  try {
    const res = await fetch(`${DETECTION_API_URL}/health`)
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function fetchCurrentDetection<T>(): Promise<T | null> {
  try {
    const res = await fetch(`${DETECTION_API_URL}/api/detection/current`)
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function fetchDetectionHistory<T>(): Promise<T[] | null> {
  try {
    const res = await fetch(`${DETECTION_API_URL}/api/detection/history`)
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}
