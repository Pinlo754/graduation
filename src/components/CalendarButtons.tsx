"use client";

import { buildIcs, googleCalendarUrl, type CalendarEvent } from "@/lib/calendar";

export function CalendarButtons({ event, uid }: { event: CalendarEvent; uid: string }) {
  const downloadIcs = () => {
    const blob = new Blob([buildIcs(event, uid)], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "le-tot-nghiep.ics";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <>
      <a className="btn btn--ghost" href={googleCalendarUrl(event)} target="_blank" rel="noopener noreferrer">
        <CalendarIcon /> Google Calendar
      </a>
      <button type="button" className="btn btn--ghost" onClick={downloadIcs}>
        <CalendarIcon /> Tải file .ics
      </button>
    </>
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
