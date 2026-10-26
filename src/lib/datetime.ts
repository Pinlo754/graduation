export const EVENT_TIME_ZONE = "Asia/Ho_Chi_Minh";

function parse(iso?: string): Date | undefined {
  if (!iso) return undefined;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export interface EventDateParts {
  day: string;
  month: string;
  year: string;
  /** "Chủ Nhật", "Thứ Hai", … */
  weekday: string;
  /** "20 tháng 12, 2026" */
  long: string;
  /** "08:00" */
  startTime: string;
  endTime?: string;
}

export function getEventDateParts(startsAt?: string, endsAt?: string): EventDateParts | undefined {
  const start = parse(startsAt);
  if (!start) return undefined;
  const part = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("vi-VN", { timeZone: EVENT_TIME_ZONE, ...options }).format(start);
  const time = (date: Date) =>
    new Intl.DateTimeFormat("vi-VN", { timeZone: EVENT_TIME_ZONE, hour: "2-digit", minute: "2-digit", hour12: false }).format(date);
  const weekday = part({ weekday: "long" });
  const end = parse(endsAt);
  return {
    day: part({ day: "2-digit" }),
    month: part({ month: "2-digit" }),
    year: part({ year: "numeric" }),
    weekday: weekday
      .split(" ")
      .map((word) => word.charAt(0).toLocaleUpperCase("vi-VN") + word.slice(1))
      .join(" "),
    long: part({ day: "numeric", month: "long", year: "numeric" }),
    startTime: time(start),
    endTime: end && end > start ? time(end) : undefined,
  };
}

export function formatDeadline(isoDate?: string): string | undefined {
  if (!isoDate) return undefined;
  const date = parse(`${isoDate}T12:00:00+07:00`);
  if (!date) return undefined;
  return new Intl.DateTimeFormat("vi-VN", { timeZone: EVENT_TIME_ZONE, day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
}

export function getCountdown(targetIso: string | undefined, now: number): Countdown | undefined {
  const target = parse(targetIso);
  if (!target) return undefined;
  const diff = Math.max(0, target.getTime() - now);
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    done: diff === 0,
  };
}
