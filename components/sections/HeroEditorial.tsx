'use client';

import { motion } from 'framer-motion';
import { CTAButton } from '@/components/shared';
import { getLocalizedPath, type Locale } from '@/lib/i18n';
import { easings } from '@/lib/motion';

interface HeroEditorialProps {
  eyebrow: string;
  headline: string;
  subheadline: string;
  cta: string;
  ctaSecondary: string;
  locale: Locale;
}

export function HeroEditorial({
  eyebrow,
  headline,
  subheadline,
  cta,
  ctaSecondary,
  locale,
}: HeroEditorialProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-surface-cream overflow-hidden">
      {/* Background editorial grid lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-[20%] w-px h-full bg-border-subtle/50" />
        <div className="absolute top-0 left-[50%] w-px h-full bg-border-subtle/30" />
        <div className="absolute top-0 left-[80%] w-px h-full bg-border-subtle/50" />
      </div>

      <div className="container-editorial relative z-10 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Main content */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: easings.editorial, delay: 0.1 }}
            >
              <span className="eyebrow text-brand-teal">{eyebrow}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: easings.editorial, delay: 0.2 }}
              className="heading-editorial text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-brand-black mt-6 whitespace-pre-line"
            >
              {headline}
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, ease: easings.editorial, delay: 0.5 }}
              className="editorial-divider-bold w-24 mt-8 origin-left"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easings.editorial, delay: 0.6 }}
              className="text-lg md:text-xl text-text-secondary leading-relaxed mt-8 max-w-xl"
            >
              {subheadline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easings.editorial, delay: 0.8 }}
              className="flex flex-wrap gap-4 mt-10"
            >
              <CTAButton href={getLocalizedPath('services', locale)}>
                {cta}
              </CTAButton>
              <CTAButton
                href={getLocalizedPath('contact', locale)}
                variant="secondary"
              >
                {ctaSecondary}
              </CTAButton>
            </motion.div>
          </div>

          {/* Right: Decorative editorial element */}
          <div className="hidden lg:flex lg:col-span-5 items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: easings.editorial, delay: 0.4 }}
              className="relative"
            >
              {/* Large decorative SAIKI symbol */}
              <svg
                viewBox="0 0 275 382"
                fill="none"
                className="w-64 h-auto opacity-[0.08]"
                aria-hidden="true"
              >
                <polygon fill="#2f4f50" points="174.37 181.58 99.63 292.58 77.38 325.63 65.04 343.97 65.03 343.97 72.47 382.48 110.61 369.93 110.61 369.93 127.09 339.05 148.15 299.57 202.53 197.62" />
                <polygon fill="#6a7b8d" points="131.02 0 107.92 27.5 107.92 27.5 110.46 67.1 113.01 106.8 119.11 201.86 119.12 201.86 150.35 141.75 151.77 104.77 153.28 65.34 154.8 25.8 154.8 25.8" />
                <polygon fill="#2f4f50" points="220.67 54.1 190.52 64.39 190.52 64.39 185.94 73.22 167.64 108.45 150.35 141.75 119.12 201.86 119.12 201.86 141.61 214.34 199.71 125.95 221.38 92.99 226.9 84.58 226.9 84.58" />
                <path fill="#2f4f50" d="M241.73,108.46l-4.07,6.2L219.8,141.83a98.16,98.16,0,0,1-44.55,163.83L163,328.7l-10.44,19.56a137.48,137.48,0,0,0,89.21-239.8Z" transform="translate(-12.42 -8.85)" />
                <path fill="#6a7b8d" d="M92.83,309.88l9-13.44a98.2,98.2,0,0,1,14.71-178l-1.48-23L114,78.08a137.49,137.49,0,0,0-34.12,251Z" transform="translate(-12.42 -8.85)" />
              </svg>

              {/* Accent dots */}
              <div className="absolute -top-4 -right-4 w-3 h-3 bg-brand-teal rounded-full" />
              <div className="absolute -bottom-8 left-12 w-2 h-2 bg-accent-consultancy rounded-full" />
              <div className="absolute top-1/3 -right-8 w-2 h-2 bg-accent-imagery rounded-full" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
