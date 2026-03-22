import { type Locale } from '@/lib/i18n';
import { getInsights } from '@/lib/content';
import { generatePageMetadata } from '@/lib/metadata';
import { FadeIn, StaggerGroup, StaggerItem } from '@/components/motion';
import { Eyebrow, JournalCard } from '@/components/shared';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata('insights', locale as Locale);
}

export default async function InsightsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: l } = await params;
  const locale = l as Locale;
  const t = getInsights(locale);

  return (
    <>
      {/* Hero */}
      <section className="py-20 md:py-32 bg-mesh relative overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 bg-brand-violet/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-brand-teal/10 rounded-full blur-3xl" />

        <div className="container-editorial relative">
          <div className="max-w-3xl">
            <FadeIn>
              <Eyebrow>{t.hero.eyebrow}</Eyebrow>
              <h1 className="heading-display text-5xl md:text-6xl lg:text-7xl text-brand-black mt-4 whitespace-pre-line">
                {t.hero.headline}
              </h1>
              <div className="editorial-divider-bold w-20 mt-8" />
              <p className="text-lg md:text-xl text-text-secondary leading-relaxed mt-8">
                {t.hero.body}
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Articles grid */}
      <section className="py-20 md:py-32 bg-gradient-cool relative overflow-hidden">
        <div className="container-editorial relative">
          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.articles.map((article) => (
              <StaggerItem key={article.slug}>
                <JournalCard
                  {...article}
                  locale={locale}
                />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>
    </>
  );
}
