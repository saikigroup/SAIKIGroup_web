'use client';

import { FadeIn } from '@/components/motion';
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup';
import { Eyebrow, CTAButton } from '@/components/shared';
import { getLocalizedPath, type Locale } from '@/lib/i18n';
import type { ServiceKey } from '@/lib/utils';
import { serviceAccentColors } from '@/lib/utils';

interface ScopeItem {
  title: string;
  description: string;
}

interface ServicePageTemplateProps {
  serviceKey: ServiceKey;
  hero: { eyebrow: string; headline: string; body: string };
  scope: { eyebrow: string; headline: string; items: ScopeItem[] };
  approach: { eyebrow: string; headline: string; body: string };
  useCases: { eyebrow: string; headline: string; items: string[] };
  cta: { headline: string; body: string; button: string };
  locale: Locale;
}

export function ServicePageTemplate({
  serviceKey,
  hero,
  scope,
  approach,
  useCases,
  cta,
  locale,
}: ServicePageTemplateProps) {
  const colors = serviceAccentColors[serviceKey];

  return (
    <>
      {/* Hero */}
      <section className="py-20 md:py-32 bg-surface-cream">
        <div className="container-editorial">
          <div className="max-w-3xl">
            <FadeIn>
              <Eyebrow color={colors.text}>{hero.eyebrow}</Eyebrow>
              <h1 className="heading-editorial text-5xl md:text-6xl lg:text-7xl text-brand-black mt-4 whitespace-pre-line">
                {hero.headline}
              </h1>
              <div
                className="w-20 h-0.5 mt-8"
                style={{ backgroundColor: colors.hex }}
              />
              <p className="text-lg md:text-xl text-text-secondary leading-relaxed mt-8">
                {hero.body}
              </p>
              <div className="mt-10">
                <CTAButton href={getLocalizedPath('contact', locale)}>
                  {cta.button}
                </CTAButton>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Scope */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container-editorial">
          <FadeIn>
            <Eyebrow color={colors.text}>{scope.eyebrow}</Eyebrow>
            <h2 className="heading-editorial text-4xl md:text-5xl text-brand-black mt-4">
              {scope.headline}
            </h2>
          </FadeIn>

          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-14">
            {scope.items.map((item, i) => (
              <StaggerItem key={i}>
                <div
                  className="border-l-2 pl-6 md:pl-8"
                  style={{ borderColor: colors.hex }}
                >
                  <span className="eyebrow text-brand-grey">0{i + 1}</span>
                  <h3 className="heading-sans text-xl text-brand-black mt-2 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Approach */}
      <section className="py-20 md:py-32 bg-surface-light">
        <div className="container-editorial">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5">
              <FadeIn>
                <Eyebrow color={colors.text}>{approach.eyebrow}</Eyebrow>
                <h2 className="heading-editorial text-4xl md:text-5xl text-brand-black mt-4">
                  {approach.headline}
                </h2>
              </FadeIn>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <FadeIn delay={0.2}>
                <div
                  className="w-16 h-0.5 mb-8"
                  style={{ backgroundColor: colors.hex }}
                />
                <p className="text-lg text-text-secondary leading-relaxed">
                  {approach.body}
                </p>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container-editorial">
          <FadeIn>
            <Eyebrow color={colors.text}>{useCases.eyebrow}</Eyebrow>
            <h2 className="heading-editorial text-4xl md:text-5xl text-brand-black mt-4 mb-12">
              {useCases.headline}
            </h2>
          </FadeIn>

          <StaggerGroup className="space-y-4">
            {useCases.items.map((item, i) => (
              <StaggerItem key={i}>
                <div className="flex items-start gap-4 py-4 border-b border-border-subtle">
                  <span
                    className="mt-2 w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: colors.hex }}
                  />
                  <p className="text-lg text-brand-black">{item}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20 md:py-32 text-white"
        style={{ backgroundColor: colors.hex }}
      >
        <div className="container-editorial text-center max-w-3xl mx-auto">
          <FadeIn>
            <h2 className="heading-editorial text-4xl md:text-5xl text-white">
              {cta.headline}
            </h2>
            <p className="text-lg text-white/80 leading-relaxed mt-6 mb-10">
              {cta.body}
            </p>
            <CTAButton
              href={getLocalizedPath('contact', locale)}
              variant="secondary"
              className="border-white text-white hover:bg-white hover:text-brand-black"
            >
              {cta.button}
            </CTAButton>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
