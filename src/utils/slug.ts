/**
 * Slug generation and validation utility for AhorraAI
 * Requirement: Short (4 characters), unique, lowercase alphanumeric, no accents or special symbols.
 * Production URL target: https://ahorraai.com/{slug}
 */

// Charset without visually confusing characters (omitted: 0, o, 1, l, i)
const SLUG_CHARSET = '23456789abcdefghjkmnpqrstuvwxyz';

/**
 * Generate a random short slug of specified length (default 4 characters)
 * Examples: 'm7k2', 'p3x8', 'v9f2'
 */
export function generateShortSlug(length: number = 4): string {
  let result = '';
  const charsetLength = SLUG_CHARSET.length;
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charsetLength);
    result += SLUG_CHARSET[randomIndex];
  }
  return result;
}

/**
 * Sanitize a user-provided slug:
 * - Lowercase
 * - Remove accents & diacritics
 * - Replace spaces with empty string
 * - Strip any characters outside [a-z0-9]
 * - Max length 20
 */
export function sanitizeSlug(raw: string): string {
  if (!raw) return '';
  return raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 20);
}

/**
 * Reserved slugs that cannot be used for businesses to prevent collision with app routes
 */
export const RESERVED_SLUGS = new Set([
  'admin',
  'api',
  'assets',
  'catalogo',
  'como-funciona',
  'tecnologia',
  'contacto-custom',
  'login',
  'auth',
  'dashboard',
  'settings',
  'index',
  'public',
]);

/**
 * Check if a candidate slug is valid (not reserved, length >= 3, alphanumeric)
 */
export function isValidSlugFormat(slug: string): boolean {
  if (!slug || slug.length < 3 || slug.length > 20) return false;
  if (RESERVED_SLUGS.has(slug.toLowerCase())) return false;
  return /^[a-z0-9]+$/.test(slug);
}

/**
 * Get the official production NFC URL
 */
export function getBusinessPublicUrl(slug: string): string {
  const clean = sanitizeSlug(slug);
  return `https://ahorraai.com/${clean}`;
}

/**
 * Copy text to clipboard with modern API and reliable fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator?.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to fallback
    }
  }

  // Fallback for older webviews or restricted contexts
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    return successful;
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    return false;
  }
}
