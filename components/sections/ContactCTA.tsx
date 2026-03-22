'use client';

import { FadeIn } from '@/components/motion';
import { CTAButton, Eyebrow } from '@/components/shared';
import { getLocalizedPath, type Locale } from '@/lib/i18n';

interface ContactCTAProps {
  eyebrow: string;
  headline: string;
  body: string;
  cta: string;
  locale: Locale;
}

export function ContactCTA({ eyebrow, headline, body, cta, locale }: ContactCTAProps) {
  return (
    <section className="py-20 md:py-32 bg-brand-teal text-white">
      <div className="container-editorial text-center max-w-3xl mx-auto">
        <FadeIn>
          <Eyebrow color="text-white/60">{eyebrow}</Eyebrow>
          <h2 className="heading-editorial text-4xl md:text-5xl lg:text-6xl text-white mt-4">
            {headline}
          </h2>
          <p className="text-lg md:text-xl text-white/80 leading-relaxed mt-6 mb-10">
            {body}
          </p>
          <CTAButton
            href={getLocalizedPath('contact', locale)}
            variant="secondary"
            className="border-white text-white hover:bg-white hover:text-brand-teal"
          >
            {cta}
          </CTAButton>
        </FadeIn>
      </div>
    </section>
  );
}
