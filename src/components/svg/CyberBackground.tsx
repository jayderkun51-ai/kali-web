export function CyberBackground() {
  return (
    <svg
      className="fixed inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      style={{ zIndex: 0 }}
    >
      <defs>
        <radialGradient id="bgGrad" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#1a0033" />
          <stop offset="60%" stopColor="#0d001a" />
          <stop offset="100%" stopColor="#000000" />
        </radialGradient>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#a855f7" strokeWidth="0.3" opacity="0.2" />
        </pattern>
        <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#7c3aed" strokeWidth="0.15" opacity="0.15" />
        </pattern>
        <filter id="bgGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Base background */}
      <rect width="100%" height="100%" fill="url(#bgGrad)" />

      {/* Grid patterns */}
      <rect width="100%" height="100%" fill="url(#smallGrid)" opacity="0.5" />
      <rect width="100%" height="100%" fill="url(#grid)" />

      {/* Ambient glows */}
      <ellipse cx="20%" cy="30%" rx="25%" ry="20%" fill="#7c3aed" opacity="0.06" filter="url(#softGlow)" />
      <ellipse cx="80%" cy="70%" rx="25%" ry="20%" fill="#a855f7" opacity="0.06" filter="url(#softGlow)" />
      <ellipse cx="50%" cy="50%" rx="30%" ry="15%" fill="#39ff14" opacity="0.02" filter="url(#softGlow)" />

      {/* Circuit traces - horizontal */}
      <line x1="0" y1="20%" x2="30%" y2="20%" stroke="#a855f7" strokeWidth="0.5" opacity="0.3" />
      <line x1="70%" y1="20%" x2="100%" y2="20%" stroke="#a855f7" strokeWidth="0.5" opacity="0.3" />
      <line x1="0" y1="80%" x2="25%" y2="80%" stroke="#39ff14" strokeWidth="0.5" opacity="0.2" />
      <line x1="75%" y1="80%" x2="100%" y2="80%" stroke="#39ff14" strokeWidth="0.5" opacity="0.2" />
      <line x1="10%" y1="50%" x2="35%" y2="50%" stroke="#d946ef" strokeWidth="0.3" opacity="0.15" />
      <line x1="65%" y1="50%" x2="90%" y2="50%" stroke="#d946ef" strokeWidth="0.3" opacity="0.15" />

      {/* Circuit traces - vertical */}
      <line x1="15%" y1="0" x2="15%" y2="40%" stroke="#7c3aed" strokeWidth="0.5" opacity="0.25" />
      <line x1="15%" y1="60%" x2="15%" y2="100%" stroke="#7c3aed" strokeWidth="0.5" opacity="0.25" />
      <line x1="85%" y1="0" x2="85%" y2="35%" stroke="#7c3aed" strokeWidth="0.5" opacity="0.25" />
      <line x1="85%" y1="65%" x2="85%" y2="100%" stroke="#7c3aed" strokeWidth="0.5" opacity="0.25" />

      {/* Circuit nodes */}
      <circle cx="15%" cy="20%" r="3" fill="none" stroke="#a855f7" strokeWidth="0.8" opacity="0.5" />
      <circle cx="85%" cy="20%" r="3" fill="none" stroke="#a855f7" strokeWidth="0.8" opacity="0.5" />
      <circle cx="15%" cy="80%" r="3" fill="none" stroke="#39ff14" strokeWidth="0.8" opacity="0.4" />
      <circle cx="85%" cy="80%" r="3" fill="none" stroke="#39ff14" strokeWidth="0.8" opacity="0.4" />
      <circle cx="15%" cy="20%" r="1" fill="#a855f7" opacity="0.6" />
      <circle cx="85%" cy="20%" r="1" fill="#a855f7" opacity="0.6" />
      <circle cx="15%" cy="80%" r="1" fill="#39ff14" opacity="0.5" />
      <circle cx="85%" cy="80%" r="1" fill="#39ff14" opacity="0.5" />

      {/* Corner decorations */}
      <g opacity="0.4">
        <path d="M 0 0 L 60 0 L 60 4 L 4 4 L 4 60 L 0 60 Z" fill="#a855f7" />
        <path d="M calc(100% - 0px) 0 L calc(100% - 60px) 0 L calc(100% - 60px) 4 L calc(100% - 4px) 4 L calc(100% - 4px) 60 L 100% 60 Z" fill="#a855f7" />
      </g>

      {/* Scan lines */}
      <rect width="100%" height="1" y="15%" fill="#39ff14" opacity="0.04" />
      <rect width="100%" height="1" y="35%" fill="#39ff14" opacity="0.03" />
      <rect width="100%" height="1" y="55%" fill="#39ff14" opacity="0.04" />
      <rect width="100%" height="1" y="75%" fill="#39ff14" opacity="0.03" />
      <rect width="100%" height="1" y="95%" fill="#39ff14" opacity="0.02" />

      {/* Floating data particles */}
      <g opacity="0.3" filter="url(#bgGlow)">
        <text x="5%" y="12%" fontFamily="monospace" fontSize="9" fill="#39ff14" opacity="0.5">01101011</text>
        <text x="80%" y="25%" fontFamily="monospace" fontSize="8" fill="#a855f7" opacity="0.4">0xDEAD</text>
        <text x="3%" y="65%" fontFamily="monospace" fontSize="8" fill="#39ff14" opacity="0.4">root@kali:~#</text>
        <text x="75%" y="88%" fontFamily="monospace" fontSize="9" fill="#a855f7" opacity="0.4">11001010</text>
        <text x="45%" y="5%" fontFamily="monospace" fontSize="8" fill="#d946ef" opacity="0.3">ENCRYPTED</text>
        <text x="60%" y="95%" fontFamily="monospace" fontSize="8" fill="#39ff14" opacity="0.3">SYS_OK</text>
      </g>
    </svg>
  );
}
