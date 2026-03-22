import { type ClassValue, clsx } from 'clsx';

// Simple clsx implementation (no dependency needed)
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

// Service accent color mapping
export const serviceAccentColors = {
  consultancy: {
    bg: 'bg-accent-consultancy',
    text: 'text-accent-consultancy',
    border: 'border-accent-consultancy',
    hex: '#660e36',
  },
  imagery: {
    bg: 'bg-accent-imagery',
    text: 'text-accent-imagery',
    border: 'border-accent-imagery',
    hex: '#117a8c',
  },
  technology: {
    bg: 'bg-accent-technology',
    text: 'text-accent-technology',
    border: 'border-accent-technology',
    hex: '#1a3a5c',
  },
} as const;

export type ServiceKey = keyof typeof serviceAccentColors;
