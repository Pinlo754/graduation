import type { SiteConfig } from "@/config/site";
import { getEventDateParts } from "@/lib/datetime";
import { mapsHref } from "@/lib/maps";
import { seededRandom } from "@/lib/random";
import type { Guest } from "@/lib/types";
import { CalendarButtons } from "../CalendarButtons";
import { Countdown } from "../Countdown";
import { SectionHeading } from "../SectionHeading";

const d = (n: number) => ({ "--d": n }) as React.CSSProperties;

export function DetailsSection({ guest, config }: { guest: Guest; config: SiteConfig }) {
  const { event } = config;
  const date = getEventDateParts(event.startsAt, event.endsAt);
  const maps = mapsHref(event);
  const fields = [
    date && { key: "time", label: "Thời gian", value: date.endTime ? `${date.startTime} – ${date.endTime}` : date.startTime },
    event.venue && { key: "venue", label: "Địa điểm", value: event.venue },
    event.address && { key: "address", label: "Địa chỉ", value: event.address },
    event.dressCode && { key: "dress", label: "Dress code", value: event.dressCode },
  ].filter(Boolean) as { key: string; label: string; value: string }[];

  return (
    <section id="details" className="section details" aria-labelledby="details-title">
      <div className="container">
        <SectionHeading
          index="03"
          kicker="event.details"
          id="details-title"
          title="Thông tin buổi lễ"
          lead={`${guest.name} đã có tên trong danh sách khách mời — đây là tấm vé của bạn.`}
          align="center"
        />

        <div className="ticket-wrap" data-reveal>
        <article className="ticket" aria-label={event.title}>
          <div className="ticket__main">
            <p className="ticket__event mono">{event.title}</p>
            {date ? (
              <div className="ticket__date">
                <span className="ticket__day">{date.day}</span>
                <span className="ticket__month-year">
                  <span className="ticket__weekday">{date.weekday}</span>
                  <span className="mono">
                    Tháng {date.month} · {date.year}
                  </span>
                </span>
              </div>
            ) : (
              <p className="ticket__tba">Ngày giờ sẽ được thông báo sớm</p>
            )}
            {fields.length > 0 && (
              <dl className="ticket__fields">
                {fields.map((field, i) => (
                  <div key={field.key} className={`ticket__field ticket__field--${field.key}`} data-reveal style={d(i + 1)}>
                    <dt className="mono">{field.label}</dt>
                    <dd>{field.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {event.note && <p className="ticket__note">{event.note}</p>}
          </div>
          <div className="ticket__stub" aria-label="Cuống vé">
            <p className="mono ticket__admit">ADMIT ONE</p>
            <p className="ticket__guest">{guest.fullName}</p>
            <p className="mono ticket__no">No. {guest.id}</p>
            <Barcode seed={guest.id} />
          </div>
        </article>
        </div>

        <div className="details__actions" data-reveal style={d(2)}>
          {maps && (
            <a className="btn btn--ghost" href={maps} target="_blank" rel="noopener noreferrer">
              <PinIcon /> Mở Google Maps
            </a>
          )}
          {event.startsAt && (
            <CalendarButtons
              event={{
                title: event.title,
                startsAt: event.startsAt,
                endsAt: event.endsAt,
                location: [event.venue, event.address].filter(Boolean).join(", ") || undefined,
                details: `Lễ tốt nghiệp của ${config.graduate.fullName}.`,
              }}
              uid={`graduation-${guest.id}@invite`}
            />
          )}
        </div>

        {event.startsAt && (
          <div className="details__countdown" data-reveal style={d(3)}>
            <p className="mono details__countdown-label">
              <span className="details__countdown-prompt">$</span> countdown --until ceremony
            </p>
            <Countdown target={event.startsAt} />
          </div>
        )}
      </div>
    </section>
  );
}

/** Decorative barcode, stable per guest id. */
function Barcode({ seed }: { seed: string }) {
  const random = seededRandom([...seed].reduce((acc, ch) => acc * 31 + ch.charCodeAt(0), 7));
  let x = 0;
  const bars: { x: number; w: number }[] = [];
  while (x < 116) {
    const w = 1 + Math.floor(random() * 3);
    bars.push({ x, w });
    x += w + 1 + Math.floor(random() * 2);
  }
  return (
    <svg className="barcode" viewBox="0 0 120 34" aria-hidden="true" preserveAspectRatio="none">
      {bars.map((bar) => (
        <rect key={bar.x} x={bar.x} y="0" width={bar.w} height="34" fill="currentColor" />
      ))}
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}
