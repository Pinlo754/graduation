import { describe, expect, it } from "vitest";
import { buildIcs, googleCalendarUrl, toUtcStamp } from "./calendar";
import { getCountdown, getEventDateParts } from "./datetime";
import { mapsHref } from "./maps";
import { parseRsvpPayload } from "./rsvp";

describe("event date formatting (Asia/Ho_Chi_Minh)", () => {
  it("computes weekday and times in Vietnam time", () => {
    const parts = getEventDateParts("2026-12-20T08:00:00+07:00", "2026-12-20T11:30:00+07:00");
    expect(parts).toMatchObject({ day: "20", month: "12", year: "2026", weekday: "Chủ Nhật", startTime: "08:00", endTime: "11:30" });
  });

  it("uses Vietnam's date even when UTC is still the previous day", () => {
    expect(getEventDateParts("2026-12-21T06:00:00+07:00")?.weekday).toBe("Thứ Hai"); // 23:00 UTC on the 20th
  });

  it("hides the end time when it is missing or invalid", () => {
    expect(getEventDateParts("2026-12-20T08:00:00+07:00")?.endTime).toBeUndefined();
    expect(getEventDateParts("2026-12-20T08:00:00+07:00", "2026-12-20T07:00:00+07:00")?.endTime).toBeUndefined();
  });

  it("returns undefined for missing or garbage dates", () => {
    expect(getEventDateParts(undefined)).toBeUndefined();
    expect(getEventDateParts("not a date")).toBeUndefined();
  });

  it("counts down and stops at zero", () => {
    const target = "2026-12-20T08:00:00+07:00";
    const t = new Date(target).getTime();
    expect(getCountdown(target, t - (2 * 86400 + 3 * 3600 + 4 * 60 + 5) * 1000)).toMatchObject({ days: 2, hours: 3, minutes: 4, seconds: 5, done: false });
    expect(getCountdown(target, t + 1000)).toMatchObject({ days: 0, done: true });
  });
});

describe("calendar links", () => {
  const event = { title: "Lễ Tốt Nghiệp", startsAt: "2026-12-20T08:00:00+07:00", endsAt: "2026-12-20T11:30:00+07:00", location: "Hà Nội, Việt Nam" };

  it("converts to UTC stamps", () => {
    expect(toUtcStamp(event.startsAt)).toBe("20261220T010000Z");
  });

  it("builds a Google Calendar template URL", () => {
    const url = new URL(googleCalendarUrl(event));
    expect(url.searchParams.get("dates")).toBe("20261220T010000Z/20261220T043000Z");
    expect(url.searchParams.get("text")).toBe("Lễ Tốt Nghiệp");
  });

  it("builds an escaped .ics file", () => {
    const ics = buildIcs(event, "uid-1", new Date("2026-01-01T00:00:00Z"));
    expect(ics).toContain("DTSTART:20261220T010000Z");
    expect(ics).toContain("LOCATION:Hà Nội\\, Việt Nam");
    expect(ics.split("\r\n")[0]).toBe("BEGIN:VCALENDAR");
  });
});

describe("maps link", () => {
  it("prefers an explicit URL, else searches venue + address, else nothing", () => {
    expect(mapsHref({ mapsUrl: "https://maps.app.goo.gl/x" })).toBe("https://maps.app.goo.gl/x");
    expect(mapsHref({ venue: "Hall A", address: "Hòa Lạc" })).toContain(encodeURIComponent("Hall A, Hòa Lạc"));
    expect(mapsHref({})).toBeUndefined();
  });
});

describe("RSVP payload validation", () => {
  it("accepts a valid payload and trims the note", () => {
    expect(parseRsvpPayload({ id: "001", status: "attending", note: "  hẹn gặp  " })).toEqual({ ok: true, value: { id: "001", status: "attending", note: "hẹn gặp" } });
  });

  it("rejects unknown statuses, long notes and junk", () => {
    expect(parseRsvpPayload({ id: "001", status: "yes" }).ok).toBe(false);
    expect(parseRsvpPayload({ id: "001", status: "maybe", note: "x".repeat(301) }).ok).toBe(false);
    expect(parseRsvpPayload(null).ok).toBe(false);
    expect(parseRsvpPayload({ status: "maybe" }).ok).toBe(false);
  });
});
