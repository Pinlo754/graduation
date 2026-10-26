"use client";

import { useMusic } from "./MusicProvider";

/** Persistent vinyl-record music control — a nod to the "tap for music" record in the reference invite. */
export function MusicToggle() {
  const { status, source, toggle } = useMusic();
  const playing = status === "playing";
  const unavailable = status === "unavailable";
  const label = unavailable ? "Nhạc nền không khả dụng" : playing ? "Tạm dừng nhạc nền" : "Bật nhạc nền";

  return (
    <button
      type="button"
      className={`music ${playing ? "is-playing" : ""} ${unavailable ? "is-unavailable" : ""}`}
      onClick={toggle}
      aria-pressed={playing}
      aria-label={label}
      title={label}
      disabled={unavailable}
    >
      <span className="music__disc" aria-hidden="true">
        <span className="music__label">
          <span className="music__hole" />
        </span>
      </span>
      <span className="music__text mono" aria-hidden="true">
        {unavailable ? "no audio" : playing ? (source === "synth" ? "♪ music box" : "♪ now playing") : "tap for music"}
      </span>
      <span className="music__bars" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
    </button>
  );
}
