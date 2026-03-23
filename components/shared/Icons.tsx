interface IconProps {
  className?: string;
  size?: number;
}

export function IconConsultancy({ className = '', size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <defs>
        <linearGradient id="ic-consult-1" x1="12" y1="8" x2="36" y2="40">
          <stop offset="0%" stopColor="#c30b66" />
          <stop offset="100%" stopColor="#e8447a" />
        </linearGradient>
        <linearGradient id="ic-consult-2" x1="24" y1="4" x2="24" y2="44">
          <stop offset="0%" stopColor="#305051" />
          <stop offset="100%" stopColor="#3d6566" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="14" r="8" fill="url(#ic-consult-1)" opacity="0.18" />
      <circle cx="24" cy="14" r="5" fill="url(#ic-consult-1)" />
      <path d="M12 38c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="url(#ic-consult-2)" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M30 28l6-4 4 6" stroke="url(#ic-consult-1)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function IconImagery({ className = '', size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <defs>
        <linearGradient id="ic-imagery-1" x1="6" y1="10" x2="42" y2="38">
          <stop offset="0%" stopColor="#137b8c" />
          <stop offset="100%" stopColor="#1a9eb3" />
        </linearGradient>
        <linearGradient id="ic-imagery-2" x1="6" y1="28" x2="42" y2="38">
          <stop offset="0%" stopColor="#305051" />
          <stop offset="100%" stopColor="#137b8c" />
        </linearGradient>
      </defs>
      <rect x="6" y="10" width="36" height="28" rx="4" fill="url(#ic-imagery-1)" opacity="0.12" />
      <rect x="6" y="10" width="36" height="28" rx="4" stroke="url(#ic-imagery-1)" strokeWidth="2.5" fill="none" />
      <circle cx="17" cy="21" r="4" fill="#1a9eb3" />
      <path d="M6 34l10-10 8 8 6-6 12 12H10a4 4 0 01-4-4v0z" fill="url(#ic-imagery-2)" opacity="0.25" />
      <path d="M6 32l10-8 8 8 6-6 12 8" stroke="url(#ic-imagery-2)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function IconTechnology({ className = '', size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <defs>
        <linearGradient id="ic-tech-1" x1="4" y1="8" x2="44" y2="38">
          <stop offset="0%" stopColor="#660e36" />
          <stop offset="100%" stopColor="#8a1248" />
        </linearGradient>
        <linearGradient id="ic-tech-2" x1="14" y1="17" x2="34" y2="25">
          <stop offset="0%" stopColor="#305051" />
          <stop offset="100%" stopColor="#660e36" />
        </linearGradient>
      </defs>
      <rect x="4" y="8" width="40" height="26" rx="4" fill="url(#ic-tech-1)" opacity="0.12" />
      <rect x="4" y="8" width="40" height="26" rx="4" stroke="url(#ic-tech-1)" strokeWidth="2.5" fill="none" />
      <path d="M18 38h12" stroke="#305051" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M24 34v4" stroke="#305051" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M18 17l-4 4 4 4" stroke="url(#ic-tech-2)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M30 17l4 4-4 4" stroke="url(#ic-tech-2)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M26 15l-4 12" stroke="url(#ic-tech-1)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function IconRocket({ className = '', size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <defs>
        <linearGradient id="ic-rocket-1" x1="16" y1="4" x2="32" y2="44">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#f43f5e" />
        </linearGradient>
      </defs>
      <path d="M24 4c0 0-16 8-16 28h32C40 12 24 4 24 4z" fill="url(#ic-rocket-1)" opacity="0.15" />
      <path d="M24 4c0 0-16 8-16 28h32C40 12 24 4 24 4z" stroke="url(#ic-rocket-1)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="24" cy="22" r="4" fill="#f97316" />
      <path d="M16 36l-4 8 8-4" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M32 36l4 8-8-4" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function IconTarget({ className = '', size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <defs>
        <linearGradient id="ic-target-1" x1="6" y1="6" x2="42" y2="42">
          <stop offset="0%" stopColor="#0d9488" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="18" fill="url(#ic-target-1)" opacity="0.1" />
      <circle cx="24" cy="24" r="18" stroke="url(#ic-target-1)" strokeWidth="2.5" fill="none" />
      <circle cx="24" cy="24" r="12" stroke="#0d9488" strokeWidth="2" fill="none" opacity="0.4" />
      <circle cx="24" cy="24" r="6" fill="url(#ic-target-1)" opacity="0.25" />
      <circle cx="24" cy="24" r="3" fill="#0d9488" />
    </svg>
  );
}

export function IconEcosystem({ className = '', size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <defs>
        <linearGradient id="ic-eco-1" x1="12" y1="8" x2="36" y2="40">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="12" r="7" fill="url(#ic-eco-1)" opacity="0.18" />
      <circle cx="12" cy="34" r="7" fill="url(#ic-eco-1)" opacity="0.18" />
      <circle cx="36" cy="34" r="7" fill="url(#ic-eco-1)" opacity="0.18" />
      <circle cx="24" cy="12" r="5" stroke="#8b5cf6" strokeWidth="2.5" fill="none" />
      <circle cx="12" cy="34" r="5" stroke="#7c3aed" strokeWidth="2.5" fill="none" />
      <circle cx="36" cy="34" r="5" stroke="#a78bfa" strokeWidth="2.5" fill="none" />
      <path d="M20 16l-5 14M28 16l5 14M16 34h16" stroke="url(#ic-eco-1)" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

export function IconBolt({ className = '', size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <defs>
        <linearGradient id="ic-bolt-1" x1="14" y1="4" x2="34" y2="44">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#eab308" />
        </linearGradient>
      </defs>
      <path d="M26 4L10 28h12l-2 16L38 20H26l2-16z" fill="url(#ic-bolt-1)" opacity="0.15" />
      <path d="M26 4L10 28h12l-2 16L38 20H26l2-16z" stroke="url(#ic-bolt-1)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function IconSparkle({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <defs>
        <linearGradient id="ic-sparkle-1" x1="2" y1="2" x2="22" y2="22">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#f43f5e" />
        </linearGradient>
      </defs>
      <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" fill="url(#ic-sparkle-1)" />
    </svg>
  );
}

export function IconCheck({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.12" />
      <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
