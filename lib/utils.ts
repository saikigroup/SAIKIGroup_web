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
    hex: '#f43f5e',
    gradient: 'from-rose-500 to-orange-400',
    light: 'bg-rose-50',
  },
  imagery: {
    bg: 'bg-accent-imagery',
    text: 'text-accent-imagery',
    border: 'border-accent-imagery',
    hex: '#06b6d4',
    gradient: 'from-cyan-500 to-teal-400',
    light: 'bg-cyan-50',
  },
  technology: {
    bg: 'bg-accent-technology',
    text: 'text-accent-technology',
    border: 'border-accent-technology',
    hex: '#8b5cf6',
    gradient: 'from-violet-500 to-purple-400',
    light: 'bg-violet-50',
  },
} as const;

export type ServiceKey = keyof typeof serviceAccentColors;
