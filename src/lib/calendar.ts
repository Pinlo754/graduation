export interface CalendarEvent {
  title: string;
  startsAt: string;
  endsAt?: string;
  location?: string;
  details?: string;
}

/** 20261220T010000Z — UTC basic format used by Google Calendar and iCalendar. */
export function toUtcStamp(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
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

function escapeIcs(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/([,;])/g, "\\$1");
}

export function buildIcs(event: CalendarEvent, uid: string, now: Date = new Date()): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//graduation-invitation//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${toUtcStamp(now.toISOString())}`,
    `DTSTART:${toUtcStamp(event.startsAt)}`,
    `DTEND:${toUtcStamp(resolveEnd(event))}`,
    `SUMMARY:${escapeIcs(event.title)}`,
    event.location ? `LOCATION:${escapeIcs(event.location)}` : "",
    event.details ? `DESCRIPTION:${escapeIcs(event.details)}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);
  return lines.join("\r\n");
}
