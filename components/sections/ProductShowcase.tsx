'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
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
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-teal/5 rounded-full blur-3xl" />
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-brand-violet/5 rounded-full blur-3xl" />

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
                    background: `radial-gradient(circle at 50% 100%, ${product.accent}15 0%, transparent 70%)`,
                  }}
                />

                <div className="relative">
                  {/* Logo */}
                  <div className="mb-6 flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden"
                      style={{ backgroundColor: `${product.accent}12` }}
                    >
                      <Image
                        src={product.logo}
                        alt={product.name}
                        width={36}
                        height={36}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="heading-sans text-xl text-brand-black group-hover:text-brand-teal transition-colors">
                        {product.name}
                      </h3>
                      <span className="text-xs font-medium uppercase tracking-wider text-text-tertiary">
                        Live Product
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-text-secondary leading-relaxed mb-6">
                    {product.description}
                  </p>

                  {/* Link */}
                  <div className="flex items-center gap-2 text-sm font-medium" style={{ color: product.accent }}>
                    <span className="group-hover:underline">Kunjungi</span>
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
