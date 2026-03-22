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
  contact: { id: 'kontak', en: 'contact' },
};

export function getLocalizedPath(routeKey: string, locale: Locale): string {
  const path = routeMap[routeKey]?.[locale] ?? routeKey;
  return `/${locale}${path ? `/${path}` : ''}`;
}

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

  // Fallback: just swap locale prefix
  return `/${targetLocale}/${currentSubPath}`;
}
