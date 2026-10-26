import type { SiteConfig } from "@/config/site";
import { getEventDateParts } from "@/lib/datetime";
import type { Guest } from "@/lib/types";
import { Countdown } from "../Countdown";
import { HeroPolaroid } from "../HeroPolaroid";
import { Sparkles } from "../Sparkles";

export function WelcomeSection({ guest, config }: { guest: Guest; config: SiteConfig }) {
  const date = getEventDateParts(config.event.startsAt, config.event.endsAt);
  const d = (n: number) => ({ "--d": n }) as React.CSSProperties;

  return (
    <section id="welcome" className="section welcome" aria-labelledby="welcome-title">
      <Sparkles count={18} seed={77} className="welcome__sparkles" />
      <div className="container welcome__grid">
        <div className="welcome__copy">
          <p className="welcome__eyebrow mono" data-reveal>
            <span className="pill">{config.graduate.university}</span>
            {config.hero.eyebrow}
          </p>
          <p className="welcome__dear" data-reveal style={d(1)}>
            Thân gửi <span className="welcome__name">{guest.name}</span>,
          </p>
          <h1 id="welcome-title" className="welcome__title" tabIndex={-1} data-reveal style={d(2)}>
            {config.hero.title},{" "}
            <span className="welcome__title-accent">{guest.name}!</span>
          </h1>
          <p className="welcome__subtitle" data-reveal style={d(3)}>
            {config.hero.subtitle}
          </p>
          {guest.personalMessage && (
            <blockquote className="welcome__note" data-reveal style={d(4)}>
              <span className="welcome__note-label mono">{`// note for ${guest.name}`}</span>
              <p>{guest.personalMessage}</p>
            </blockquote>
          )}
          <div className="welcome__actions" data-reveal style={d(5)}>
            <a className="btn btn--primary" href="#details">
              Xem chi tiết buổi lễ
              <span aria-hidden="true">→</span>
            </a>
            <a className="btn btn--ghost" href="#rsvp">
              Xác nhận tham dự
            </a>
          </div>
          {date && (
            <div className="welcome__meta" data-reveal style={d(6)}>
              <p className="mono welcome__meta-date">
                <span className="welcome__meta-key">date</span> {date.weekday}, {date.long}
              </p>
              <Countdown target={config.event.startsAt} compact />
            </div>
          )}
        </div>
        <HeroPolaroid config={config} />
      </div>
      <a className="scroll-cue mono" href="#story" aria-label="Cuộn xuống">
        <span>scroll</span>
        <span className="scroll-cue__line" aria-hidden="true" />
      </a>
    </section>
  );
}
