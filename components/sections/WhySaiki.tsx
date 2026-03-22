'use client';

import { FadeIn } from '@/components/motion';
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup';
import { SectionHeading, IconTarget, IconEcosystem, IconBolt } from '@/components/shared';

interface Point {
  title: string;
  description: string;
}

interface WhySaikiProps {
  eyebrow: string;
  headline: string;
  body: string;
  points: Point[];
}

const pointIcons = [IconTarget, IconEcosystem, IconBolt];
const pointColors = ['#0d9488', '#8b5cf6', '#f97316'];

export function WhySaiki({ eyebrow, headline, body, points }: WhySaikiProps) {
  return (
    <section className="py-20 md:py-32 bg-white relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-brand-teal/5 rounded-full blur-3xl -translate-y-1/2" />

      <div className="container-editorial relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5">
            <FadeIn>
              <SectionHeading
                eyebrow={eyebrow}
                headline={headline}
                body={body}
                size="xl"
              />
            </FadeIn>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <StaggerGroup className="space-y-6">
              {points.map((point, i) => {
                const Icon = pointIcons[i] || pointIcons[0];
                const color = pointColors[i] || pointColors[0];
                return (
                  <StaggerItem key={i}>
                    <div className="group glass-strong rounded-2xl p-6 md:p-8 hover:shadow-lg hover:shadow-brand-teal/5 transition-all duration-300">
                      <div className="flex items-start gap-5">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                          style={{ backgroundColor: `${color}15` }}
                        >
                          <Icon size={28} className="transition-colors" />
                        </div>
                        <div>
                          <h3 className="heading-sans text-xl text-brand-black mb-2">
                            {point.title}
                          </h3>
                          <p className="text-text-secondary leading-relaxed">
                            {point.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerGroup>
          </div>
        </div>
      </div>
    </section>
  );
}
