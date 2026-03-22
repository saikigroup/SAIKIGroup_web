import { getSupabaseAdmin, TABLES } from './supabase';
import { getInsights } from './content';
import type { Locale } from './i18n';

export type ArticleLayout = 'editorial' | 'magazine' | 'bold';

export interface ArticleData {
  slug: string;
  layout?: ArticleLayout;
  title: string;
  excerpt: string;
  body: string | Array<{ type: string; content: string }>;
  category: string;
  categoryKey: string;
  date: string;
  readTime: string;
  featured: boolean;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

/**
 * Get all published articles for a locale.
 * Merges Supabase articles with static content (static as fallback).
 */
export async function getArticles(locale: Locale): Promise<ArticleData[]> {
  const staticInsights = getInsights(locale);
  const staticArticles: ArticleData[] = staticInsights.articles.map((a) => ({
    slug: a.slug,
    layout: a.layout,
    title: a.title,
    excerpt: a.excerpt,
    body: a.body,
    category: a.category,
    categoryKey: a.categoryKey,
    date: a.date,
    readTime: a.readTime,
    featured: a.featured,
    seo: a.seo,
  }));

  // Try to fetch from Supabase
  const supabase = getSupabaseAdmin();
  if (!supabase) return staticArticles;

  try {
    const { data, error } = await supabase
      .from(TABLES.ARTICLES)
      .select('*')
      .eq('saikiweb_locale', locale)
      .eq('saikiweb_published', true)
      .order('saikiweb_created_at', { ascending: false });

    if (error || !data || data.length === 0) return staticArticles;

    const dbArticles: ArticleData[] = data.map((row) => ({
      slug: row.saikiweb_slug,
      layout: (row.saikiweb_layout as ArticleLayout) || undefined,
      title: row.saikiweb_title,
      excerpt: row.saikiweb_excerpt,
      body: row.saikiweb_body,
      category: row.saikiweb_category,
      categoryKey: row.saikiweb_category_key,
      date: row.saikiweb_date,
      readTime: row.saikiweb_read_time,
      featured: row.saikiweb_featured,
      seo: {
        metaTitle: row.saikiweb_meta_title || undefined,
        metaDescription: row.saikiweb_meta_description || undefined,
        keywords: row.saikiweb_keywords || undefined,
      },
    }));

    // DB articles take priority; static articles fill in gaps
    const dbSlugs = new Set(dbArticles.map((a) => a.slug));
    const merged = [
      ...dbArticles,
      ...staticArticles.filter((a) => !dbSlugs.has(a.slug)),
    ];

    return merged;
  } catch {
    return staticArticles;
  }
}

/**
 * Get a single article by slug and locale.
 */
export async function getArticle(slug: string, locale: Locale): Promise<ArticleData | null> {
  // Check Supabase first
  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from(TABLES.ARTICLES)
        .select('*')
        .eq('saikiweb_slug', slug)
        .eq('saikiweb_locale', locale)
        .eq('saikiweb_published', true)
        .single();

      if (!error && data) {
        return {
          slug: data.saikiweb_slug,
          layout: (data.saikiweb_layout as ArticleLayout) || undefined,
          title: data.saikiweb_title,
          excerpt: data.saikiweb_excerpt,
          body: data.saikiweb_body,
          category: data.saikiweb_category,
          categoryKey: data.saikiweb_category_key,
          date: data.saikiweb_date,
          readTime: data.saikiweb_read_time,
          featured: data.saikiweb_featured,
          seo: {
            metaTitle: data.saikiweb_meta_title || undefined,
            metaDescription: data.saikiweb_meta_description || undefined,
            keywords: data.saikiweb_keywords || undefined,
          },
        };
      }
    } catch {
      // Fall through to static
    }
  }

  // Fallback to static content
  const staticInsights = getInsights(locale);
  const found = staticInsights.articles.find((a) => a.slug === slug);
  if (!found) return null;

  return {
    slug: found.slug,
    layout: found.layout,
    title: found.title,
    excerpt: found.excerpt,
    body: found.body,
    category: found.category,
    categoryKey: found.categoryKey,
    date: found.date,
    readTime: found.readTime,
    featured: found.featured,
    seo: found.seo,
  };
}
