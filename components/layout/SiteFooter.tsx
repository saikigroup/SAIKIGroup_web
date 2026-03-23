import Link from 'next/link';
import { Logo } from './Logo';
import { getLocalizedPath, type Locale } from '@/lib/i18n';
import { getCommon } from '@/lib/content';

interface SiteFooterProps {
  locale: Locale;
}

export function SiteFooter({ locale }: SiteFooterProps) {
  const t = getCommon(locale);
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-dark" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-teal/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-violet/10 rounded-full blur-3xl" />

      <div className="container-editorial py-16 md:py-20 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Logo variant="white" className="mb-4" />
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              {t.footer.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-white/30 mb-5">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href={getLocalizedPath('about', locale)}
                  className="text-sm text-white/60 hover:text-brand-teal-light transition-colors"
                >
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link
                  href={getLocalizedPath('services', locale)}
                  className="text-sm text-white/60 hover:text-brand-teal-light transition-colors"
                >
                  {t.nav.services}
                </Link>
              </li>
              <li>
                <Link
                  href={getLocalizedPath('insights', locale)}
                  className="text-sm text-white/60 hover:text-brand-teal-light transition-colors"
                >
                  {t.nav.insights}
                </Link>
              </li>
              <li>
                <Link
                  href={getLocalizedPath('contact', locale)}
                  className="text-sm text-white/60 hover:text-brand-teal-light transition-colors"
                >
                  {t.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Our Solutions */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-white/30 mb-5">
              {t.footer.businessLines}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href={getLocalizedPath('consultancy', locale)}
                  className="text-sm text-white/60 hover:text-brand-teal-light transition-colors"
                >
                  SAIKI Consultancy
                </Link>
              </li>
              <li>
                <Link
                  href={getLocalizedPath('imagery', locale)}
                  className="text-sm text-white/60 hover:text-brand-teal-light transition-colors"
                >
                  SAIKI Imagery
                </Link>
              </li>
              <li>
                <Link
                  href={getLocalizedPath('technology', locale)}
                  className="text-sm text-white/60 hover:text-brand-teal-light transition-colors"
                >
                  SAIKI Technology
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-white/30 mb-5">
              {t.footer.contact}
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:info@saiki.id"
                  className="text-sm text-white/60 hover:text-brand-teal-light transition-colors"
                >
                  info@saiki.id
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/6287788980088"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/60 hover:text-brand-teal-light transition-colors"
                >
                  087788980088
                </a>
              </li>
              <li>
                <p className="text-sm text-white/40 italic leading-relaxed">
                  Everywhere close to everyone who wants to move now.
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            &copy; {year} SAIKI Group. {t.footer.rights}
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-white/30 hover:text-white/50 transition-colors cursor-pointer">{t.footer.privacy}</span>
            <span className="text-xs text-white/30 hover:text-white/50 transition-colors cursor-pointer">{t.footer.terms}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
