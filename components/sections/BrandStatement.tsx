'use client';

import { FadeIn } from '@/components/motion';
import { Eyebrow } from '@/components/shared';

interface BrandStatementProps {
  eyebrow: string;
  headline: string;
  body: string;
  body2: string;
}

export function BrandStatement({ eyebrow, headline, body, body2 }: BrandStatementProps) {
  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="container-editorial">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-4">
            <FadeIn>
              <Eyebrow>{eyebrow}</Eyebrow>
              <h2 className="heading-editorial text-4xl md:text-5xl text-brand-black mt-4">
                {headline}
              </h2>
            </FadeIn>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <FadeIn delay={0.2}>
              <div className="editorial-divider-bold w-16 mb-8" />
              <p className="text-lg md:text-xl text-text-secondary leading-relaxed mb-6">
                {body}
              </p>
              <p className="text-lg text-brand-black font-medium leading-relaxed">
                {body2}
              </p>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
