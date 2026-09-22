/**
 * Brand mark: a shaded, dimensional single-wing monocopter emblem.
 * Deliberately not a flat silhouette — gradients + a soft drop shadow
 * give it a rendered-icon feel. Uses literal color stops (not design
 * tokens) since it's a static brand asset, same rationale as
 * public/favicon.svg, which shares this shape at a simplified scale.
 */
export function MonocopterMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="mc-wing" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FBD9BE" />
        </linearGradient>
        <linearGradient id="mc-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F8C9A3" />
        </linearGradient>
        <filter id="mc-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0.7" stdDeviation="0.6" floodColor="#7A2A00" floodOpacity="0.35" />
        </filter>
      </defs>

      <g transform="rotate(-20 16 16)" filter="url(#mc-shadow)">
        {/* motion trace */}
        <path
          d="M 25.2 8.6 A 11.6 11.6 0 0 1 27.3 17.8"
          stroke="#FFFFFF"
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity="0.4"
        />

        {/* counterweight nub */}
        <rect x="8.6" y="14.7" width="3.6" height="2.6" rx="1.3" fill="url(#mc-body)" />

        {/* single wing, tapered aerofoil */}
        <path
          d="M15 15.1 C19.5 12.9 24.5 13.6 27.6 16 C24.5 18.4 19.5 19.1 15 16.9 Z"
          fill="url(#mc-wing)"
        />
        {/* leading-edge glint */}
        <path
          d="M16.2 14.7 C20 13 24 13.5 26.7 15.5"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="0.6"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* body / motor pod */}
        <rect x="12.2" y="12.6" width="4.6" height="6.8" rx="2.3" fill="url(#mc-body)" />
        {/* canopy glint */}
        <ellipse cx="13.6" cy="14.3" rx="0.9" ry="1.4" fill="#FFFFFF" opacity="0.9" />
      </g>
    </svg>
  )
}
