// Kept free of path aliases: next.config.ts imports this file directly.
// scripts/guests.mjs carries a copy of slugify — keep the two in sync.

/** Lowercase letters, digits and single dashes, e.g. "em-be-thu-ky". */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const SLUG_MAX = 60;

/** "Em bé Thư Kỳ" → "em-be-thu-ky", "Đạt Tới" → "dat-toi". */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, SLUG_MAX)
    .replace(/-+$/, "");
}

export function isValidSlug(value: unknown): value is string {
  return typeof value === "string" && value.length <= SLUG_MAX && SLUG_PATTERN.test(value);
}
