export interface CalendarEvent {
  title: string;
  startsAt: string;
  endsAt?: string;
  location?: string;
  details?: string;
}

/** 20261220T010000Z — UTC basic format used by Google Calendar. */
export function toUtcStamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date "${iso}" in src/config/site.ts — use YYYY-MM-DDTHH:mm:ss+07:00, e.g. "2026-11-07T10:00:00+07:00"`);
  }
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function resolveEnd(event: CalendarEvent): string {
  if (event.endsAt) return event.endsAt;
  return new Date(new Date(event.startsAt).getTime() + 2 * 60 * 60 * 1000).toISOString();
}

export function googleCalendarUrl(event: CalendarEvent): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${toUtcStamp(event.startsAt)}/${toUtcStamp(resolveEnd(event))}`,
    ctz: "Asia/Ho_Chi_Minh",
  });
  if (event.location) params.set("location", event.location);
  if (event.details) params.set("details", event.details);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
