"use client";

import { useEffect, useState } from "react";
import { getCountdown } from "@/lib/datetime";

const pad = (n: number) => String(n).padStart(2, "0");

/** Live countdown to the ceremony. Renders nothing until mounted to avoid a server/client time mismatch. */
export function Countdown({ target, compact = false }: { target?: string; compact?: boolean }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const countdown = now === null ? undefined : getCountdown(target, now);
  if (!target) return null;

  if (compact) {
    return (
      <p className="countdown-inline mono" aria-live="off">
        <span className="countdown-inline__key">deploy in</span>{" "}
        {countdown ? (
          countdown.done ? (
            <span>đã diễn ra ✓</span>
          ) : (
            <span>
              {countdown.days}d {pad(countdown.hours)}:{pad(countdown.minutes)}:{pad(countdown.seconds)}
            </span>
          )
        ) : (
          <span className="countdown-inline__loading">--d --:--:--</span>
        )}
      </p>
    );
  }

  const units: [string, number | undefined][] = [
    ["ngày", countdown?.days],
    ["giờ", countdown?.hours],
    ["phút", countdown?.minutes],
    ["giây", countdown?.seconds],
  ];

  if (countdown?.done) {
    return <p className="countdown__done mono">{"// buổi lễ đã diễn ra — cảm ơn bạn rất nhiều!"}</p>;
  }

  return (
    <div className="countdown" role="timer" aria-label="Thời gian còn lại đến buổi lễ">
      {units.map(([label, value]) => (
        <div className="countdown__cell" key={label}>
          <span className="countdown__value">{value === undefined ? "--" : pad(value)}</span>
          <span className="countdown__label mono">{label}</span>
        </div>
      ))}
    </div>
  );
}
