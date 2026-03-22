'use client';

import { motion } from 'framer-motion';
import { FadeIn } from '@/components/motion';
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup';
import { SectionHeading } from '@/components/shared';

interface Stat {
  value: string;
  label: string;
}

interface OperatingModelProps {
  eyebrow: string;
  headline: string;
  body: string;
  stats: Stat[];
}

export function OperatingModel({ eyebrow, headline, body, stats }: OperatingModelProps) {
  return (
    <section className="py-20 md:py-32 bg-surface-light">
      <div className="container-editorial">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7">
            <FadeIn>
              <SectionHeading
                eyebrow={eyebrow}
                headline={headline}
                body={body}
                size="xl"
              />
            </FadeIn>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <StaggerGroup className="space-y-8">
              {stats.map((stat, i) => (
                <StaggerItem key={i}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="border-l-2 border-brand-teal pl-6"
                  >
                    <span className="heading-editorial text-5xl md:text-6xl text-brand-teal">
                      {stat.value}
                    </span>
                    <p className="text-sm font-medium text-text-secondary mt-1 uppercase tracking-wide">
                      {stat.label}
                    </p>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </div>
      </div>
    </section>
  );
}
