import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale, isValidLocale } from '@/lib/i18n';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files and api routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/icons') ||
    pathname.includes('.') // static files
  ) {
    return NextResponse.next();
  }

  // Check if pathname already has a locale
  const segments = pathname.split('/');
  const firstSegment = segments[1];

  if (isValidLocale(firstSegment)) {
    return NextResponse.next();
  }

  // Redirect to default locale
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images|icons|docs).*)'],
};
