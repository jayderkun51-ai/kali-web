interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

export function TerminalIcon({ size = 20, color = '#39ff14', className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="3" width="20" height="18" rx="2" stroke={color} strokeWidth="1.5" />
      <path d="M6 8l4 4-4 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="13" y1="16" x2="18" y2="16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ShieldIcon({ size = 20, color = '#a855f7', className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L4 6v6c0 5.25 3.75 10.15 8 11 4.25-.85 8-5.75 8-11V6l-8-4z" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.15" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MailIcon({ size = 20, color = '#a855f7', className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4" width="20" height="16" rx="2" stroke={color} strokeWidth="1.5" />
      <path d="M2 8l10 6 10-6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function UserIcon({ size = 20, color = '#a855f7', className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.5" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function LockIcon({ size = 20, color = '#a855f7', className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke={color} strokeWidth="1.5" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1.5" fill={color} />
    </svg>
  );
}

export function KeyIcon({ size = 20, color = '#39ff14', className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="12" r="4" stroke={color} strokeWidth="1.5" />
      <path d="M12 12h9M18 10v4M21 10v4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ChatIcon({ size = 20, color = '#a855f7', className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.1" strokeLinejoin="round" />
    </svg>
  );
}

export function PhotoIcon({ size = 20, color = '#a855f7', className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke={color} strokeWidth="1.5" />
      <circle cx="8.5" cy="8.5" r="1.5" fill={color} />
      <path d="M3 16l5-5 4 4 3-3 6 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CrownIcon({ size = 20, color = '#fbbf24', className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M3 19h18M5 19L3 7l5 4 4-6 4 6 5-4-2 12" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx="12" cy="5" r="1.5" fill={color} />
      <circle cx="3" cy="7" r="1" fill={color} />
      <circle cx="21" cy="7" r="1" fill={color} />
    </svg>
  );
}

export function StarIcon({ size = 20, color = '#fbbf24', className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.3" strokeLinejoin="round" />
    </svg>
  );
}

export function LogoutIcon({ size = 20, color = '#ef4444', className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <polyline points="16,17 21,12 16,7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="21" y1="12" x2="9" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function HomeIcon({ size = 20, color = '#a855f7', className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M3 12L12 3l9 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10v9a1 1 0 0 0 1 1h4v-5h4v5h4a1 1 0 0 0 1-1v-9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AdminIcon({ size = 20, color = '#f97316', className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L4 6v6c0 5.25 3.75 10.15 8 11 4.25-.85 8-5.75 8-11V6l-8-4z" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.1" strokeLinejoin="round" />
      <path d="M12 8v4M12 16h.01" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function BanIcon({ size = 20, color = '#ef4444', className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function SendIcon({ size = 20, color = '#a855f7', className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M22 2L11 13" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 2L15 22l-4-9-9-4 20-7z" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.15" strokeLinejoin="round" />
    </svg>
  );
}

export function UploadIcon({ size = 20, color = '#a855f7', className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <polyline points="17,8 12,3 7,8" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="3" x2="12" y2="15" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon({ size = 20, color = '#9ca3af', className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function WifiIcon({ size = 20, color = '#39ff14', className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12.55a11 11 0 0 1 14.08 0" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="20" r="1" fill={color} />
    </svg>
  );
}

export function AlertIcon({ size = 20, color = '#f97316', className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.1" strokeLinejoin="round" />
      <line x1="12" y1="9" x2="12" y2="13" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="17" r="0.5" fill={color} stroke={color} strokeWidth="1" />
    </svg>
  );
}

export function QRIcon({ size = 80, color = '#a855f7', className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* QR Code simulation */}
      <rect width="100" height="100" fill="#0d001a" rx="4" />
      {/* Top-left finder */}
      <rect x="8" y="8" width="26" height="26" rx="2" fill="none" stroke={color} strokeWidth="2" />
      <rect x="13" y="13" width="16" height="16" rx="1" fill={color} opacity="0.8" />
      {/* Top-right finder */}
      <rect x="66" y="8" width="26" height="26" rx="2" fill="none" stroke={color} strokeWidth="2" />
      <rect x="71" y="13" width="16" height="16" rx="1" fill={color} opacity="0.8" />
      {/* Bottom-left finder */}
      <rect x="8" y="66" width="26" height="26" rx="2" fill="none" stroke={color} strokeWidth="2" />
      <rect x="13" y="71" width="16" height="16" rx="1" fill={color} opacity="0.8" />
      {/* Data modules */}
      <rect x="44" y="8" width="6" height="6" fill={color} opacity="0.7" />
      <rect x="52" y="8" width="6" height="6" fill={color} opacity="0.5" />
      <rect x="44" y="16" width="6" height="6" fill={color} opacity="0.3" />
      <rect x="52" y="16" width="6" height="6" fill={color} opacity="0.7" />
      <rect x="8" y="44" width="6" height="6" fill={color} opacity="0.7" />
      <rect x="16" y="44" width="6" height="6" fill={color} opacity="0.4" />
      <rect x="8" y="52" width="6" height="6" fill={color} opacity="0.3" />
      <rect x="16" y="52" width="6" height="6" fill={color} opacity="0.6" />
      <rect x="44" y="44" width="6" height="6" fill={color} opacity="0.8" />
      <rect x="52" y="44" width="6" height="6" fill={color} opacity="0.5" />
      <rect x="60" y="44" width="6" height="6" fill={color} opacity="0.7" />
      <rect x="44" y="52" width="6" height="6" fill={color} opacity="0.4" />
      <rect x="52" y="52" width="6" height="6" fill={color} opacity="0.9" />
      <rect x="60" y="52" width="6" height="6" fill={color} opacity="0.3" />
      <rect x="44" y="60" width="6" height="6" fill={color} opacity="0.6" />
      <rect x="52" y="60" width="6" height="6" fill={color} opacity="0.8" />
      <rect x="60" y="60" width="6" height="6" fill={color} opacity="0.5" />
      <rect x="68" y="44" width="6" height="6" fill={color} opacity="0.7" />
      <rect x="76" y="44" width="6" height="6" fill={color} opacity="0.3" />
      <rect x="84" y="44" width="6" height="6" fill={color} opacity="0.6" />
      <rect x="68" y="52" width="6" height="6" fill={color} opacity="0.4" />
      <rect x="76" y="52" width="6" height="6" fill={color} opacity="0.8" />
      <rect x="44" y="68" width="6" height="6" fill={color} opacity="0.5" />
      <rect x="52" y="68" width="6" height="6" fill={color} opacity="0.7" />
      <rect x="60" y="68" width="6" height="6" fill={color} opacity="0.3" />
      <rect x="44" y="76" width="6" height="6" fill={color} opacity="0.8" />
      <rect x="52" y="76" width="6" height="6" fill={color} opacity="0.4" />
      <rect x="44" y="84" width="6" height="6" fill={color} opacity="0.6" />
      <rect x="52" y="84" width="6" height="6" fill={color} opacity="0.9" />
      <rect x="68" y="68" width="6" height="6" fill={color} opacity="0.7" />
      <rect x="76" y="68" width="6" height="6" fill={color} opacity="0.5" />
      <rect x="84" y="68" width="6" height="6" fill={color} opacity="0.3" />
      <rect x="68" y="76" width="6" height="6" fill={color} opacity="0.8" />
      <rect x="76" y="76" width="6" height="6" fill={color} opacity="0.6" />
      <rect x="84" y="76" width="6" height="6" fill={color} opacity="0.4" />
      <rect x="68" y="84" width="6" height="6" fill={color} opacity="0.5" />
      <rect x="76" y="84" width="6" height="6" fill={color} opacity="0.7" />
      <rect x="84" y="84" width="6" height="6" fill={color} opacity="0.9" />
    </svg>
  );
}

export function GlitchBarsIcon({ width = 200, height = 6, className = '' }: { width?: number; height?: number; className?: string }) {
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width={width * 0.3} height={height} fill="#a855f7" opacity="0.8" />
      <rect x={width * 0.32} y="0" width={width * 0.05} height={height} fill="#39ff14" opacity="0.6" />
      <rect x={width * 0.39} y="0" width={width * 0.25} height={height} fill="#d946ef" opacity="0.7" />
      <rect x={width * 0.66} y="0" width={width * 0.02} height={height} fill="#39ff14" opacity="0.5" />
      <rect x={width * 0.7} y="0" width={width * 0.3} height={height} fill="#a855f7" opacity="0.8" />
    </svg>
  );
}
