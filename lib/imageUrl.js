const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://tatacookies.com";

/**
 * Resolve a product image_url to an absolute URL suitable for emails.
 * - Absolute URLs (e.g. Supabase Storage from admin uploads) are returned as-is.
 * - Relative paths (e.g. "/images/cookies/foo.webp") are prefixed with the site URL.
 * Returns null when there is no image.
 */
export function absoluteImageUrl(imageUrl) {
  if (!imageUrl) return null;
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  return `${SITE_URL}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
}
