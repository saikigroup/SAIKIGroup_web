import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { type Locale, isValidLocale } from '@/lib/i18n';
import { getInsights } from '@/lib/content';
import { getArticle, getArticles, findArticleByTranslationSlug } from '@/lib/articles';
import { FadeIn } from '@/components/motion';
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup';
import { Eyebrow, ServiceTag, JournalCard } from '@/components/shared';
import { ArticleBody } from '@/components/shared/ArticleBody';
import { BackToInsights } from '@/components/shared/BackToInsights';
import { ShareButton } from '@/components/shared/ShareButton';
import type { ServiceKey } from '@/lib/utils';
import { Clock, Calendar } from 'lucide-react';

// Allow dynamic rendering for Supabase articles not in generateStaticParams
export const dynamicParams = true;

// Revalidate every 60 seconds so new/updated articles appear without re-deploy
export const revalidate = 60;

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://saiki.id';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getArticle(slug, locale as Locale);

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
      images: [
        {
          url: `${BASE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: seoTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: [`${BASE_URL}/og-image.png`],
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
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    keywords: article.seo?.keywords,
  };
}

export async function generateStaticParams() {
  // Combine static + Supabase articles for pre-rendering
  const [idArticles, enArticles] = await Promise.all([
    getArticles('id'),
    getArticles('en'),
  ]);

  return [
    ...idArticles.map((a) => ({ locale: 'id', slug: a.slug })),
    ...enArticles.map((a) => ({ locale: 'en', slug: a.slug })),
  ];
}

export default async function InsightArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: l, slug } = await params;
  const locale = l as Locale;
  const article = await getArticle(slug, locale);
  const t = getInsights(locale);

  if (!article) {
    const validLocale = isValidLocale(locale) ? locale : 'id';

    // Try to find the article via translation_slug (the slug belongs to the other locale)
    const correctSlug = await findArticleByTranslationSlug(slug, validLocale);
    if (correctSlug) {
      redirect(`/${validLocale}/insights/${correctSlug}`);
    }

    // No translation found — redirect to insights listing
    redirect(`/${validLocale}/insights`);
  }

  // Get related articles (all articles except current)
  const allArticles = await getArticles(locale);
  const relatedArticles = allArticles
    .filter((a) => a.slug !== slug)
    .slice(0, 3);

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

  const layout = article.layout || 'editorial';

  // Color accents per category
  const accentMap: Record<string, { blob1: string; blob2: string; heroBg: string }> = {
    consultancy: {
      blob1: 'bg-accent-consultancy/10',
      blob2: 'bg-brand-coral/8',
      heroBg: 'bg-gradient-to-br from-surface-warm via-white to-surface-light',
    },
    imagery: {
      blob1: 'bg-accent-imagery/10',
      blob2: 'bg-brand-violet/8',
      heroBg: 'bg-gradient-to-br from-surface-violet via-white to-surface-cream',
    },
    technology: {
      blob1: 'bg-brand-violet/10',
      blob2: 'bg-brand-teal/8',
      heroBg: 'bg-gradient-to-br from-surface-cream via-white to-surface-violet',
    },
  };

  const accent = accentMap[article.categoryKey] || accentMap.consultancy;

  const metaBar = (
    <div className="flex flex-wrap items-center gap-3">
      <ServiceTag service={article.categoryKey as ServiceKey} label={article.category} />
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
  );

  const articleFooter = (
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
  );

  const relatedSection = relatedArticles.length > 0 && (
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
              <JournalCard
                slug={related.slug}
                title={related.title}
                excerpt={related.excerpt}
                category={related.category}
                categoryKey={related.categoryKey}
                date={related.date}
                readTime={related.readTime}
                featured={related.featured}
                locale={locale}
              />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );

  // LAYOUT: EDITORIAL (classic, left-aligned, gradient blobs)
  if (layout === 'editorial') {
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-mesh" />
          <div className={`absolute top-0 right-0 w-[600px] h-[600px] ${accent.blob1} rounded-full blur-[120px]`} />
          <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] ${accent.blob2} rounded-full blur-[100px]`} />

          <div className="container-editorial relative pt-16 md:pt-24 pb-20 md:pb-32">
            <FadeIn><BackToInsights label={t.backToInsights} locale={locale} /></FadeIn>
            <div className="max-w-4xl mt-10 md:mt-14">
              <FadeIn delay={0.1}>{metaBar}</FadeIn>
              <FadeIn delay={0.2}>
                <h1 className="heading-display text-2xl sm:text-3xl md:text-5xl lg:text-[3.5rem] xl:text-6xl text-brand-black leading-[1.08] mt-8">
                  {article.title}
                </h1>
              </FadeIn>
              <FadeIn delay={0.3}>
                <div className="editorial-divider-bold w-20 mt-10" />
                <p className="text-lg md:text-xl lg:text-[1.35rem] text-text-secondary leading-relaxed mt-8 max-w-2xl">{article.excerpt}</p>
              </FadeIn>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-subtle to-transparent" />
        </section>

        <section className="relative bg-white">
          <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-brand-teal/20 via-transparent to-brand-violet/20 hidden lg:block" style={{ left: 'calc(50% - 400px)' }} />
          <div className="container-editorial py-16 md:py-24">
            <div className="max-w-3xl mx-auto">
              <FadeIn delay={0.1}><ArticleBody blocks={article.body} /></FadeIn>
              {articleFooter}
            </div>
          </div>
        </section>

        {relatedSection}
      </>
    );
  }

  // LAYOUT: MAGAZINE (centered hero, bordered excerpt card, wider body)
  if (layout === 'magazine') {
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

        <section className={`relative overflow-hidden ${accent.heroBg}`}>
          <div className={`absolute -top-20 -right-20 w-[500px] h-[500px] ${accent.blob1} rounded-full blur-[150px] opacity-60`} />

          <div className="container-editorial relative pt-16 md:pt-24 pb-20 md:pb-28">
            <FadeIn><BackToInsights label={t.backToInsights} locale={locale} /></FadeIn>
            <div className="max-w-3xl mx-auto text-center mt-12 md:mt-16">
              <FadeIn delay={0.1}>{metaBar}</FadeIn>
              <FadeIn delay={0.2}>
                <h1 className="heading-display text-2xl sm:text-3xl md:text-5xl lg:text-[3.5rem] text-brand-black leading-[1.08] mt-8">
                  {article.title}
                </h1>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Excerpt card overlapping hero */}
        <div className="container-editorial relative -mt-8 mb-8">
          <FadeIn delay={0.3}>
            <div className="max-w-2xl mx-auto glass-strong rounded-2xl p-8 md:p-10 shadow-lg">
              <p className="text-lg md:text-xl text-text-secondary leading-relaxed text-center italic">
                {article.excerpt}
              </p>
              <div className="editorial-divider-bold w-12 mt-6 mx-auto" />
            </div>
          </FadeIn>
        </div>

        <section className="relative bg-white">
          <div className="container-editorial py-12 md:py-20">
            <div className="max-w-3xl mx-auto">
              <FadeIn delay={0.1}><ArticleBody blocks={article.body} /></FadeIn>
              {articleFooter}
            </div>
          </div>
        </section>

        {relatedSection}
      </>
    );
  }

  // LAYOUT: BOLD (dark hero, full-width accent, high contrast)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

      <section className="relative overflow-hidden bg-gradient-dark">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-teal/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-brand-violet/15 rounded-full blur-[100px]" />

        <div className="container-editorial relative pt-16 md:pt-24 pb-20 md:pb-32">
          <FadeIn>
            <BackToInsights label={t.backToInsights} locale={locale} />
          </FadeIn>
          <div className="max-w-4xl mt-10 md:mt-14">
            <FadeIn delay={0.1}>
              <div className="flex flex-wrap items-center gap-3">
                <ServiceTag service={article.categoryKey as ServiceKey} label={article.category} />
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <span className="inline-flex items-center gap-1.5 text-sm text-white/50">
                  <Calendar className="w-3.5 h-3.5" />
                  {article.date}
                </span>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <span className="inline-flex items-center gap-1.5 text-sm text-white/50">
                  <Clock className="w-3.5 h-3.5" />
                  {article.readTime}
                </span>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <h1 className="heading-display text-2xl sm:text-3xl md:text-5xl lg:text-[3.5rem] xl:text-6xl text-white leading-[1.08] mt-8">
                {article.title}
              </h1>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="w-20 h-[3px] bg-gradient-to-r from-brand-teal to-brand-violet rounded mt-10" />
              <p className="text-lg md:text-xl text-white/60 leading-relaxed mt-8 max-w-2xl">{article.excerpt}</p>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="relative bg-white">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-teal via-brand-violet to-accent-consultancy" />
        <div className="container-editorial py-16 md:py-24">
          <div className="max-w-3xl mx-auto">
            <FadeIn delay={0.1}><ArticleBody blocks={article.body} /></FadeIn>
            {articleFooter}
          </div>
        </div>
      </section>

      {relatedSection}
    </>
  );
}
