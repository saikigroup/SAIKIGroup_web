'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FadeIn } from '@/components/motion';
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup';
import { SectionHeading, JournalCard, CTAButton } from '@/components/shared';
import { getLocalizedPath, type Locale } from '@/lib/i18n';
import { getInsights } from '@/lib/content';

interface JournalPreviewProps {
  eyebrow: string;
  headline: string;
  viewAll: string;
  locale: Locale;
}

export function JournalPreview({ eyebrow, headline, viewAll, locale }: JournalPreviewProps) {
  const { articles } = getInsights(locale);

  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="container-editorial">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <FadeIn>
            <SectionHeading eyebrow={eyebrow} headline={headline} size="xl" />
          </FadeIn>
          <FadeIn delay={0.2}>
            <CTAButton
              href={getLocalizedPath('insights', locale)}
              variant="ghost"
              size="sm"
            >
              {viewAll}
            </CTAButton>
          </FadeIn>
        </div>

        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <StaggerItem key={article.slug}>
              <JournalCard
                {...article}
                locale={locale}
              />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
