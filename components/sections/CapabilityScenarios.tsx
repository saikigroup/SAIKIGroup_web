'use client';

import { motion } from 'framer-motion';
import { FadeIn } from '@/components/motion';
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup';
import { SectionHeading } from '@/components/shared';

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

export function CapabilityScenarios({
  eyebrow,
  headline,
  scenarios,
}: CapabilityScenariosProps) {
  const accentColors = ['#660e36', '#117a8c', '#1a3a5c'];

  return (
    <section className="py-20 md:py-32 bg-brand-black text-white">
      <div className="container-editorial">
        <FadeIn>
          <SectionHeading
            eyebrow={eyebrow}
            headline={headline}
            eyebrowColor="text-white/60"
            size="xl"
            className="[&_h2]:text-white"
          />
        </FadeIn>

        <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-14">
          {scenarios.map((scenario, i) => (
            <StaggerItem key={i}>
              <motion.div
                whileHover={{ y: -4, borderColor: accentColors[i] }}
                transition={{ duration: 0.3 }}
                className="border border-white/10 p-8 md:p-10 h-full hover:bg-white/5 transition-colors duration-300"
              >
                <div
                  className="w-8 h-1 mb-6"
                  style={{ backgroundColor: accentColors[i] }}
                />
                <p className="text-white/90 mb-4">
                  <span className="font-semibold">{scenario.context}</span>{' '}
                  <span className="text-white/60">{scenario.need}</span>
                </p>
                <div className="editorial-divider bg-white/10 my-5" />
                <p className="text-sm text-white/70 leading-relaxed">
                  {scenario.solution}
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
