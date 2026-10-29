import { describe, expect, it } from "vitest";
import { siteConfig } from "./site";

// Strict on purpose: "2026-11-07T1:00:00+07:00" (one-digit hour) breaks the production build.
const ISO_WITH_OFFSET = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?\+07:00$/;

describe("event dates in site.ts", () => {
  const { startsAt, endsAt } = siteConfig.event;

  it.each([
    ["startsAt", startsAt],
    ["endsAt", endsAt],
  ])("%s uses YYYY-MM-DDTHH:mm:ss+07:00", (_, value) => {
    if (value === undefined) return;
    expect(value, `"${value}" — giờ phải đủ 2 chữ số, ví dụ "2026-11-07T10:00:00+07:00"`).toMatch(ISO_WITH_OFFSET);
    expect(Number.isNaN(new Date(value).getTime())).toBe(false);
  });

  it("ends after it starts, on the same day", () => {
    if (!startsAt || !endsAt) return;
    expect(new Date(endsAt).getTime()).toBeGreaterThan(new Date(startsAt).getTime());
    expect(endsAt.slice(0, 10), "endsAt khác ngày với startsAt").toBe(startsAt.slice(0, 10));
  });

  it("RSVP deadline is a valid YYYY-MM-DD", () => {
    const { deadline } = siteConfig.rsvp;
    if (deadline) expect(deadline).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
