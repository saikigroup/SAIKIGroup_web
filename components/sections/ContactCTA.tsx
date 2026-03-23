'use client';

import { FadeIn } from '@/components/motion';
import { CTAButton, Eyebrow } from '@/components/shared';
import { IconRocket } from '@/components/shared/Icons';
import { MagneticButton } from '@/components/interactive/MagneticButton';
import { CursorGlow } from '@/components/interactive/CursorGlow';
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
    <CursorGlow className="py-20 md:py-32 relative" color="rgba(255, 255, 255, 0.08)" size={500}>
      {/* Gradient bg */}
      <div className="absolute inset-0 bg-gradient-teal" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-violet/20 rounded-full blur-3xl" />

      <div className="container-editorial text-center max-w-3xl mx-auto relative">
        <FadeIn>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-6">
            <IconRocket size={32} className="text-white" />
          </div>
          <Eyebrow color="text-white/60">{eyebrow}</Eyebrow>
          <h2 className="heading-display text-4xl md:text-5xl lg:text-6xl text-white mt-4">
            {headline}
          </h2>
          <p className="text-lg md:text-xl text-white/80 leading-relaxed mt-6 mb-10">
            {body}
          </p>
          <MagneticButton strength={0.25}>
            <CTAButton
              href={getLocalizedPath('contact', locale)}
              variant="secondary"
              className="bg-white border-white text-brand-teal hover:brightness-95"
            >
              {cta}
            </CTAButton>
          </MagneticButton>
        </FadeIn>
      </div>
    </CursorGlow>
  );
}
