'use client';

import { motion } from 'framer-motion';
import { FadeIn } from '@/components/motion';
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup';
import { SectionHeading } from '@/components/shared';
import { AnimatedCounter } from '@/components/interactive/AnimatedCounter';
import { TiltCard } from '@/components/interactive/TiltCard';

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

const statColors = ['#0d9488', '#8b5cf6', '#f97316'];

export function OperatingModel({ eyebrow, headline, body, stats }: OperatingModelProps) {
  return (
    <section className="py-20 md:py-32 bg-gradient-cool relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 md:w-96 md:h-96 bg-brand-violet/5 rounded-full blur-3xl" />

      <div className="container-editorial relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-6">
            <FadeIn>
              <SectionHeading
                eyebrow={eyebrow}
                headline={headline}
                body={body}
                size="xl"
              />
            </FadeIn>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <StaggerGroup className="grid grid-cols-3 gap-4">
              {stats.map((stat, i) => (
                <StaggerItem key={i}>
                  <TiltCard tiltAmount={12} glare>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="glass-strong rounded-2xl p-5 md:p-6 hover:shadow-lg transition-all duration-300 text-center"
                    >
                      <AnimatedCounter
                        value={stat.value}
                        className="heading-display text-4xl md:text-5xl"
                        duration={1.5}
                      />
                      <p className="text-xs font-medium text-text-secondary mt-2 uppercase tracking-wide">
                        {stat.label}
                      </p>
                    </motion.div>
                  </TiltCard>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </div>
      </div>
    </section>
  );
}
