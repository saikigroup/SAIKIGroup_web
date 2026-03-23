'use client';

import { Marquee } from '@/components/interactive/Marquee';

interface MarqueeBannerProps {
  items: string[];
  variant?: 'light' | 'dark' | 'gradient';
}

export function MarqueeBanner({ items, variant = 'light' }: MarqueeBannerProps) {
  const bgClass = {
    light: 'bg-surface-light',
    dark: 'bg-gradient-dark text-white',
    gradient: 'bg-gradient-teal text-white',
  }[variant];

  const textClass = {
    light: 'text-brand-black/20 text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black',
    dark: 'text-white/10 text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black',
    gradient: 'text-white/20 text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black',
  }[variant];

  return (
    <div className={`py-6 md:py-8 overflow-hidden ${bgClass}`}>
      <Marquee
        items={items}
        speed={25}
        separator="  &#x2022;  "
        textClassName={`heading-display uppercase tracking-tight ${textClass}`}
      />
    </div>
  );
}
