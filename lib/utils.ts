import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

// Service accent color mapping
export const serviceAccentColors = {
  consultancy: {
    bg: 'bg-accent-consultancy',
    text: 'text-accent-consultancy',
    border: 'border-accent-consultancy',
    hex: '#c30b66',
    hexSecondary: '#6b0538',
    gradient: 'from-[#c30b66] to-[#e8447a]',
    light: 'bg-pink-50',
    logo: '/images/services/logo-consultancy-icon-01.svg',
    logoFull: '/images/services/logo-consultancy-full.svg',
  },
  imagery: {
    bg: 'bg-accent-imagery',
    text: 'text-accent-imagery',
    border: 'border-accent-imagery',
    hex: '#137b8c',
    hexSecondary: '#0a4a54',
    gradient: 'from-[#137b8c] to-[#1a9eb3]',
    light: 'bg-teal-50',
    logo: '/images/services/logo-imagery-icon-01.svg',
    logoFull: '/images/services/logo-imagery-full-01.svg',
  },
  technology: {
    bg: 'bg-accent-technology',
    text: 'text-accent-technology',
    border: 'border-accent-technology',
    hex: '#660e36',
    hexSecondary: '#3a0820',
    gradient: 'from-[#660e36] to-[#8a1248]',
    light: 'bg-rose-50',
    logo: '/images/services/logo-technology-icon-01.svg',
    logoFull: '/images/services/logo-technology-full-01.svg',
  },
} as const;

export type ServiceKey = keyof typeof serviceAccentColors;
