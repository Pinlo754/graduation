"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SiteConfig } from "@/config/site";
import type { Guest } from "@/lib/types";
import { Backdrop } from "./Backdrop";
import { EnvelopeIntro, type IntroPhase } from "./EnvelopeIntro";
import { MusicProvider, useMusic } from "./music/MusicProvider";
import { MusicToggle } from "./music/MusicToggle";
import { TopNav } from "./TopNav";

interface InvitationShellProps {
  guest: Guest;
  config: SiteConfig;
  children: React.ReactNode;
  /** Server-rendered development reminder (renders nothing in production). */
  devBadge?: React.ReactNode;
}

// Envelope choreography (ms). Reduced-motion visitors get a near-instant version.
const TIMING = { reveal: 2300, done: 3300 };
const TIMING_REDUCED = { reveal: 50, done: 400 };

export function InvitationShell(props: InvitationShellProps) {
  return (
    <MusicProvider music={props.config.music}>
      <Shell {...props} />
    </MusicProvider>
  );
}

function Shell({ guest, config, children, devBadge }: InvitationShellProps) {
  const [phase, setPhase] = useState<IntroPhase>("closed");
  // `inert` is only applied after hydration so visitors without JavaScript can still use the page.
  const [hydrated, setHydrated] = useState(false);
  const { startFromGesture } = useMusic();
  const timers = useRef<number[]>([]);

  const open = useCallback(() => {
    if (phase !== "closed") return; // ignore double clicks mid-animation
    startFromGesture();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timing = reduced ? TIMING_REDUCED : TIMING;
    setPhase("opening");
    timers.current.push(
      window.setTimeout(() => setPhase("revealing"), timing.reveal),
      window.setTimeout(() => setPhase("open"), timing.done),
    );
  }, [phase, startFromGesture]);

  useEffect(() => {
    setHydrated(true);
    const pending = timers.current;
    return () => pending.forEach((id) => window.clearTimeout(id));
  }, []);

  // Lock page scroll while the envelope covers the screen. The envelope is the only focusable
  // element then (the page is inert), so Tab lands on it without stealing focus on load.
  useEffect(() => {
    const root = document.documentElement;
    if (phase === "closed" || phase === "opening") {
      root.classList.add("is-locked");
    } else {
      root.classList.remove("is-locked");
    }
    if (phase === "open") document.getElementById("welcome-title")?.focus({ preventScroll: true });
    return () => root.classList.remove("is-locked");
  }, [phase]);

  // One shared IntersectionObserver reveals [data-reveal] elements once, as they scroll into view.
  useEffect(() => {
    if (phase === "closed" || phase === "opening") return;
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)"));
    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [phase]);

  const isOpen = phase === "open" || phase === "revealing";

  return (
    <>
      <Backdrop />
      {phase !== "open" && <EnvelopeIntro guest={guest} config={config} phase={phase} onOpen={open} />}
      <div className={`page ${isOpen ? "page--open" : ""}`} inert={hydrated && !isOpen}>
        <a className="skip-link" href="#details">
          Đi tới thông tin buổi lễ
        </a>
        <TopNav name={config.graduate.displayName} />
        <main id="main">{children}</main>
        <footer className="footer">
          <p className="mono footer__exit">
            <span className="footer__prompt">$</span> exit 0 <span className="footer__ok">✓ graduated</span>
          </p>
          <p className="footer__made">
            Made with <span aria-label="tình yêu">♥</span>, cà phê và rất nhiều commit — {config.graduate.fullName} · {config.graduate.classOf}
          </p>
        </footer>
      </div>
      {isOpen && <MusicToggle />}
      {devBadge}
    </>
  );
}
