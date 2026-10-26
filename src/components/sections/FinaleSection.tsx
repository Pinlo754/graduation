import type { SiteConfig } from "@/config/site";
import { formatDeadline, getEventDateParts } from "@/lib/datetime";
import type { Guest } from "@/lib/types";
import { RsvpForm } from "../RsvpForm";
import { Sparkles } from "../Sparkles";
import { WaxSeal } from "../WaxSeal";

const d = (n: number) => ({ "--d": n }) as React.CSSProperties;

export function FinaleSection({ guest, config, rsvpOpen }: { guest: Guest; config: SiteConfig; rsvpOpen: boolean }) {
  const date = getEventDateParts(config.event.startsAt, config.event.endsAt);
  const deadline = formatDeadline(config.rsvp.deadline);
  const chips = [
    date && `${date.weekday}, ${date.day}/${date.month}/${date.year}`,
    date && (date.endTime ? `${date.startTime} – ${date.endTime}` : date.startTime),
    config.event.venue,
  ].filter(Boolean) as string[];

  return (
    <section id="rsvp" className="section finale" aria-labelledby="finale-title">
      <Sparkles count={22} seed={99} className="finale__sparkles" />
      <div className="container container--narrow finale__inner">
        <span className="finale__seal" data-reveal aria-hidden="true">
          <WaxSeal />
        </span>
        <p className="finale__kicker mono" data-reveal style={d(1)}>
          {'06 — git commit -m "see you there"'}
        </p>
        <h2 id="finale-title" className="finale__title" data-reveal style={d(2)}>
          {config.finale.title}
        </h2>
        <p className="finale__body" data-reveal style={d(3)}>
          {config.finale.body}
        </p>
        {chips.length > 0 && (
          <ul className="finale__chips" data-reveal style={d(4)}>
            {chips.map((chip) => (
              <li key={chip}>{chip}</li>
            ))}
          </ul>
        )}

        <div className="rsvp" data-reveal style={d(5)}>
          {rsvpOpen ? (
            <>
              <p className="rsvp__title">
                {guest.name} có thể đến chung vui không?
                {deadline && <span className="rsvp__deadline mono">{`// phản hồi trước ${deadline}`}</span>}
              </p>
              <RsvpForm guestId={guest.id} guestName={guest.name} />
            </>
          ) : (
            <div className="rsvp__offline">
              <p className="rsvp__title">Xác nhận tham dự</p>
              <p>Nhắn trực tiếp cho mình để mình xếp thời gian cho {guest.name} nhé!!!</p>
            </div>
          )}
          {config.contacts.length > 0 && (
            <ul className="rsvp__contacts">
              {config.contacts.map((contact) => (
                <li key={contact.href}>
                  <a className="btn btn--ghost btn--sm" href={contact.href} target="_blank" rel="noopener noreferrer">
                    {contact.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
