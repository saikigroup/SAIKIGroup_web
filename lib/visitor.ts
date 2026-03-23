/**
 * Cookie-based visitor identification.
 * Sets a first-party cookie (saiki_vid) with a unique visitor ID.
 * Persists for 365 days - survives incognito detection, localStorage clears, etc.
 */

const COOKIE_NAME = 'saiki_vid';
const COOKIE_DAYS = 365;

function generateId(): string {
  // Compact unique ID: timestamp base36 + random base36
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).substring(2, 8);
  return `${ts}-${rand}`;
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days: number): void {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

/**
 * Get or create a persistent visitor ID via cookie.
 * Call on every page load to refresh the expiry.
 */
export function ensureVisitorId(): string {
  const existing = getCookie(COOKIE_NAME);
  if (existing) {
    // Refresh expiry on every visit
    setCookie(COOKIE_NAME, existing, COOKIE_DAYS);
    return existing;
  }

  const id = generateId();
  setCookie(COOKIE_NAME, id, COOKIE_DAYS);
  return id;
}

/**
 * Get the current visitor ID without creating one.
 */
export function getVisitorId(): string | null {
  return getCookie(COOKIE_NAME);
}
