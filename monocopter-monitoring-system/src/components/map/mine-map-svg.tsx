import {
  BLOCKED_PATH,
  ENTRANCE,
  FLIGHT_PATH,
  HAZARD_ZONE,
  HUMAN_MARKER,
  WAYPOINTS,
  poseToSvg,
} from "@/data/mock-map"

function pathFromPoints(pts: { x: number; y: number }[]): string {
  return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")
}

export function MineMapSvg({ progress }: { progress: number }) {
  const travelledCount = Math.max(2, Math.floor(progress * FLIGHT_PATH.length))
  const travelled = FLIGHT_PATH.slice(0, travelledCount)
  const base = poseToSvg(progress)
  // nudge the marker slightly above the path so it sits clear of the line
  const copter = { x: base.x, y: base.y - 8 }

  return (
    <svg viewBox="0 0 400 300" className="h-auto w-full" role="img" aria-label="Mine tunnel map">
      <defs>
        <pattern id="hazard-hatch" width="8" height="8" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="var(--destructive)" opacity="0.12" />
          <line x1="0" y1="0" x2="0" y2="8" stroke="var(--destructive)" strokeWidth="2" opacity="0.6" />
        </pattern>
      </defs>

      <image href="/images/mine-map-b.png" x="0" y="0" width="400" height="300" preserveAspectRatio="xMidYMid slice" />
      <rect x="0" y="0" width="400" height="300" rx="12" fill="#000000" opacity="0.35" />

      {/* hazard zone */}
      <rect
        x={HAZARD_ZONE.x}
        y={HAZARD_ZONE.y}
        width={HAZARD_ZONE.w}
        height={HAZARD_ZONE.h}
        rx="6"
        fill="url(#hazard-hatch)"
        stroke="var(--destructive)"
        strokeDasharray="4 3"
        strokeWidth="1.5"
      />

      {/* flight path travelled */}
      <path d={pathFromPoints(travelled)} fill="none" stroke="var(--primary)" strokeWidth="2" strokeDasharray="6 4" />

      {/* entrance */}
      <g>
        <rect x={ENTRANCE.x - 8} y={ENTRANCE.y - 8} width="16" height="16" rx="4" fill="none" stroke="#22c55e" strokeWidth="2" />
        <circle cx={ENTRANCE.x} cy={ENTRANCE.y} r="3" fill="#22c55e" />
      </g>

      {/* waypoints */}
      {WAYPOINTS.map((w, i) => (
        <g key={w.id}>
          <circle cx={w.x} cy={w.y} r="9" fill="#0b0e14" stroke={w.visited ? "var(--primary)" : "#5b6478"} strokeWidth="2" />
          <text x={w.x} y={w.y + 3.5} textAnchor="middle" fontSize="8" fontWeight="700" fill={w.visited ? "var(--primary)" : "#9aa3b5"}>
            {i + 1}
          </text>
        </g>
      ))}

      {/* detected human */}
      <g>
        <circle cx={HUMAN_MARKER.x} cy={HUMAN_MARKER.y} r="10" fill="var(--destructive)" opacity="0.2">
          <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx={HUMAN_MARKER.x} cy={HUMAN_MARKER.y} r="5" fill="var(--destructive)" />
        <circle cx={HUMAN_MARKER.x} cy={HUMAN_MARKER.y - 7} r="2.5" fill="var(--destructive)" />
      </g>

      {/* blocked path */}
      <g>
        <line x1={BLOCKED_PATH.x - 7} y1={BLOCKED_PATH.y - 7} x2={BLOCKED_PATH.x + 7} y2={BLOCKED_PATH.y + 7} stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
        <line x1={BLOCKED_PATH.x + 7} y1={BLOCKED_PATH.y - 7} x2={BLOCKED_PATH.x - 7} y2={BLOCKED_PATH.y + 7} stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* monocopter */}
      <g transform={`translate(${copter.x} ${copter.y})`}>
        <circle r="11" fill="var(--primary)" opacity="0.25" />
        <path d="M 0 -8 L 6 6 L 0 3 L -6 6 Z" fill="var(--primary)" stroke="#fff" strokeWidth="1" />
      </g>
    </svg>
  )
}
