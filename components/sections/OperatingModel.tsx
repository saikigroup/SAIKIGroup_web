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

const statColors = ['#0d9488', '#8b5cf6', '#f97316'];

export function OperatingModel({ eyebrow, headline, body, stats }: OperatingModelProps) {
  return (
    <section className="py-20 md:py-32 bg-gradient-cool relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-violet/5 rounded-full blur-3xl" />

      <div className="container-editorial relative">
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
            <StaggerGroup className="space-y-6">
              {stats.map((stat, i) => (
                <StaggerItem key={i}>
                  <motion.div
                    whileHover={{ scale: 1.05, x: 4 }}
                    className="glass-strong rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
                  >
                    <span
                      className="heading-display text-5xl md:text-6xl"
                      style={{ color: statColors[i] }}
                    >
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
