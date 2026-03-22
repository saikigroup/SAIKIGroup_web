'use client';

import { motion } from 'framer-motion';
import { FadeIn } from '@/components/motion';
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup';
import { SectionHeading, IconConsultancy, IconImagery, IconTechnology } from '@/components/shared';

interface Scenario {
  context: string;
  need: string;
  solution: string;
}

interface CapabilityScenariosProps {
  eyebrow: string;
  headline: string;
  scenarios: Scenario[];
}

const accentColors = ['#f43f5e', '#06b6d4', '#8b5cf6'];
const Icons = [IconConsultancy, IconImagery, IconTechnology];

export function CapabilityScenarios({
  eyebrow,
  headline,
  scenarios,
}: CapabilityScenariosProps) {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Dark gradient bg */}
      <div className="absolute inset-0 bg-gradient-dark" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-teal/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-brand-violet/10 rounded-full blur-3xl" />

      <div className="container-editorial relative">
        <FadeIn>
          <SectionHeading
            eyebrow={eyebrow}
            headline={headline}
            eyebrowColor="text-brand-teal-light"
            size="xl"
            className="[&_h2]:text-white"
          />
        </FadeIn>

        <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-14">
          {scenarios.map((scenario, i) => {
            const Icon = Icons[i] || Icons[0];
            return (
              <StaggerItem key={i}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="glass-dark rounded-2xl p-8 md:p-10 h-full hover:border-white/20 transition-all duration-300"
                >
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: `${accentColors[i]}20` }}
                  >
                    <Icon size={28} className="text-white" />
                  </div>

                  <p className="text-white/90 mb-4">
                    <span className="font-semibold">{scenario.context}</span>{' '}
                    <span className="text-white/60">{scenario.need}</span>
                  </p>
                  <div className="h-px bg-white/10 my-5" />
                  <p className="text-sm text-white/70 leading-relaxed">
                    {scenario.solution}
                  </p>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
