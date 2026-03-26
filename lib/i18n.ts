export const locales = ['id', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'id';

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export function getLocaleFromPath(pathname: string): Locale {
  const segments = pathname.split('/');
  const locale = segments[1];
  return isValidLocale(locale) ? locale : defaultLocale;
}

export const localeNames: Record<Locale, string> = {
  id: 'ID',
  en: 'EN',
};

export const localeLabels: Record<Locale, string> = {
  id: 'Bahasa Indonesia',
  en: 'English',
};

// Route mappings for bilingual URL structure
export const routeMap: Record<string, Record<Locale, string>> = {
  home: { id: '', en: '' },
  about: { id: 'tentang', en: 'about' },
  services: { id: 'layanan', en: 'services' },
  consultancy: { id: 'layanan/consultancy', en: 'services/consultancy' },
  imagery: { id: 'layanan/imagery', en: 'services/imagery' },
  technology: { id: 'layanan/technology', en: 'services/technology' },
  insights: { id: 'insights', en: 'insights' },
  projects: { id: 'proyek', en: 'projects' },
  contact: { id: 'kontak', en: 'contact' },
  privacy: { id: 'privacy-policy', en: 'privacy-policy' },
  terms: { id: 'terms', en: 'terms' },
};

export function getLocalizedPath(routeKey: string, locale: Locale): string {
  const path = routeMap[routeKey]?.[locale] ?? routeKey;
  return `/${locale}${path ? `/${path}` : ''}`;
}

// Article slug mappings between locales (ID slug <-> EN slug)
// Each pair maps slugs that represent the same article in different languages
export const articleSlugMap: Array<{ id: string; en: string }> = [
  { id: 'mengapa-personal-branding-penting', en: 'why-personal-branding-matters' },
  { id: 'brand-identity-bukan-logo', en: 'brand-identity-is-not-a-logo' },
  { id: 'custom-vs-off-the-shelf', en: 'custom-vs-off-the-shelf' },
];

export function switchLocale(currentPath: string, targetLocale: Locale): string {
  const segments = currentPath.split('/').filter(Boolean);
  const currentLocale = segments[0];

  if (!isValidLocale(currentLocale)) {
    return `/${targetLocale}`;
  }

  // Find current route key
  const currentSubPath = segments.slice(1).join('/');

  for (const [key, paths] of Object.entries(routeMap)) {
    if (paths[currentLocale as Locale] === currentSubPath) {
      return getLocalizedPath(key, targetLocale);
    }
  }

  // Handle project slug switching: /locale/proyek/slug <-> /locale/projects/slug
  const projectPrefixes: Record<string, string> = { proyek: 'projects', projects: 'proyek' };
  for (const [fromPrefix, toPrefix] of Object.entries(projectPrefixes)) {
    if (currentSubPath.startsWith(`${fromPrefix}/`)) {
      const slug = currentSubPath.replace(`${fromPrefix}/`, '');
      const targetPrefix = targetLocale === 'id' ? 'proyek' : 'projects';
      return `/${targetLocale}/${targetPrefix}/${slug}`;
    }
  }

  // Handle article slug switching: /locale/insights/slug
  if (currentSubPath.startsWith('insights/')) {
    const currentSlug = currentSubPath.replace('insights/', '');
    const fromLocale = currentLocale as Locale;
    // Check static slug map first
    const mapping = articleSlugMap.find((m) => m[fromLocale] === currentSlug);
    if (mapping) {
      return `/${targetLocale}/insights/${mapping[targetLocale]}`;
    }
    // For dynamic (Supabase) articles, keep the slug — the server will
    // look up the correct slug via translation_slug and redirect
    return `/${targetLocale}/insights/${currentSlug}`;
  }

  // Fallback: just swap locale prefix
  return `/${targetLocale}/${currentSubPath}`;
}
