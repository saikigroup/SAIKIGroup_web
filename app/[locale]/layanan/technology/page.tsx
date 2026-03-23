import { type Locale } from '@/lib/i18n';
import { getServices } from '@/lib/content';
import { generatePageMetadata } from '@/lib/metadata';
import { ServicePageTemplate } from '@/components/sections/ServicePageTemplate';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata('technology', locale as Locale);
}

export default async function TechnologyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: l } = await params;
  const locale = l as Locale;
  const s = getServices(locale);
  const t = s.technology;

  return (
    <ServicePageTemplate
      serviceKey="technology"
      hero={t.hero}
      scope={t.scope}
      approach={t.approach}
      useCases={t.useCases}
      cta={t.cta}
      otherServicesLabel={s.otherServices}
      otherServices={[
        { key: 'consultancy', title: s.consultancy.hero.eyebrow, description: s.consultancy.hero.body },
        { key: 'imagery', title: s.imagery.hero.eyebrow, description: s.imagery.hero.body },
      ]}
      locale={locale}
    />
  );
}
