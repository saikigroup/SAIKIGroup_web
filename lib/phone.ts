/**
 * Normalize any Indonesian phone number format to international digits (62xxx).
 * Handles: 0877..., +62877..., 62877..., 877..., 62-877-..., 0877 8898 0088, etc.
 * Returns digits-only string starting with 62, or empty string if invalid.
 */
export function normalizePhoneToWA(raw: string): string {
  // Strip everything except digits and leading +
  const cleaned = raw.replace(/[^\d+]/g, '');
  // Remove leading + if present
  const digits = cleaned.replace(/^\+/, '');

  if (digits.length < 8) return '';

  // Already starts with 62
  if (digits.startsWith('62')) return digits;

  // Starts with 0 (local format: 0877...)
  if (digits.startsWith('0')) return '62' + digits.slice(1);

  // Starts with 8 (bare number: 877...)
  if (digits.startsWith('8')) return '62' + digits;

  // Fallback: return as-is (non-Indonesian or already international)
  return digits;
}

/**
 * Build a wa.me URL from any phone input format.
 * Returns null if phone is empty/invalid.
 */
export function buildWhatsAppURL(phone: string | null | undefined): string | null {
  if (!phone) return null;
  const normalized = normalizePhoneToWA(phone);
  if (!normalized) return null;
  return `https://wa.me/${normalized}`;
}
