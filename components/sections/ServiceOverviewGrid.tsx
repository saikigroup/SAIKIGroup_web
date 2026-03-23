'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FadeIn } from '@/components/motion';
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup';
import { SectionHeading } from '@/components/shared';
import { getLocalizedPath, type Locale } from '@/lib/i18n';
import { serviceAccentColors, type ServiceKey } from '@/lib/utils';

interface ServiceData {
  title: string;
  description: string;
  hoverDescription?: string;
  tags: string[];
}

interface ServiceOverviewGridProps {
  eyebrow: string;
  headline: string;
  ctaLabel?: string;
  consultancy: ServiceData;
  imagery: ServiceData;
  technology: ServiceData;
  locale: Locale;
}

const serviceKeys: ServiceKey[] = ['consultancy', 'imagery', 'technology'];

export function ServiceOverviewGrid({
  eyebrow,
  headline,
  ctaLabel = 'Pelajari Lebih Lanjut',
  consultancy,
  imagery,
  technology,
  locale,
}: ServiceOverviewGridProps) {
  const services = [consultancy, imagery, technology];

  return (
    <section className="py-20 md:py-32 bg-gradient-cool relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 md:w-96 md:h-96 bg-brand-violet/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-40 h-40 md:w-80 md:h-80 bg-brand-teal/5 rounded-full blur-3xl" />

      <div className="container-editorial relative">
        <FadeIn>
          <SectionHeading eyebrow={eyebrow} headline={headline} size="xl" />
        </FadeIn>

        <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-14">
          {services.map((service, i) => {
            const key = serviceKeys[i];
            const colors = serviceAccentColors[key];

            return (
              <StaggerItem key={key}>
                <Link
                  href={getLocalizedPath(key, locale)}
                  className="group block h-full [perspective:1000px]"
                >
                  <div className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                    {/* Front face */}
                    <div className="glass-strong rounded-2xl p-8 md:p-10 [backface-visibility:hidden] relative overflow-hidden">
                      {/* Watermark icon */}
                      <div className="absolute -right-6 -bottom-6 opacity-[0.04] pointer-events-none">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={colors.logo}
                          alt=""
                          className="h-44 w-auto object-contain"
                          aria-hidden="true"
                        />
                      </div>

                      <div className="relative">
                        {/* Service sub-logo */}
                        <div className="mb-6">
                          <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-sm"
                            style={{ backgroundColor: `${colors.hex}10` }}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={colors.logo}
                              alt={service.title}
                              className="h-10 w-auto object-contain"
                            />
                          </div>
                        </div>

                        <h3 className="heading-sans text-xl md:text-2xl text-brand-black mb-4">
                          {service.title}
                        </h3>

                        <p className="text-text-secondary leading-relaxed mb-6">
                          {service.description}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {service.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs font-medium px-3 py-1.5 rounded-full border backdrop-blur-sm"
                              style={{
                                borderColor: `${colors.hex}30`,
                                color: colors.hex,
                                backgroundColor: `${colors.hex}08`,
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Back face */}
                    <div
                      className="absolute inset-0 rounded-2xl p-8 md:p-10 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col items-center justify-center text-center text-white"
                      style={{ background: `linear-gradient(135deg, ${colors.hex}, ${colors.hexSecondary})` }}
                    >
                      {/* Logo full on back */}
                      <div className="mb-6">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={colors.logoFull}
                          alt={service.title}
                          className="h-8 w-auto object-contain brightness-0 invert"
                        />
                      </div>

                      <p className="text-white/80 text-sm leading-relaxed mb-8 max-w-xs">
                        {service.hoverDescription || service.description}
                      </p>

                      <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 group-hover:bg-white/30">
                        {ctaLabel}
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
