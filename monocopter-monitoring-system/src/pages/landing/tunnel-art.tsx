/**
 * Product-true illustration set: mine tunnel panels drawn in SVG (rock via
 * turbulence texture, headlamp glow in ember orange). Used where the
 * reference shows photography — no stock, no fake screenshots.
 */
export function TunnelArt({
  variant = "deep",
  className,
  label,
}: {
  variant?: "deep" | "rubble" | "figure" | "dim"
  className?: string
  label: string
}) {
  const gid = `t-${variant}`
  return (
    <svg viewBox="0 0 400 240" className={className} role="img" aria-label={label}>
      <defs>
        <radialGradient id={`${gid}-glow`} cx="50%" cy="42%" r="55%">
          <stop offset="0%" stopColor="#F5A524" stopOpacity="0.85" />
          <stop offset="35%" stopColor="#B45309" stopOpacity="0.35" />
          <stop offset="70%" stopColor="#1C0F08" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${gid}-wall`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2A1A10" />
          <stop offset="55%" stopColor="#160D08" />
          <stop offset="100%" stopColor="#0B0605" />
        </linearGradient>
        <filter id={`${gid}-rock`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.22  0 0 0 0 0.14  0 0 0 0.55 0" />
          <feComposite operator="over" in2="SourceGraphic" />
        </filter>
      </defs>

      <rect width="400" height="240" fill="#0B0605" />
      {/* tunnel bore */}
      <ellipse cx="200" cy="150" rx="150" ry="118" fill={`url(#${gid}-wall)`} filter={`url(#${gid}-rock)`} />
      <ellipse cx="200" cy="155" rx="92" ry="80" fill="#050302" />
      {/* depth glow */}
      <ellipse cx="200" cy="150" rx="60" ry="52" fill="#F5A524" opacity="0.28" />
      <ellipse cx="200" cy="150" rx="30" ry="26" fill="#FBD9A8" opacity="0.5" />
      {/* headlamp wash */}
      <rect width="400" height="240" fill={`url(#${gid}-glow)`} />

      {variant === "rubble" && (
        <g fill="#241509" filter={`url(#${gid}-rock)`}>
          <polygon points="120,240 170,190 220,240" />
          <polygon points="200,240 260,175 320,240" />
          <polygon points="60,240 110,200 160,240" />
          <ellipse cx="265" cy="182" rx="10" ry="7" fill="#3A2412" />
          <ellipse cx="175" cy="198" rx="8" ry="6" fill="#3A2412" />
        </g>
      )}

      {variant === "figure" && (
        <g>
          <ellipse cx="200" cy="222" rx="26" ry="5" fill="#000" opacity="0.6" />
          {/* seated worker with headlamp */}
          <circle cx="200" cy="172" r="9" fill="#4A2E18" />
          <rect x="186" y="182" width="28" height="30" rx="9" fill="#5A3A22" />
          <rect x="182" y="206" width="12" height="20" rx="6" fill="#3A2412" />
          <rect x="206" y="206" width="12" height="20" rx="6" fill="#3A2412" />
          <circle cx="200" cy="170" r="3" fill="#FBD9A8" />
          <line x1="200" y1="173" x2="200" y2="150" stroke="#FBD9A8" strokeWidth="1.5" opacity="0.7" />
          <circle cx="214" cy="168" r="7" fill="none" stroke="#F5A524" strokeWidth="2" />
          <rect x="207" y="161" width="14" height="14" rx="3" fill="none" stroke="#F5A524" strokeWidth="1.5" strokeDasharray="3 2" />
        </g>
      )}

      {variant === "dim" && (
        <rect width="400" height="240" fill="#050302" opacity="0.55" />
      )}

      {/* floor reflection */}
      <ellipse cx="200" cy="232" rx="120" ry="10" fill="#F5A524" opacity="0.12" />
    </svg>
  )
}

/** Single-wing monocopter line illustration (product-true, not a quadcopter). */
export function MonocopterArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 420 220" className={className} role="img" aria-label="Monocopter aircraft">
      <defs>
        <radialGradient id="mc-glow" cx="50%" cy="78%" r="45%">
          <stop offset="0%" stopColor="#F5A524" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#F5A524" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="mc-wing2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3A2412" />
          <stop offset="50%" stopColor="#7A4A1E" />
          <stop offset="100%" stopColor="#3A2412" />
        </linearGradient>
      </defs>
      <rect width="420" height="220" fill="#0B0605" />
      <rect width="420" height="220" fill="url(#mc-glow)" />
      {/* rotor disc */}
      <ellipse cx="210" cy="92" rx="150" ry="20" fill="none" stroke="#8A6A4A" strokeWidth="3" opacity="0.9" />
      <ellipse cx="210" cy="92" rx="150" ry="20" fill="none" stroke="#F5A524" strokeWidth="1" opacity="0.35" />
      {/* wing */}
      <path d="M70 92 C140 70 280 70 350 92 C280 112 140 114 70 92 Z" fill="url(#mc-wing2)" />
      {/* body pod */}
      <rect x="196" y="86" width="28" height="52" rx="14" fill="#1C0F08" stroke="#8A6A4A" strokeWidth="2" />
      <circle cx="210" cy="102" r="6" fill="#F5A524" />
      {/* sensor beam */}
      <polygon points="204,138 216,138 228,196 192,196" fill="#F5A524" opacity="0.25" />
      <ellipse cx="210" cy="196" rx="26" ry="6" fill="#F5A524" opacity="0.35" />
      {/* counterweight */}
      <rect x="120" y="86" width="20" height="12" rx="6" fill="#3A2412" stroke="#8A6A4A" />
    </svg>
  )
}
