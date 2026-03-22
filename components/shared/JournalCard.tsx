'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Clock } from 'lucide-react';
import { ServiceTag } from './ServiceTag';
import type { ServiceKey } from '@/lib/utils';

interface JournalCardProps {
  title: string;
  excerpt: string;
  category: string;
  categoryKey: string;
  date: string;
  readTime: string;
  featured?: boolean;
  slug: string;
  locale: string;
}

export function JournalCard({
  title,
  excerpt,
  category,
  categoryKey,
  date,
  readTime,
  featured = false,
  slug,
  locale,
}: JournalCardProps) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative border border-border-subtle bg-white hover:border-brand-teal transition-colors duration-300 ${
        featured ? 'md:col-span-2' : ''
      }`}
    >
      <div className="p-6 md:p-8 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <ServiceTag
            service={categoryKey as ServiceKey}
            label={category}
          />
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <Clock className="w-3.5 h-3.5" />
            {readTime}
          </div>
        </div>

        <h3
          className={`heading-sans text-brand-black group-hover:text-brand-teal transition-colors duration-300 mb-3 ${
            featured ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'
          }`}
        >
          {title}
        </h3>

        <p className="text-text-secondary leading-relaxed mb-6 flex-grow">
          {excerpt}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
          <time className="text-sm text-text-muted">{date}</time>
          <motion.span
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-teal"
            whileHover={{ x: 4 }}
          >
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </motion.span>
        </div>
      </div>
    </motion.article>
  );
}
