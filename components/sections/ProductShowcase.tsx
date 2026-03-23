'use client';

import { motion } from 'framer-motion';
import { FadeIn } from '@/components/motion';
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup';
import { SectionHeading } from '@/components/shared';
import { ArrowUpRight } from 'lucide-react';

interface Product {
  name: string;
  description: string;
  url: string;
  logo: string;
  accent: string;
  linkText: string;
}

interface ProductShowcaseProps {
  eyebrow: string;
  headline: string;
  body: string;
  products: Product[];
}

export function ProductShowcase({ eyebrow, headline, body, products }: ProductShowcaseProps) {
  return (
    <section className="py-20 md:py-32 bg-white relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-48 h-48 md:w-96 md:h-96 bg-brand-teal/5 rounded-full blur-3xl" />
      <div className="absolute top-1/3 left-0 w-40 h-40 md:w-80 md:h-80 bg-brand-violet/5 rounded-full blur-3xl" />

      <div className="container-editorial relative">
        <FadeIn>
          <SectionHeading
            eyebrow={eyebrow}
            headline={headline}
            body={body}
            align="center"
            size="xl"
          />
        </FadeIn>

        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-14 max-w-4xl mx-auto">
          {products.map((product, i) => (
            <StaggerItem key={i}>
              <motion.a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="group glass-strong rounded-2xl p-8 md:p-10 block h-full hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              >
                {/* Accent glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at 50% 100%, ${product.accent}20 0%, transparent 70%)`,
                  }}
                />

                <div className="relative">
                  {/* Logo */}
                  <div className="mb-6">
                    <div
                      className="inline-flex items-center justify-center rounded-xl px-4 py-3 mb-3"
                      style={{ backgroundColor: `${product.accent}08` }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.logo}
                        alt={product.name}
                        className="h-8 w-auto object-contain"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-widest block" style={{ color: product.accent }}>
                        Live Product
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-text-secondary leading-relaxed mb-6">
                    {product.description}
                  </p>

                  {/* Link */}
                  <div
                    className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full transition-all duration-300 group-hover:shadow-md"
                    style={{
                      color: product.accent,
                      backgroundColor: `${product.accent}10`,
                    }}
                  >
                    <span>{product.linkText}</span>
                    <ArrowUpRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </div>
                </div>
              </motion.a>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
