import { MetadataRoute } from 'next';
import { getSeoConfig } from '@/lib/seo-config';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const config = await getSeoConfig();
  const baseUrl = config.global.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://saiki.id';
  const disallow = config.robots.disallow.length > 0
    ? config.robots.disallow
    : ['/api/', '/_next/', '/admin/'];

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow,
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
