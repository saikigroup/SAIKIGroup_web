'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { type Locale, getLocalizedPath } from '@/lib/i18n';

interface BackToInsightsProps {
  label: string;
  locale: Locale;
}

export function BackToInsights({ label, locale }: BackToInsightsProps) {
  return (
    <Link
      href={getLocalizedPath('insights', locale)}
      className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-brand-teal transition-colors duration-200 [.bg-gradient-dark_&]:text-white/50 [.bg-gradient-dark_&]:hover:text-brand-teal-light"
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </Link>
  );
}
