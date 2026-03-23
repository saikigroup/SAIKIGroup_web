'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { ServiceTag } from './ServiceTag';
import type { ServiceKey } from '@/lib/utils';

interface ProjectCardProps {
  title: string;
  excerpt: string;
  category: string;
  categoryLabel: string;
  industry: string;
  year: string;
  slug: string;
  locale: string;
  index: number;
}

const accentBorders: Record<string, string> = {
  imagery: 'hover:border-cyan-400/40',
  technology: 'hover:border-violet-400/40',
  consultancy: 'hover:border-rose-400/40',
};

const accentGlows: Record<string, string> = {
  imagery: 'group-hover:shadow-cyan-500/10',
  technology: 'group-hover:shadow-violet-500/10',
  consultancy: 'group-hover:shadow-rose-500/10',
};

export function ProjectCard({
  title,
  excerpt,
  category,
  categoryLabel,
  industry,
  year,
  slug,
  locale,
  index,
}: ProjectCardProps) {
  const projectPath = locale === 'id' ? 'proyek' : 'projects';

  return (
    <Link href={`/${locale}/${projectPath}/${slug}`} className="block h-full">
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ y: -6 }}
        className={`group relative glass-strong rounded-2xl border border-transparent ${accentBorders[category] || ''} transition-all duration-300 h-full hover:shadow-xl ${accentGlows[category] || ''}`}
      >
        <div className="p-6 md:p-8 flex flex-col h-full">
          {/* Top row: tag + year */}
          <div className="flex items-center justify-between mb-5">
            <ServiceTag
              service={category as ServiceKey}
              label={categoryLabel}
            />
            <span className="text-xs font-medium text-text-muted tracking-wide">
              {year}
            </span>
          </div>

          {/* Title */}
          <h3 className="heading-sans text-xl md:text-2xl text-brand-black group-hover:text-brand-teal transition-colors duration-300 mb-3">
            {title}
          </h3>

          {/* Excerpt */}
          <p className="text-text-secondary text-sm leading-relaxed mb-6 flex-grow">
            {excerpt}
          </p>

          {/* Bottom row: industry + arrow */}
          <div className="flex items-center justify-between pt-4 border-t border-border-subtle/50">
            <span className="text-xs font-semibold tracking-wide uppercase text-text-muted">
              {industry}
            </span>
            <motion.span
              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-brand-teal/10 text-brand-teal group-hover:bg-brand-teal group-hover:text-white transition-all duration-300"
            >
              <ArrowUpRight className="w-4 h-4" />
            </motion.span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
