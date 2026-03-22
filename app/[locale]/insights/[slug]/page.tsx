import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { type Locale } from '@/lib/i18n';
import { getInsights } from '@/lib/content';
import { FadeIn } from '@/components/motion';
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup';
import { Eyebrow, ServiceTag, JournalCard } from '@/components/shared';
import { ArticleBody } from '@/components/shared/ArticleBody';
import { BackToInsights } from '@/components/shared/BackToInsights';
import type { ServiceKey } from '@/lib/utils';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://saiki.id';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = getInsights(locale as Locale);
  const article = t.articles.find((a) => a.slug === slug);

  if (!article) return {};

  const seoTitle = article.seo?.metaTitle || `${article.title} | SAIKI Insights`;
  const seoDescription = article.seo?.metaDescription || article.excerpt;

  return {
    title: seoTitle,
    description: seoDescription,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: `${BASE_URL}/${locale}/insights/${slug}`,
      siteName: 'SAIKI Group',
      locale: locale === 'id' ? 'id_ID' : 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}/insights/${slug}`,
      languages: {
        'id': `${BASE_URL}/id/insights/${slug}`,
        'en': `${BASE_URL}/en/insights/${slug}`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    keywords: article.seo?.keywords,
  };
}

export function generateStaticParams() {
  const idInsights = getInsights('id');
  const enInsights = getInsights('en');

  return [
    ...idInsights.articles.map((a) => ({ locale: 'id', slug: a.slug })),
    ...enInsights.articles.map((a) => ({ locale: 'en', slug: a.slug })),
  ];
}

export default async function InsightArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: l, slug } = await params;
  const locale = l as Locale;
  const t = getInsights(locale);
  const article = t.articles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = t.articles.filter((a) => a.slug !== slug);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    url: `${BASE_URL}/${locale}/insights/${slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'SAIKI Group',
      url: BASE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Hero */}
      <section className="py-20 md:py-32 bg-mesh relative overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 bg-brand-violet/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-brand-teal/10 rounded-full blur-3xl" />

        <div className="container-editorial relative">
          <div className="max-w-3xl">
            <FadeIn>
              <BackToInsights label={t.backToInsights} locale={locale} />

              <div className="flex items-center gap-4 mt-8 mb-6">
                <ServiceTag
                  service={article.categoryKey as ServiceKey}
                  label={article.category}
                />
                <span className="text-sm text-text-muted">{article.date}</span>
                <span className="text-sm text-text-muted">{article.readTime}</span>
              </div>

              <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl text-brand-black leading-tight">
                {article.title}
              </h1>

              <div className="editorial-divider-bold w-20 mt-8" />

              <p className="text-lg md:text-xl text-text-secondary leading-relaxed mt-8">
                {article.excerpt}
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Article body */}
      <section className="py-16 md:py-24 bg-white relative">
        <div className="container-editorial relative">
          <div className="max-w-3xl mx-auto">
            <FadeIn delay={0.1}>
              <ArticleBody blocks={article.body} />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Related articles */}
      {relatedArticles.length > 0 && (
        <section className="py-20 md:py-32 bg-gradient-cool relative overflow-hidden">
          <div className="container-editorial relative">
            <FadeIn>
              <Eyebrow>{t.relatedArticles}</Eyebrow>
              <div className="editorial-divider-bold w-16 mt-4 mb-10" />
            </FadeIn>

            <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedArticles.map((related) => (
                <StaggerItem key={related.slug}>
                  <JournalCard {...related} locale={locale} />
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </section>
      )}
    </>
  );
}
