export type DetectionEvent = {
  id: string
  time: string
  label: "Person Detected" | "No Person"
  confidence: number | null
  sector: string
}

export type BoundingBox = {
  x: number // percent of frame width, left edge
  y: number // percent of frame height, top edge
  w: number
  h: number
}
