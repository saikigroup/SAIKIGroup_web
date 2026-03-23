'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FadeIn } from '@/components/motion';
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup';
import { Eyebrow, CTAButton, IconCheck } from '@/components/shared';
import { getLocalizedPath, type Locale } from '@/lib/i18n';
import type { ServiceKey } from '@/lib/utils';
import { serviceAccentColors } from '@/lib/utils';

interface ScopeItem {
  title: string;
  description: string;
}

interface OtherService {
  key: ServiceKey;
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
  otherServicesLabel: string;
  otherServices: OtherService[];
  locale: Locale;
}

export function ServicePageTemplate({
  serviceKey,
  hero,
  scope,
  approach,
  useCases,
  cta,
  otherServicesLabel,
  otherServices,
  locale,
}: ServicePageTemplateProps) {
  const colors = serviceAccentColors[serviceKey];

  return (
    <>
      {/* Hero */}
      <section className="py-20 md:py-32 bg-mesh relative overflow-hidden">
        <div className="absolute top-20 -left-32 w-48 h-48 md:w-96 md:h-96 rounded-full blur-3xl" style={{ backgroundColor: `${colors.hex}15` }} />
        <div className="absolute bottom-10 right-0 w-40 h-40 md:w-80 md:h-80 rounded-full blur-3xl" style={{ backgroundColor: `${colors.hex}08` }} />

        {/* Watermark icon - large on right side */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.06] pointer-events-none hidden md:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={colors.logo}
            alt=""
            className="h-[28rem] w-auto object-contain"
            aria-hidden="true"
          />
        </div>

        <div className="container-editorial relative">
          <div className="max-w-3xl">
            <FadeIn>
              {/* Full logo only */}
              <div className="mb-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={colors.logoFull}
                  alt={hero.eyebrow}
                  className="h-10 w-auto object-contain"
                />
              </div>
              <Eyebrow style={{ color: colors.hex }}>{hero.eyebrow}</Eyebrow>
              <h1 className="heading-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-brand-black mt-4 whitespace-pre-line">
                {hero.headline}
              </h1>
              <div
                className="w-20 h-1 mt-8 rounded-full"
                style={{ background: `linear-gradient(90deg, ${colors.hex}, ${colors.hex}60)` }}
              />
              <p className="text-lg md:text-xl text-text-secondary leading-relaxed mt-8">
                {hero.body}
              </p>
              <div className="mt-10">
                <CTAButton
                  href={getLocalizedPath('contact', locale)}
                  className="transition-all duration-300"
                  style={{ backgroundColor: colors.hex, borderColor: colors.hex }}
                >
                  {cta.button}
                </CTAButton>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Scope */}
      <section className="py-20 md:py-32 bg-white relative overflow-hidden">
        <div className="container-editorial">
          <FadeIn>
            <Eyebrow style={{ color: colors.hex }}>{scope.eyebrow}</Eyebrow>
            <h2 className="heading-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-brand-black mt-4">
              {scope.headline}
            </h2>
          </FadeIn>

          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-14">
            {scope.items.map((item, i) => (
              <StaggerItem key={i}>
                <div
                  className="glass-strong rounded-2xl p-6 md:p-8 hover:shadow-lg transition-all duration-300 h-full"
                  style={{
                    // @ts-expect-error CSS custom property
                    '--tw-shadow-color': `${colors.hex}10`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white"
                      style={{ backgroundColor: colors.hex }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="heading-sans text-xl text-brand-black">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-text-secondary leading-relaxed pl-11">
                    {item.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Approach */}
      <section
        className="py-20 md:py-32 relative overflow-hidden"
        style={{ backgroundColor: `${colors.hex}06` }}
      >
        <div className="container-editorial">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12">
            <div className="lg:col-span-5">
              <FadeIn>
                <Eyebrow style={{ color: colors.hex }}>{approach.eyebrow}</Eyebrow>
                <h2 className="heading-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-brand-black mt-4">
                  {approach.headline}
                </h2>
              </FadeIn>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <FadeIn delay={0.2}>
                <div
                  className="w-16 h-1 mb-8 rounded-full"
                  style={{ background: `linear-gradient(90deg, ${colors.hex}, ${colors.hex}60)` }}
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
            <Eyebrow style={{ color: colors.hex }}>{useCases.eyebrow}</Eyebrow>
            <h2 className="heading-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-brand-black mt-4 mb-12">
              {useCases.headline}
            </h2>
          </FadeIn>

          <StaggerGroup className="space-y-3">
            {useCases.items.map((item, i) => (
              <StaggerItem key={i}>
                <div className="flex items-start gap-4 glass-strong rounded-xl py-4 px-5 hover:shadow-sm transition-all duration-300">
                  <span style={{ color: colors.hex }}><IconCheck size={22} className="shrink-0 mt-0.5" /></span>
                  <p className="text-lg text-brand-black">{item}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20 md:py-32 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${colors.hex}, ${colors.hexSecondary})` }} />
        <div className="container-editorial text-center max-w-3xl mx-auto relative">
          <FadeIn>
            <h2 className="heading-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white">
              {cta.headline}
            </h2>
            <p className="text-lg text-white/80 leading-relaxed mt-6 mb-10">
              {cta.body}
            </p>
            <CTAButton
              href={getLocalizedPath('contact', locale)}
              variant="secondary"
              className="border-white hover:brightness-95"
              style={{ color: '#ffffff', backgroundColor: colors.hex }}
            >
              {cta.button}
            </CTAButton>
          </FadeIn>
        </div>
      </section>

      {/* Other Services */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container-editorial">
          <FadeIn>
            <h2 className="heading-sans text-2xl md:text-3xl text-brand-black mb-10">
              {otherServicesLabel}
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {otherServices.map((other) => {
              const otherColors = serviceAccentColors[other.key];
              return (
                <FadeIn key={other.key}>
                  <Link
                    href={getLocalizedPath(other.key, locale)}
                    className="group glass-strong rounded-2xl p-6 md:p-8 flex items-start gap-5 hover:shadow-lg transition-all duration-300 h-full"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${otherColors.hex}10` }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={otherColors.logo}
                        alt={other.title}
                        className="h-7 w-auto object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="heading-sans text-lg text-brand-black mb-1 group-hover:text-opacity-80 transition-colors">
                        {other.title}
                      </h3>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {other.description}
                      </p>
                    </div>
                    <ArrowRight
                      size={20}
                      className="shrink-0 mt-1 transition-transform duration-300 group-hover:translate-x-1"
                      style={{ color: otherColors.hex }}
                    />
                  </Link>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
