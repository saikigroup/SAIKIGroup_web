'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { FadeIn } from '@/components/motion';
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup';
import { SectionHeading, IconConsultancy, IconImagery, IconTechnology } from '@/components/shared';
import { getLocalizedPath, type Locale } from '@/lib/i18n';
import { TiltCard } from '@/components/interactive/TiltCard';
import { serviceAccentColors, type ServiceKey } from '@/lib/utils';

interface ServiceData {
  title: string;
  description: string;
  tags: string[];
}

interface ServiceOverviewGridProps {
  eyebrow: string;
  headline: string;
  consultancy: ServiceData;
  imagery: ServiceData;
  technology: ServiceData;
  locale: Locale;
}

const serviceKeys: ServiceKey[] = ['consultancy', 'imagery', 'technology'];

const ServiceIcon = ({ serviceKey, size = 32 }: { serviceKey: ServiceKey; size?: number }) => {
  switch (serviceKey) {
    case 'consultancy': return <IconConsultancy size={size} />;
    case 'imagery': return <IconImagery size={size} />;
    case 'technology': return <IconTechnology size={size} />;
  }
};

export function ServiceOverviewGrid({
  eyebrow,
  headline,
  consultancy,
  imagery,
  technology,
  locale,
}: ServiceOverviewGridProps) {
  const services = [consultancy, imagery, technology];

  return (
    <section className="py-20 md:py-32 bg-gradient-cool relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-violet/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-teal/5 rounded-full blur-3xl" />

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
                <TiltCard tiltAmount={8} className="h-full">
                  <Link
                    href={getLocalizedPath(key, locale)}
                    className="group block glass-strong rounded-2xl p-8 md:p-10 h-full transition-all duration-300 relative overflow-hidden hover:shadow-xl"
                    style={{
                      // @ts-expect-error CSS custom properties
                      '--service-color': colors.hex,
                      '--service-color-light': `${colors.hex}08`,
                      '--service-color-hover': `${colors.hex}12`,
                    }}
                  >
                    {/* Gradient bg on hover - uses logo color */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                      style={{
                        background: `linear-gradient(135deg, ${colors.hex}08 0%, ${colors.hex}15 100%)`,
                      }}
                    />

                    {/* Watermark icon - large background */}
                    <div className="absolute -right-6 -bottom-6 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-500 pointer-events-none">
                      <ServiceIcon serviceKey={key} size={180} />
                    </div>

                    <div className="relative">
                      {/* Service sub-logo */}
                      <div className="mb-6">
                        <div
                          className="w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 backdrop-blur-sm"
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

                      <div className="flex flex-wrap gap-2 mb-8">
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

                      <span
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: `${colors.hex}10`,
                          color: colors.hex,
                        }}
                      >
                        <motion.span
                          className="inline-flex items-center justify-center w-10 h-10 rounded-full group-hover:text-white transition-all duration-300"
                          style={{
                            // On hover, fill with service color
                          }}
                        >
                          <span
                            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{ backgroundColor: colors.hex }}
                          />
                          <ArrowRight className="w-4 h-4 relative z-10" />
                        </motion.span>
                      </span>
                    </div>
                  </Link>
                </TiltCard>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
