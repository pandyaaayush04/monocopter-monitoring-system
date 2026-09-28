/**
 * MINEWATCH brand mark: twin mountain peaks forming an "M" in amber,
 * per the reference identity. Static brand asset with literal color
 * stops (same rationale as public/favicon.svg, which shares this shape).
 */
export function MinewatchMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="mw-peak-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBD9A8" />
          <stop offset="100%" stopColor="#E8932E" />
        </linearGradient>
        <linearGradient id="mw-peak-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F5A524" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
      </defs>

      {/* back peak */}
      <polygon points="13,26 23,6 31,26" fill="url(#mw-peak-back)" />
      {/* front peak */}
      <polygon points="2,26 12,9 22,26" fill="url(#mw-peak-front)" />
      {/* snow notch on the front peak */}
      <polygon points="12,9 15.2,15 12,13.4 8.8,15" fill="#FFF7E8" opacity="0.9" />
    </svg>
  )
}
