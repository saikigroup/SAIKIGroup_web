import { type Locale } from '@/lib/i18n';
import { getServices } from '@/lib/content';
import { generatePageMetadata } from '@/lib/metadata';
import { ServicePageTemplate } from '@/components/sections/ServicePageTemplate';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata('consultancy', locale as Locale);
}

export default async function ConsultancyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: l } = await params;
  const locale = l as Locale;
  const s = getServices(locale);
  const t = s.consultancy;

  return (
    <ServicePageTemplate
      serviceKey="consultancy"
      hero={t.hero}
      scope={t.scope}
      approach={t.approach}
      useCases={t.useCases}
      cta={t.cta}
      otherServicesLabel={s.otherServices}
      otherServices={[
        { key: 'imagery', title: s.imagery.hero.eyebrow, description: s.imagery.hero.body },
        { key: 'technology', title: s.technology.hero.eyebrow, description: s.technology.hero.body },
      ]}
      locale={locale}
    />
  );
}
