import { type Locale } from '@/lib/i18n';
import { getServices, getHome } from '@/lib/content';
import { generatePageMetadata } from '@/lib/metadata';
import { FadeIn } from '@/components/motion';
import { Eyebrow } from '@/components/shared';
import { ServiceOverviewGrid, ContactCTA } from '@/components/sections';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata('services', locale as Locale);
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: l } = await params;
  const locale = l as Locale;
  const t = getServices(locale);
  const homeT = getHome(locale);

  return (
    <>
      {/* Hero */}
      <section className="py-20 md:py-32 bg-mesh relative overflow-hidden">
        <div className="absolute top-20 -left-32 w-48 h-48 md:w-96 md:h-96 bg-brand-teal/15 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-0 w-40 h-40 md:w-80 md:h-80 bg-brand-violet/10 rounded-full blur-3xl" />

        <div className="container-editorial relative">
          <div className="max-w-3xl">
            <FadeIn>
              <Eyebrow>{t.overview.eyebrow}</Eyebrow>
              <h1 className="heading-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-brand-black mt-4">
                {t.overview.headline}
              </h1>
              <div className="editorial-divider-bold w-20 mt-8" />
              <p className="text-lg md:text-xl text-text-secondary leading-relaxed mt-8">
                {t.overview.body}
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      <ServiceOverviewGrid
        eyebrow={homeT.services.eyebrow}
        headline={homeT.services.headline}
        consultancy={homeT.services.consultancy}
        imagery={homeT.services.imagery}
        technology={homeT.services.technology}
        locale={locale}
      />

      <ContactCTA
        eyebrow={homeT.contactCta.eyebrow}
        headline={homeT.contactCta.headline}
        body={homeT.contactCta.body}
        cta={homeT.contactCta.cta}
        locale={locale}
      />
    </>
  );
}
