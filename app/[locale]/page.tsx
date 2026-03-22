import { type Locale } from '@/lib/i18n';
import { getHome } from '@/lib/content';
import { generatePageMetadata } from '@/lib/metadata';
import {
  HeroEditorial,
  BrandStatement,
  ServiceOverviewGrid,
  WhySaiki,
  CapabilityScenarios,
  OperatingModel,
  JournalPreview,
  ContactCTA,
  MarqueeBanner,
} from '@/components/sections';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata('home', locale as Locale);
}

const marqueeItemsId = ['Konsultansi', 'Branding', 'Teknologi', 'Karier', 'Inovasi', 'Strategi', 'Digital'];
const marqueeItemsEn = ['Consultancy', 'Branding', 'Technology', 'Career', 'Innovation', 'Strategy', 'Digital'];

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getHome(locale as Locale);
  const marqueeItems = locale === 'id' ? marqueeItemsId : marqueeItemsEn;

  return (
    <>
      <HeroEditorial
        eyebrow={t.hero.eyebrow}
        headline={t.hero.headline}
        subheadline={t.hero.subheadline}
        cta={t.hero.cta}
        ctaSecondary={t.hero.ctaSecondary}
        locale={locale as Locale}
      />

      <MarqueeBanner items={marqueeItems} variant="light" />

      <BrandStatement
        eyebrow={t.brand.eyebrow}
        headline={t.brand.headline}
        body={t.brand.body}
        body2={t.brand.body2}
      />

      <ServiceOverviewGrid
        eyebrow={t.services.eyebrow}
        headline={t.services.headline}
        consultancy={t.services.consultancy}
        imagery={t.services.imagery}
        technology={t.services.technology}
        locale={locale as Locale}
      />

      <WhySaiki
        eyebrow={t.why.eyebrow}
        headline={t.why.headline}
        body={t.why.body}
        points={t.why.points}
      />

      <MarqueeBanner
        items={locale === 'id'
          ? ['Bergerak Sekarang', 'Percaya Diri', 'Dampak Nyata', 'Masa Kini']
          : ['Move Now', 'With Confidence', 'Real Impact', 'For the Present']
        }
        variant="gradient"
      />

      <CapabilityScenarios
        eyebrow={t.capabilities.eyebrow}
        headline={t.capabilities.headline}
        scenarios={t.capabilities.scenarios}
      />

      <OperatingModel
        eyebrow={t.operating.eyebrow}
        headline={t.operating.headline}
        body={t.operating.body}
        stats={t.operating.stats}
      />

      <JournalPreview
        eyebrow={t.journal.eyebrow}
        headline={t.journal.headline}
        viewAll={t.journal.viewAll}
        locale={locale as Locale}
      />

      <ContactCTA
        eyebrow={t.contactCta.eyebrow}
        headline={t.contactCta.headline}
        body={t.contactCta.body}
        cta={t.contactCta.cta}
        locale={locale as Locale}
      />
    </>
  );
}
