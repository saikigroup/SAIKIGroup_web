import { type Locale } from '@/lib/i18n';
import { getServices } from '@/lib/content';
import { generatePageMetadata } from '@/lib/metadata';
import { ServicePageTemplate } from '@/components/sections/ServicePageTemplate';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata('imagery', locale as Locale);
}

export default async function ImageryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: l } = await params;
  const locale = l as Locale;
  const t = getServices(locale).imagery;

  return (
    <ServicePageTemplate
      serviceKey="imagery"
      hero={t.hero}
      scope={t.scope}
      approach={t.approach}
      useCases={t.useCases}
      cta={t.cta}
      locale={locale}
    />
  );
}
