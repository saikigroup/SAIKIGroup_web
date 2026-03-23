import { MetadataRoute } from 'next';
import { locales, routeMap, type Locale } from '@/lib/i18n';
import { getArticles } from '@/lib/articles';
import { getAllProjectSlugs } from '@/content/projects';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://saiki.id';

  const pages: MetadataRoute.Sitemap = [];

  // Static pages
  for (const [routeKey, paths] of Object.entries(routeMap)) {
    for (const locale of locales) {
      const path = paths[locale];
      pages.push({
        url: `${baseUrl}/${locale}${path ? `/${path}` : ''}`,
        lastModified: new Date(),
        changeFrequency: routeKey === 'home' ? 'weekly' : 'monthly',
        priority: routeKey === 'home' ? 1 : routeKey === 'services' ? 0.9 : 0.8,
      });
    }
  }

  // Dynamic project detail pages
  const projectSlugs = getAllProjectSlugs();
  for (const slug of projectSlugs) {
    for (const locale of locales) {
      const subPath = locale === 'id' ? 'proyek' : 'projects';
      pages.push({
        url: `${baseUrl}/${locale}/${subPath}/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  // Dynamic article pages
  for (const locale of locales) {
    try {
      const articles = await getArticles(locale as Locale);
      for (const article of articles) {
        pages.push({
          url: `${baseUrl}/${locale}/insights/${article.slug}`,
          lastModified: article.date ? new Date(article.date) : new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      }
    } catch {
      // Continue without articles if fetch fails
    }
  }

  return pages;
}
