import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { type Locale } from '@/lib/i18n';
import { getInsights } from '@/lib/content';
import { FadeIn } from '@/components/motion';
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup';
import { Eyebrow, ServiceTag, JournalCard } from '@/components/shared';
import { ArticleBody } from '@/components/shared/ArticleBody';
import { BackToInsights } from '@/components/shared/BackToInsights';
import { ShareButton } from '@/components/shared/ShareButton';
import type { ServiceKey } from '@/lib/utils';
import { Clock, Calendar } from 'lucide-react';

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
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-mesh" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-violet/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-teal/8 rounded-full blur-[100px]" />

        <div className="container-editorial relative pt-16 md:pt-24 pb-20 md:pb-32">
          <FadeIn>
            <BackToInsights label={t.backToInsights} locale={locale} />
          </FadeIn>

          <div className="max-w-4xl mt-10 md:mt-14">
            <FadeIn delay={0.1}>
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <ServiceTag
                  service={article.categoryKey as ServiceKey}
                  label={article.category}
                />
                <span className="w-1 h-1 rounded-full bg-text-muted" />
                <span className="inline-flex items-center gap-1.5 text-sm text-text-muted">
                  <Calendar className="w-3.5 h-3.5" />
                  {article.date}
                </span>
                <span className="w-1 h-1 rounded-full bg-text-muted" />
                <span className="inline-flex items-center gap-1.5 text-sm text-text-muted">
                  <Clock className="w-3.5 h-3.5" />
                  {article.readTime}
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h1 className="heading-display text-4xl md:text-5xl lg:text-[3.5rem] xl:text-6xl text-brand-black leading-[1.08]">
                {article.title}
              </h1>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="editorial-divider-bold w-20 mt-10" />
              <p className="text-lg md:text-xl lg:text-[1.35rem] text-text-secondary leading-relaxed mt-8 max-w-2xl">
                {article.excerpt}
              </p>
            </FadeIn>
          </div>
        </div>

        {/* Bottom edge decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-subtle to-transparent" />
      </section>

      {/* Article body */}
      <section className="relative bg-white">
        {/* Subtle side decoration */}
        <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-brand-teal/20 via-transparent to-brand-violet/20 hidden lg:block" style={{ left: 'calc(50% - 400px)' }} />

        <div className="container-editorial py-16 md:py-24">
          <div className="max-w-3xl mx-auto">
            <FadeIn delay={0.1}>
              <ArticleBody blocks={article.body} />
            </FadeIn>

            {/* Article footer */}
            <FadeIn delay={0.1}>
              <div className="mt-16 pt-8 border-t border-border-subtle/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-teal flex items-center justify-center text-white font-bold text-sm">
                      SG
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-brand-black">SAIKI Group</p>
                      <p className="text-xs text-text-muted">{article.date}</p>
                    </div>
                  </div>
                  <ShareButton label={t.shareArticle} />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Related articles */}
      {relatedArticles.length > 0 && (
        <section className="py-20 md:py-32 bg-gradient-cool relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-subtle to-transparent" />

          <div className="container-editorial relative">
            <FadeIn>
              <Eyebrow>{t.relatedArticles}</Eyebrow>
              <div className="editorial-divider-bold w-16 mt-4 mb-12" />
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
