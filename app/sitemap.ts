import { MetadataRoute } from 'next';
import { locales, routeMap } from '@/lib/i18n';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://saiki.id';

  const pages: MetadataRoute.Sitemap = [];

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

  return pages;
}
