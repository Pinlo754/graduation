"use client";

import Image from "next/image";
import { useState } from "react";
import type { SiteConfig } from "@/config/site";
import { useMusic } from "./music/MusicProvider";
import { WaxSeal } from "./WaxSeal";

/** Polaroid portrait tucked into an envelope pocket with a spinning record — the hero's visual anchor. */
export function HeroPolaroid({ config }: { config: SiteConfig }) {
  const [failed, setFailed] = useState(false);
  const { status, toggle } = useMusic();
  const portrait = !failed ? config.graduate.portrait : undefined;
  const playing = status === "playing";

  return (
    <div className="hero-art" data-reveal style={{ "--d": 3 } as React.CSSProperties}>
      <div className="hero-art__halo" aria-hidden="true" />
      <button
        type="button"
        className={`hero-art__record ${playing ? "is-playing" : ""}`}
        onClick={toggle}
        aria-label={playing ? "Tạm dừng nhạc nền" : "Bật nhạc nền"}
        aria-pressed={playing}
        disabled={status === "unavailable"}
      >
        <span className="hero-art__record-label mono">{playing ? "playing" : "tap for music"}</span>
      </button>
      <figure className="polaroid">
        <div className="polaroid__photo">
          {portrait ? (
            <Image
              src={portrait}
              alt={`Ảnh tốt nghiệp của ${config.graduate.fullName}`}
              fill
              priority
              sizes="(max-width: 768px) 70vw, 360px"
              onError={() => setFailed(true)}
            />
          ) : (
            <div className="polaroid__placeholder">
              <svg viewBox="0 0 48 48" aria-hidden="true">
                <path d="M24 9 3 18l21 9 21-9z" fill="currentColor" />
                <path d="M12 22v8c0 3 5.5 6 12 6s12-3 12-6v-8l-12 5z" fill="currentColor" opacity=".6" />
              </svg>
              <span className="mono">portrait.jpg</span>
              <span className="polaroid__placeholder-hint">Ảnh chân dung sẽ được cập nhật</span>
            </div>
          )}
        </div>
        <figcaption className="polaroid__caption">
          <span className="polaroid__caption-script">Class of {config.graduate.classOf}</span>
          <span className="mono">{config.graduate.major}</span>
        </figcaption>
        <span className="polaroid__tape" aria-hidden="true" />
      </figure>
      <div className="hero-art__pocket" aria-hidden="true">
        <span className="hero-art__pocket-card">
          You&rsquo;re
          <br />
          Invited
        </span>
      </div>
      <span className="hero-art__seal" aria-hidden="true">
        <WaxSeal />
      </span>
    </div>
  );
}
