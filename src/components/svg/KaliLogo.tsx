interface KaliLogoProps {
  size?: number;
  animated?: boolean;
}

export function KaliLogo({ size = 120, animated = true }: KaliLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      style={animated ? { filter: 'drop-shadow(0 0 12px #a855f7)' } : {}}
    >
      <defs>
        <radialGradient id="logoBg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a0033" />
          <stop offset="70%" stopColor="#0d0020" />
          <stop offset="100%" stopColor="#050010" />
        </radialGradient>
        <linearGradient id="logoKali" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d946ef" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="logoWeb" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#39ff14" />
          <stop offset="100%" stopColor="#00ff88" />
        </linearGradient>
        <filter id="logoGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="greenGlow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <clipPath id="hexClip">
          <path d="M60 5 L110 32.5 L110 87.5 L60 115 L10 87.5 L10 32.5 Z" />
        </clipPath>
      </defs>

      {/* Outer hex border */}
      <path
        d="M60 3 L112 31.5 L112 88.5 L60 117 L8 88.5 L8 31.5 Z"
        fill="none"
        stroke="url(#logoKali)"
        strokeWidth="1.5"
        opacity="0.8"
      />
      {/* Inner hex border */}
      <path
        d="M60 10 L106 34 L106 86 L60 110 L14 86 L14 34 Z"
        fill="url(#logoBg)"
        stroke="#a855f7"
        strokeWidth="0.5"
        opacity="0.5"
      />

      {/* Hex fill */}
      <path d="M60 10 L106 34 L106 86 L60 110 L14 86 L14 34 Z" fill="url(#logoBg)" />

      {/* Circuit lines */}
      <line x1="14" y1="60" x2="35" y2="60" stroke="#a855f7" strokeWidth="0.5" opacity="0.4" />
      <line x1="85" y1="60" x2="106" y2="60" stroke="#a855f7" strokeWidth="0.5" opacity="0.4" />
      <line x1="60" y1="10" x2="60" y2="30" stroke="#39ff14" strokeWidth="0.5" opacity="0.4" />
      <line x1="60" y1="90" x2="60" y2="110" stroke="#39ff14" strokeWidth="0.5" opacity="0.4" />

      {/* Corner dots */}
      <circle cx="35" cy="60" r="2" fill="#a855f7" opacity="0.6" />
      <circle cx="85" cy="60" r="2" fill="#a855f7" opacity="0.6" />
      <circle cx="60" cy="30" r="2" fill="#39ff14" opacity="0.6" />
      <circle cx="60" cy="90" r="2" fill="#39ff14" opacity="0.6" />

      {/* K letter */}
      <g filter="url(#logoGlow)">
        <text
          x="28"
          y="52"
          fontFamily="'Courier New', monospace"
          fontWeight="900"
          fontSize="26"
          fill="url(#logoKali)"
          letterSpacing="-1"
        >
          KA
        </text>
        <text
          x="28"
          y="78"
          fontFamily="'Courier New', monospace"
          fontWeight="900"
          fontSize="26"
          fill="url(#logoKali)"
          letterSpacing="-1"
        >
          LI
        </text>
      </g>

      {/* WEB text */}
      <g filter="url(#greenGlow)">
        <text
          x="60"
          y="96"
          fontFamily="'Courier New', monospace"
          fontWeight="700"
          fontSize="11"
          fill="url(#logoWeb)"
          textAnchor="middle"
          letterSpacing="3"
        >
          WEB
        </text>
      </g>

      {/* Scan line */}
      <rect x="14" y="68" width="92" height="0.8" fill="#39ff14" opacity="0.15" />

      {/* Corner accents */}
      <path d="M14 34 L22 34 L22 42" fill="none" stroke="#d946ef" strokeWidth="1" opacity="0.5" />
      <path d="M106 34 L98 34 L98 42" fill="none" stroke="#d946ef" strokeWidth="1" opacity="0.5" />
      <path d="M14 86 L22 86 L22 78" fill="none" stroke="#d946ef" strokeWidth="1" opacity="0.5" />
      <path d="M106 86 L98 86 L98 78" fill="none" stroke="#d946ef" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}
