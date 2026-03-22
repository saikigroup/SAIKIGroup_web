interface IconProps {
  className?: string;
  size?: number;
}

export function IconConsultancy({ className = '', size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <circle cx="24" cy="14" r="8" fill="currentColor" opacity="0.2" />
      <circle cx="24" cy="14" r="5" fill="currentColor" />
      <path d="M12 38c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M30 28l6-4 4 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function IconImagery({ className = '', size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <rect x="6" y="10" width="36" height="28" rx="4" fill="currentColor" opacity="0.15" />
      <rect x="6" y="10" width="36" height="28" rx="4" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <circle cx="17" cy="21" r="4" fill="currentColor" />
      <path d="M6 34l10-10 8 8 6-6 12 12H10a4 4 0 01-4-4v0z" fill="currentColor" opacity="0.3" />
      <path d="M6 32l10-8 8 8 6-6 12 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function IconTechnology({ className = '', size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <rect x="4" y="8" width="40" height="26" rx="4" fill="currentColor" opacity="0.15" />
      <rect x="4" y="8" width="40" height="26" rx="4" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <path d="M18 38h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M24 34v4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M18 17l-4 4 4 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M30 17l4 4-4 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M26 15l-4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function IconRocket({ className = '', size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <path d="M24 4c0 0-16 8-16 28h32C40 12 24 4 24 4z" fill="currentColor" opacity="0.15" />
      <path d="M24 4c0 0-16 8-16 28h32C40 12 24 4 24 4z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="24" cy="22" r="4" fill="currentColor" />
      <path d="M16 36l-4 8 8-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M32 36l4 8-8-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function IconTarget({ className = '', size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <circle cx="24" cy="24" r="18" fill="currentColor" opacity="0.1" />
      <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <circle cx="24" cy="24" r="12" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5" />
      <circle cx="24" cy="24" r="6" fill="currentColor" opacity="0.3" />
      <circle cx="24" cy="24" r="3" fill="currentColor" />
    </svg>
  );
}

export function IconEcosystem({ className = '', size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <circle cx="24" cy="12" r="7" fill="currentColor" opacity="0.2" />
      <circle cx="12" cy="34" r="7" fill="currentColor" opacity="0.2" />
      <circle cx="36" cy="34" r="7" fill="currentColor" opacity="0.2" />
      <circle cx="24" cy="12" r="5" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <circle cx="12" cy="34" r="5" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <circle cx="36" cy="34" r="5" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <path d="M20 16l-5 14M28 16l5 14M16 34h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

export function IconBolt({ className = '', size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <path d="M26 4L10 28h12l-2 16L38 20H26l2-16z" fill="currentColor" opacity="0.15" />
      <path d="M26 4L10 28h12l-2 16L38 20H26l2-16z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function IconSparkle({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" fill="currentColor" />
    </svg>
  );
}

export function IconCheck({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" />
      <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
