'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Logo } from './Logo';
import { LanguageSwitch } from './LanguageSwitch';
import { getLocalizedPath, type Locale } from '@/lib/i18n';
import { getCommon } from '@/lib/content';

interface SiteHeaderProps {
  locale: Locale;
}

export function SiteHeader({ locale }: SiteHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const t = getCommon(locale);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const navItems = [
    { key: 'about', label: t.nav.about },
    { key: 'services', label: t.nav.services },
    { key: 'insights', label: t.nav.insights },
    { key: 'projects', label: t.nav.projects },
    { key: 'contact', label: t.nav.contact },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'glass-strong shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="container-editorial">
          <nav className="flex items-center justify-between h-16 md:h-20">
            <Link href={getLocalizedPath('home', locale)} className="relative z-50">
              <Logo variant={isOpen ? 'white' : 'dark'} />
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  href={getLocalizedPath(item.key, locale)}
                  className="relative px-4 py-2 text-sm font-medium text-brand-black/80 hover:text-brand-teal rounded-lg hover:bg-brand-teal/5 transition-all duration-200"
                >
                  {item.label}
                </Link>
              ))}
              <div className="ml-3">
                <LanguageSwitch locale={locale} />
              </div>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden relative z-50 p-2 rounded-xl hover:bg-black/5 transition-colors"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-brand-black" />
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile nav overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-gradient-dark"
          >
            <div className="flex flex-col justify-center items-start h-full container-editorial">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
                }}
                className="space-y-4"
              >
                {navItems.map((item) => (
                  <motion.div
                    key={item.key}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 },
                    }}
                  >
                    <Link
                      href={getLocalizedPath(item.key, locale)}
                      onClick={() => setIsOpen(false)}
                      className="block text-3xl md:text-4xl font-bold text-white hover:text-brand-teal-light transition-colors"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  className="pt-6"
                >
                  <LanguageSwitch locale={locale} className="border-white/20" />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
