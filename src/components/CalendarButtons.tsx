import { googleCalendarUrl, type CalendarEvent } from "@/lib/calendar";

export function CalendarButtons({ event }: { event: CalendarEvent }) {
  return (
    <a className="btn btn--ghost" href={googleCalendarUrl(event)} target="_blank" rel="noopener noreferrer">
      <CalendarIcon /> Google Calendar
    </a>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </svg>
  );
}
