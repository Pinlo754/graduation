/** Absolute base URL for metadata. Prefers NEXT_PUBLIC_SITE_URL, then Vercel's URL, then localhost. */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
