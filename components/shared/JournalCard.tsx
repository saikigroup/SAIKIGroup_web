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
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative glass-strong rounded-2xl hover:shadow-xl hover:shadow-brand-teal/5 transition-all duration-300 ${
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

        <div className="flex items-center justify-between pt-4 border-t border-border-subtle/50">
          <time className="text-sm text-text-muted">{date}</time>
          <motion.span
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-brand-teal/10 text-brand-teal group-hover:bg-brand-teal group-hover:text-white transition-all duration-300"
          >
            <ArrowUpRight className="w-4 h-4" />
          </motion.span>
        </div>
      </div>
    </motion.article>
  );
}
