import { useEffect, useState } from "react"
import { seedPose, walkPose, type MonocopterPose } from "@/data/mock-map"

const TICK_MS = 2000

/**
 * ponytail: SLAM-estimated position feed, ticking on an interval. Sourced
 * from the inertial/SLAM pose stream — the MonocopterPose shape
 * (mine-local x/y/z metres, NOT GPS) is what the map consumes. GPS does
 * not work underground so no GPS fields are modelled.
 */
export function useMockMapFeed() {
  const [pose, setPose] = useState<MonocopterPose>(() => seedPose())
  const [progress, setProgress] = useState(0.55)

  useEffect(() => {
    const id = setInterval(() => {
      setPose((p) => walkPose(p))
      setProgress((p) => (p >= 0.97 ? 0.05 : p + 0.015))
    }, TICK_MS)
    return () => clearInterval(id)
  }, [])

  return { pose, progress }
}
