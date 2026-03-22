'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { FadeIn } from '@/components/motion';
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup';
import { SectionHeading } from '@/components/shared';
import { getLocalizedPath, type Locale } from '@/lib/i18n';
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
    <section className="py-20 md:py-32 bg-surface-cream">
      <div className="container-editorial">
        <FadeIn>
          <SectionHeading eyebrow={eyebrow} headline={headline} size="xl" />
        </FadeIn>

        <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-14">
          {services.map((service, i) => {
            const key = serviceKeys[i];
            const colors = serviceAccentColors[key];

            return (
              <StaggerItem key={key}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={getLocalizedPath(key, locale)}
                    className="group block bg-white border border-border-subtle hover:border-brand-teal p-8 md:p-10 h-full transition-colors duration-300"
                  >
                    {/* Accent bar */}
                    <div
                      className="w-10 h-1 mb-6 transition-all duration-300 group-hover:w-16"
                      style={{ backgroundColor: colors.hex }}
                    />

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
                          className="text-xs font-medium px-2.5 py-1 border"
                          style={{ borderColor: colors.hex, color: colors.hex }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand-teal group-hover:gap-3 transition-all duration-300">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
