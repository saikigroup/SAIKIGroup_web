'use client';

import { FadeIn } from '@/components/motion';
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup';
import { SectionHeading } from '@/components/shared';

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

export function WhySaiki({ eyebrow, headline, body, points }: WhySaikiProps) {
  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="container-editorial">
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
            <StaggerGroup className="space-y-8">
              {points.map((point, i) => (
                <StaggerItem key={i}>
                  <div className="group border-l-2 border-brand-teal pl-6 md:pl-8 hover:border-accent-imagery transition-colors duration-300">
                    <span className="eyebrow text-brand-grey">0{i + 1}</span>
                    <h3 className="heading-sans text-xl text-brand-black mt-2 mb-3">
                      {point.title}
                    </h3>
                    <p className="text-text-secondary leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </div>
      </div>
    </section>
  );
}
