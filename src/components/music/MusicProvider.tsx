"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { SiteConfig } from "@/config/site";
import { MusicBox } from "@/lib/music-box";

export type MusicStatus = "idle" | "playing" | "paused" | "unavailable";

interface MusicContextValue {
  status: MusicStatus;
  /** "file" when the configured track plays, "synth" for the generated fallback. */
  source: "file" | "synth" | null;
  /** Start from a user gesture, unless the visitor paused music themselves. */
  startFromGesture: () => void;
  toggle: () => void;
}

const MusicContext = createContext<MusicContextValue | null>(null);

export function useMusic(): MusicContextValue {
  const value = useContext(MusicContext);
  if (!value) throw new Error("useMusic must be used inside <MusicProvider>");
  return value;
}

export function MusicProvider({ music, children }: { music: SiteConfig["music"]; children: React.ReactNode }) {
  const [status, setStatus] = useState<MusicStatus>("idle");
  const [source, setSource] = useState<"file" | "synth" | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthRef = useRef<MusicBox | null>(null);
  const fileOk = useRef<boolean | null>(null); // null = unknown yet
  const userPaused = useRef(false);
  const statusRef = useRef<MusicStatus>("idle");
  const sourceRef = useRef<"file" | "synth" | null>(null);

  const update = useCallback((next: MusicStatus, nextSource: "file" | "synth" | null) => {
    statusRef.current = next;
    sourceRef.current = nextSource;
    setStatus(next);
    setSource(nextSource);
  }, []);

  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = Math.min(1, Math.max(0, music.volume));
    const onError = () => {
      fileOk.current = false;
    };
    audio.addEventListener("error", onError);
    audioRef.current = audio;
    synthRef.current = new MusicBox(music.volume);

    let cancelled = false;
    // Some browsers allow sound autoplay for returning visitors; try once, quietly.
    fetch(music.src, { method: "HEAD" })
      .then((response) => {
        if (cancelled) return;
        fileOk.current = response.ok;
        // Only attach the source once we know it exists, so a missing file costs one request.
        // If the guest already opened the invitation, play() has taken over — don't start twice.
        if (!response.ok || audio.getAttribute("src") || statusRef.current === "playing") return;
        audio.src = music.src;
        audio.play().then(
          () => !cancelled && !userPaused.current && update("playing", "file"),
          () => {
            /* blocked by autoplay policy — wait for the invitation click */
          },
        );
      })
      .catch(() => {
        if (!cancelled) fileOk.current = false;
      });

    const onVisibility = () => {
      // The synth's scheduler is throttled in background tabs; pause it rather than let it stutter.
      const synth = synthRef.current;
      if (!synth || statusRef.current !== "playing" || sourceRef.current !== "synth") return;
      if (document.hidden) synth.stop();
      else synth.start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisibility);
      audio.removeEventListener("error", onError);
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      synthRef.current?.dispose();
      audioRef.current = null;
      synthRef.current = null;
    };
  }, [music.src, music.volume, update]);

  const play = useCallback(() => {
    const audio = audioRef.current;
    const synth = synthRef.current;
    if (!audio || !synth) return;

    const fallback = () => {
      if (music.synthFallback && synth.start()) update("playing", "synth");
      else update("unavailable", null);
    };

    if (fileOk.current === false) {
      fallback();
      return;
    }
    // Unlock audio synchronously while we still hold the user gesture, in case the file fails later.
    if (music.synthFallback) synth.unlock();
    if (!audio.getAttribute("src")) audio.src = music.src;
    audio.play().then(
      () => update("playing", "file"),
      (error: unknown) => {
        if (error instanceof DOMException && error.name === "NotAllowedError") update("idle", null);
        else {
          fileOk.current = false;
          fallback();
        }
      },
    );
  }, [music.src, music.synthFallback, update]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    synthRef.current?.stop();
    update("paused", sourceRef.current);
  }, [update]);

  const startFromGesture = useCallback(() => {
    if (userPaused.current || statusRef.current === "playing") return;
    play();
  }, [play]);

  const toggle = useCallback(() => {
    if (statusRef.current === "playing") {
      userPaused.current = true;
      pause();
    } else {
      userPaused.current = false;
      play();
    }
  }, [pause, play]);

  const value = useMemo(() => ({ status, source, startFromGesture, toggle }), [status, source, startFromGesture, toggle]);
  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}
