'use client';

import { motion } from 'framer-motion';
import { FadeIn } from '@/components/motion';
import type { AnySection } from '@/content/projects/registry';

function TextBlock({ heading, body }: { heading?: string; body: string }) {
  return (
    <section className="py-12 md:py-16">
      <div className="container-editorial max-w-3xl mx-auto">
        <FadeIn>
          {heading && (
            <h2 className="heading-sans text-2xl md:text-3xl text-brand-black mb-6">
              {heading}
            </h2>
          )}
          <div className="text-text-secondary text-lg leading-relaxed whitespace-pre-line">
            {body}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function HighlightBlock({ heading, body, bgColor }: { icon?: string; heading: string; body: string; bgColor?: string }) {
  return (
    <section className={`py-12 md:py-16 ${bgColor || 'bg-surface-cream'}`}>
      <div className="container-editorial max-w-3xl mx-auto">
        <FadeIn>
          <div className="glass-strong rounded-2xl p-8 md:p-12">
            <h3 className="heading-sans text-xl md:text-2xl text-brand-black mb-4">
              {heading}
            </h3>
            <p className="text-text-secondary text-lg leading-relaxed">
              {body}
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function MetricsBlock({ heading, items }: { heading?: string; items: Array<{ value: string; label: string }> }) {
  return (
    <section className="py-12 md:py-16">
      <div className="container-editorial">
        <FadeIn>
          {heading && (
            <h3 className="heading-sans text-2xl md:text-3xl text-brand-black mb-10 text-center">
              {heading}
            </h3>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {items.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="heading-display text-3xl md:text-4xl text-brand-teal mb-2">
                  {item.value}
                </div>
                <p className="text-sm text-text-muted font-medium">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function QuoteBlock({ text, attribution }: { text: string; attribution?: string }) {
  return (
    <section className="py-16 md:py-24 bg-gradient-teal relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
      <div className="container-editorial max-w-4xl mx-auto text-center relative">
        <FadeIn>
          <blockquote className="text-2xl md:text-3xl lg:text-4xl text-white font-light leading-relaxed italic">
            &ldquo;{text}&rdquo;
          </blockquote>
          {attribution && (
            <p className="mt-6 text-white/60 text-sm font-medium uppercase tracking-wide">
              {attribution}
            </p>
          )}
        </FadeIn>
      </div>
    </section>
  );
}

function TwoColumnBlock({ left, right }: { left: { heading: string; body: string }; right: { heading: string; body: string } }) {
  return (
    <section className="py-12 md:py-16">
      <div className="container-editorial">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          <FadeIn>
            <h3 className="heading-sans text-xl md:text-2xl text-brand-black mb-4">
              {left.heading}
            </h3>
            <p className="text-text-secondary leading-relaxed">
              {left.body}
            </p>
          </FadeIn>
          <FadeIn delay={0.15}>
            <h3 className="heading-sans text-xl md:text-2xl text-brand-black mb-4">
              {right.heading}
            </h3>
            <p className="text-text-secondary leading-relaxed">
              {right.body}
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function ProcessStepsBlock({ heading, steps }: { heading?: string; steps: Array<{ number: string; title: string; description: string }> }) {
  return (
    <section className="py-12 md:py-16 bg-surface-light">
      <div className="container-editorial">
        <FadeIn>
          {heading && (
            <h3 className="heading-sans text-2xl md:text-3xl text-brand-black mb-10">
              {heading}
            </h3>
          )}
          <div className="space-y-0">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex gap-6 md:gap-8 py-8 border-b border-border-subtle/50 last:border-0"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-teal/10 flex items-center justify-center">
                  <span className="heading-sans text-lg text-brand-teal">{step.number}</span>
                </div>
                <div>
                  <h4 className="heading-sans text-lg text-brand-black mb-2">{step.title}</h4>
                  <p className="text-text-secondary leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function ChallengeSolutionBlock({
  challenges,
  solutions,
  challengeHeading,
  solutionHeading,
}: {
  challenges: Array<{ title: string; description: string }>;
  solutions: Array<{ title: string; description: string }>;
  challengeHeading?: string;
  solutionHeading?: string;
}) {
  return (
    <section className="py-12 md:py-16">
      <div className="container-editorial">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
          {/* Challenges */}
          <FadeIn>
            <div className="glass-strong rounded-2xl p-8 md:p-10 border-l-4 border-rose-400">
              <h3 className="heading-sans text-xl md:text-2xl text-brand-black mb-6">
                {challengeHeading || 'Tantangan'}
              </h3>
              <div className="space-y-5">
                {challenges.map((item, idx) => (
                  <div key={idx}>
                    <h4 className="font-semibold text-brand-black mb-1">{item.title}</h4>
                    <p className="text-text-secondary text-sm leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Solutions */}
          <FadeIn delay={0.15}>
            <div className="glass-strong rounded-2xl p-8 md:p-10 border-l-4 border-brand-teal">
              <h3 className="heading-sans text-xl md:text-2xl text-brand-black mb-6">
                {solutionHeading || 'Solusi'}
              </h3>
              <div className="space-y-5">
                {solutions.map((item, idx) => (
                  <div key={idx}>
                    <h4 className="font-semibold text-brand-black mb-1">{item.title}</h4>
                    <p className="text-text-secondary text-sm leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function GalleryTextBlock({ heading, body, items }: { heading: string; body: string; items: Array<{ label: string; description: string }> }) {
  return (
    <section className="py-12 md:py-16">
      <div className="container-editorial">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <FadeIn>
            <h3 className="heading-sans text-2xl md:text-3xl text-brand-black mb-4">
              {heading}
            </h3>
            <p className="text-text-secondary leading-relaxed">
              {body}
            </p>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="space-y-4">
              {items.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="glass-strong rounded-xl p-5"
                >
                  <h4 className="font-semibold text-brand-black mb-1 text-sm">{item.label}</h4>
                  <p className="text-text-secondary text-sm leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function FullWidthStatementBlock({ statement, subtext }: { statement: string; subtext?: string }) {
  return (
    <section className="py-16 md:py-24 bg-brand-black relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-teal/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-brand-violet/10 rounded-full blur-3xl" />
      <div className="container-editorial max-w-4xl mx-auto text-center relative">
        <FadeIn>
          <p className="heading-display text-2xl md:text-3xl lg:text-4xl text-white leading-relaxed">
            {statement}
          </p>
          {subtext && (
            <p className="mt-6 text-white/50 text-base">
              {subtext}
            </p>
          )}
        </FadeIn>
      </div>
    </section>
  );
}

// Main renderer
export function ProjectDetailRenderer({ sections }: { sections: AnySection[] }) {
  return (
    <>
      {sections.map((section, idx) => {
        switch (section.type) {
          case 'text':
            return <TextBlock key={idx} heading={section.heading} body={section.body} />;
          case 'highlight':
            return <HighlightBlock key={idx} icon={section.icon} heading={section.heading} body={section.body} bgColor={section.bgColor} />;
          case 'metrics':
            return <MetricsBlock key={idx} heading={section.heading} items={section.items} />;
          case 'quote':
            return <QuoteBlock key={idx} text={section.text} attribution={section.attribution} />;
          case 'two-column':
            return <TwoColumnBlock key={idx} left={section.left} right={section.right} />;
          case 'process-steps':
            return <ProcessStepsBlock key={idx} heading={section.heading} steps={section.steps} />;
          case 'challenge-solution':
            return (
              <ChallengeSolutionBlock
                key={idx}
                challenges={section.challenges}
                solutions={section.solutions}
                challengeHeading={section.challengeHeading}
                solutionHeading={section.solutionHeading}
              />
            );
          case 'gallery-text':
            return <GalleryTextBlock key={idx} heading={section.heading} body={section.body} items={section.items} />;
          case 'full-width-statement':
            return <FullWidthStatementBlock key={idx} statement={section.statement} subtext={section.subtext} />;
          default:
            return null;
        }
      })}
    </>
  );
}
