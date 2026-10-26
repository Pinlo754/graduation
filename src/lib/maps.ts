import type { SiteConfig } from "@/config/site";

/** Explicit mapsUrl wins; otherwise build a Google Maps search from venue + address. */
export function mapsHref(event: Pick<SiteConfig["event"], "mapsUrl" | "venue" | "address">): string | undefined {
  if (event.mapsUrl) return event.mapsUrl;
  const query = [event.venue, event.address].filter(Boolean).join(", ");
  return query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` : undefined;
}
