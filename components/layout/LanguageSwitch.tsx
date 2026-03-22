'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { switchLocale, type Locale } from '@/lib/i18n';
import { analytics } from '@/lib/analytics';

interface LanguageSwitchProps {
  locale: Locale;
  className?: string;
}

export function LanguageSwitch({ locale, className = '' }: LanguageSwitchProps) {
  const pathname = usePathname();

  return (
    <div
      className={`inline-flex items-center rounded-full bg-white/10 backdrop-blur-sm border border-border-subtle/30 ${className}`}
      role="group"
      aria-label="Language selector"
    >
      <Link
        href={locale === 'id' ? pathname : switchLocale(pathname, 'id')}
        onClick={() => locale !== 'id' && analytics.languageSwitch(locale, 'id')}
        className={`
          relative px-3.5 py-1.5 text-xs font-semibold tracking-wider rounded-full transition-all duration-300
          ${locale === 'id'
            ? 'bg-brand-teal text-white shadow-sm'
            : 'text-text-secondary hover:text-brand-teal'
          }
        `}
        aria-current={locale === 'id' ? 'true' : undefined}
        aria-label="Bahasa Indonesia"
      >
        ID
      </Link>
      <Link
        href={locale === 'en' ? pathname : switchLocale(pathname, 'en')}
        onClick={() => locale !== 'en' && analytics.languageSwitch(locale, 'en')}
        className={`
          relative px-3.5 py-1.5 text-xs font-semibold tracking-wider rounded-full transition-all duration-300
          ${locale === 'en'
            ? 'bg-brand-teal text-white shadow-sm'
            : 'text-text-secondary hover:text-brand-teal'
          }
        `}
        aria-current={locale === 'en' ? 'true' : undefined}
        aria-label="English"
      >
        EN
      </Link>
    </div>
  );
}
