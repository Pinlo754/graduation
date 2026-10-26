"use client";

import type { SiteConfig } from "@/config/site";
import { getEventDateParts } from "@/lib/datetime";
import type { Guest } from "@/lib/types";
import { Sparkles, SparkleBurst } from "./Sparkles";
import { FloatingDecor } from "./FloatingDecor";
import { WaxSeal } from "./WaxSeal";

export type IntroPhase = "closed" | "opening" | "revealing" | "open";

interface EnvelopeIntroProps {
  guest: Guest;
  config: SiteConfig;
  phase: IntroPhase;
  onOpen: () => void;
}

export function EnvelopeIntro({ guest, config, phase, onOpen }: EnvelopeIntroProps) {
  const date = getEventDateParts(config.event.startsAt);
  const opened = phase !== "closed";

  return (
    <div className={`intro intro--${phase}`} role="dialog" aria-modal="true" aria-label={`Thiệp mời dành cho ${guest.name}`}>
      <div className="intro__glow" aria-hidden="true" />
      <Sparkles count={34} seed={42} className="intro__sparkles" />
      <FloatingDecor count={8} seed={9} className="intro__floaters" />

      <p className="intro__terminal mono" aria-hidden="true">
        <span className="intro__prompt">~/graduation $</span> open invitation --to=&quot;{guest.name}&quot;
        <span className="caret" />
      </p>

      <div className="intro__stage">
        <button
          type="button"
          className={`envelope ${opened ? "is-open" : ""}`}
          onClick={onOpen}
          disabled={opened}
          aria-label={`Mở thiệp mời dành cho ${guest.name}`}
        >
          <span className="envelope__back" />
          <span className="envelope__card">
            <span className="envelope__card-kicker mono">invitation.open()</span>
            <span className="envelope__card-title">You&rsquo;re Invited</span>
            <span className="envelope__card-name">{guest.name}</span>
            {date && (
              <span className="envelope__card-date mono">
                {date.day}.{date.month}.{date.year}
              </span>
            )}
          </span>
          <span className="envelope__front">
            <span className="envelope__to">
              <span className="mono envelope__label">to:</span>
              <span className="envelope__to-name">{guest.fullName}</span>
            </span>
            <span className="envelope__from mono">
              from: {config.graduate.fullName} · {config.graduate.major}
            </span>
            <span className="envelope__stamp" aria-hidden="true">
              <span className="mono">FPTU</span>
              <strong>{config.graduate.classOf}</strong>
              <span className="mono">SE</span>
            </span>
          </span>
          <span className="envelope__flap" />
          <span className="envelope__seal">
            <WaxSeal />
          </span>
        </button>
        {phase === "opening" && <SparkleBurst />}
      </div>

      <p className="intro__hint">
        <span className="intro__hint-dot" aria-hidden="true" />
        Chạm vào con dấu để mở thiệp
      </p>
      <p className="intro__sub mono" aria-hidden="true">
        {"// 1 new invitation · signed with love"}
      </p>
    </div>
  );
}
