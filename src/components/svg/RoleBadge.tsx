import { UserRole } from '../../lib/supabase';

interface RoleBadgeProps {
  role: UserRole;
  size?: 'sm' | 'md' | 'lg';
}

const roleConfig = {
  super_pobre: {
    label: 'Super Pobre',
    color: '#6b7280',
    bgColor: '#1f2937',
    borderColor: '#374151',
    icon: '💀',
    glow: 'none',
  },
  compi_pro: {
    label: 'Compi Pro',
    color: '#fbbf24',
    bgColor: '#1c1500',
    borderColor: '#92400e',
    icon: '⭐',
    glow: '0 0 8px #fbbf24',
  },
  dios_admin: {
    label: 'Dios Admin',
    color: '#d946ef',
    bgColor: '#1a0033',
    borderColor: '#a855f7',
    icon: '👑',
    glow: '0 0 12px #d946ef',
  },
};

const sizeConfig = {
  sm: { fontSize: 9, padding: '2px 6px', iconSize: '10px', gap: 3 },
  md: { fontSize: 11, padding: '3px 8px', iconSize: '12px', gap: 4 },
  lg: { fontSize: 13, padding: '4px 12px', iconSize: '14px', gap: 5 },
};

export function RoleBadge({ role, size = 'sm' }: RoleBadgeProps) {
  const cfg = roleConfig[role];
  const sz = sizeConfig[size];

  return (
    <svg
      width={size === 'sm' ? 90 : size === 'md' ? 110 : 130}
      height={size === 'sm' ? 18 : size === 'md' ? 22 : 26}
      viewBox={`0 0 ${size === 'sm' ? 90 : size === 'md' ? 110 : 130} ${size === 'sm' ? 18 : size === 'md' ? 22 : 26}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <defs>
        <filter id={`badge-glow-${role}`}>
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect
        x="1" y="1"
        width={size === 'sm' ? 88 : size === 'md' ? 108 : 128}
        height={size === 'sm' ? 16 : size === 'md' ? 20 : 24}
        rx="3"
        fill={cfg.bgColor}
        stroke={cfg.borderColor}
        strokeWidth="0.8"
        filter={cfg.glow !== 'none' ? `url(#badge-glow-${role})` : undefined}
      />
      <text
        x={size === 'sm' ? 44 : size === 'md' ? 54 : 64}
        y={size === 'sm' ? 12 : size === 'md' ? 15 : 17}
        fontFamily="'Courier New', monospace"
        fontSize={sz.fontSize}
        fontWeight="700"
        fill={cfg.color}
        textAnchor="middle"
        letterSpacing="0.5"
      >
        [{cfg.label}]
      </text>
    </svg>
  );
}

export function RoleBadgeInline({ role }: { role: UserRole }) {
  const cfg = roleConfig[role];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '3px',
        background: cfg.bgColor,
        border: `1px solid ${cfg.borderColor}`,
        borderRadius: '3px',
        padding: '1px 6px',
        fontSize: '10px',
        fontFamily: "'Courier New', monospace",
        fontWeight: 700,
        color: cfg.color,
        boxShadow: cfg.glow !== 'none' ? cfg.glow : undefined,
        letterSpacing: '0.3px',
        whiteSpace: 'nowrap',
      }}
    >
      {cfg.icon} {cfg.label}
    </span>
  );
}
