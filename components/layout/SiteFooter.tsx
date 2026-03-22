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
    <footer className="bg-brand-black text-white">
      <div className="container-editorial py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Logo variant="white" className="mb-4" />
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              {t.footer.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-white/40 mb-5">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href={getLocalizedPath('about', locale)}
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link
                  href={getLocalizedPath('services', locale)}
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  {t.nav.services}
                </Link>
              </li>
              <li>
                <Link
                  href={getLocalizedPath('insights', locale)}
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  {t.nav.insights}
                </Link>
              </li>
              <li>
                <Link
                  href={getLocalizedPath('contact', locale)}
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  {t.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Business Lines */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-white/40 mb-5">
              {t.footer.businessLines}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href={getLocalizedPath('consultancy', locale)}
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  SAIKI Consultancy
                </Link>
              </li>
              <li>
                <Link
                  href={getLocalizedPath('imagery', locale)}
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  SAIKI Imagery
                </Link>
              </li>
              <li>
                <Link
                  href={getLocalizedPath('technology', locale)}
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  SAIKI Technology
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-white/40 mb-5">
              {t.footer.contact}
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:info@saiki.id"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  info@saiki.id
                </a>
              </li>
              <li>
                <a
                  href="tel:+6287788980088"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  087788980088
                </a>
              </li>
              <li>
                <p className="text-sm text-white/50 italic leading-relaxed">
                  Everywhere close to everyone who wants to move now.
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            &copy; {year} SAIKI Group. {t.footer.rights}
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-white/40">{t.footer.privacy}</span>
            <span className="text-xs text-white/40">{t.footer.terms}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
