import { type Locale } from '@/lib/i18n';
import { getInsights } from '@/lib/content';
import { getArticles } from '@/lib/articles';
import { generatePageMetadata } from '@/lib/metadata';
import { FadeIn, StaggerGroup, StaggerItem } from '@/components/motion';
import { Eyebrow, JournalCard } from '@/components/shared';

// Revalidate every 60 seconds so new articles appear without re-deploy
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata('insights', locale as Locale);
}

export default async function InsightsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: l } = await params;
  const locale = l as Locale;
  const t = getInsights(locale);
  const articles = await getArticles(locale);

  return (
    <>
      {/* Hero */}
      <section className="py-20 md:py-32 bg-mesh relative overflow-hidden">
        <div className="absolute top-20 right-0 w-48 h-48 md:w-96 md:h-96 bg-brand-violet/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-10 w-40 h-40 md:w-80 md:h-80 bg-brand-teal/10 rounded-full blur-3xl" />

        <div className="container-editorial relative">
          <div className="max-w-3xl">
            <FadeIn>
              <Eyebrow>{t.hero.eyebrow}</Eyebrow>
              <h1 className="heading-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-brand-black mt-4 whitespace-pre-line">
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
            {articles.map((article) => (
              <StaggerItem key={article.slug} className={article.featured ? 'md:col-span-2' : ''}>
                <JournalCard
                  slug={article.slug}
                  title={article.title}
                  excerpt={article.excerpt}
                  category={article.category}
                  categoryKey={article.categoryKey}
                  date={article.date}
                  readTime={article.readTime}
                  featured={article.featured}
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
