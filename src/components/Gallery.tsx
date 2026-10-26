"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryItem } from "@/config/site";

interface GalleryProps {
  items: GalleryItem[];
  /** Development only: show where to drop photos in the empty state. */
  showSetupHint: boolean;
}

const PLACEHOLDER_SHAPES: GalleryItem["shape"][] = ["portrait", "landscape", "square", "square", "portrait", "landscape"];

export function Gallery({ items, showSetupHint }: GalleryProps) {
  const [active, setActive] = useState<number | null>(null);
  const [broken, setBroken] = useState<Set<string>>(() => new Set());
  const triggerRef = useRef<HTMLElement | null>(null);

  const markBroken = useCallback((src: string) => {
    setBroken((prev) => (prev.has(src) ? prev : new Set(prev).add(src)));
  }, []);

  if (items.length === 0) {
    return (
      <ul className="gallery gallery--empty" aria-label="Album ảnh đang được cập nhật">
        {PLACEHOLDER_SHAPES.map((shape, i) => (
          <li key={i} className={`gallery__tile gallery__tile--${shape} gallery__tile--placeholder`} data-reveal style={{ "--d": i } as React.CSSProperties}>
            <span className="gallery__ph-icon" aria-hidden="true">
              <CameraIcon />
            </span>
            <span className="mono gallery__ph-name">memory_{String(i + 1).padStart(2, "0")}.jpg</span>
            <span className="gallery__ph-text">{showSetupHint ? "Thêm ảnh vào public/photos rồi khai báo trong src/config/site.ts" : "loading memories…"}</span>
          </li>
        ))}
      </ul>
    );
  }

  const open = (index: number, trigger: HTMLElement) => {
    triggerRef.current = trigger;
    setActive(index);
  };

  return (
    <>
      <ul className="gallery">
        {items.map((item, i) => (
          <li key={item.src} className={`gallery__tile gallery__tile--${item.shape ?? "square"}`} data-reveal style={{ "--d": i % 6 } as React.CSSProperties}>
            {broken.has(item.src) ? (
              <div className="gallery__missing">
                <span className="mono">404</span>
                <span>{item.caption ?? item.alt}</span>
              </div>
            ) : (
              <button type="button" className="gallery__button" onClick={(e) => open(i, e.currentTarget)} aria-label={`Xem ảnh: ${item.caption ?? item.alt}`}>
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 380px"
                  className="gallery__img"
                  onError={() => markBroken(item.src)}
                />
                {(item.caption || item.date) && (
                  <span className="gallery__caption">
                    {item.caption && <span>{item.caption}</span>}
                    {item.date && <span className="mono gallery__date">{item.date}</span>}
                  </span>
                )}
              </button>
            )}
          </li>
        ))}
      </ul>
      {active !== null && (
        <Lightbox
          items={items}
          index={active}
          onChange={setActive}
          onClose={() => {
            setActive(null);
            triggerRef.current?.focus();
          }}
        />
      )}
    </>
  );
}

interface LightboxProps {
  items: GalleryItem[];
  index: number;
  onChange: (index: number) => void;
  onClose: () => void;
}

function Lightbox({ items, index, onChange, onClose }: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchStart = useRef<number | null>(null);
  const item = items[index];
  const count = items.length;
  const go = useCallback((delta: number) => onChange((index + delta + count) % count), [count, index, onChange]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    document.documentElement.classList.add("is-locked");
    return () => document.documentElement.classList.remove("is-locked");
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  return (
    <dialog
      ref={dialogRef}
      className="lightbox"
      aria-label={item.caption ?? item.alt}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onTouchStart={(e) => {
        touchStart.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        const start = touchStart.current;
        const end = e.changedTouches[0]?.clientX;
        touchStart.current = null;
        if (start === null || end === undefined || Math.abs(end - start) < 45) return;
        go(end < start ? 1 : -1);
      }}
    >
      <figure className="lightbox__figure">
        <div className="lightbox__frame">
          <Image key={item.src} src={item.src} alt={item.alt} fill sizes="100vw" className="lightbox__img" />
        </div>
        <figcaption className="lightbox__caption">
          {item.caption && <span>{item.caption}</span>}
          {item.date && <span className="mono">{item.date}</span>}
          <span className="mono lightbox__count">
            {index + 1} / {count}
          </span>
        </figcaption>
      </figure>
      {count > 1 && (
        <>
          <button type="button" className="lightbox__nav lightbox__nav--prev" onClick={() => go(-1)} aria-label="Ảnh trước">
            ←
          </button>
          <button type="button" className="lightbox__nav lightbox__nav--next" onClick={() => go(1)} aria-label="Ảnh tiếp theo">
            →
          </button>
        </>
      )}
      <button type="button" className="lightbox__close" onClick={onClose} aria-label="Đóng">
        ✕
      </button>
    </dialog>
  );
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h1.8l1.4-2h4.6l1.4 2h1.8A2.5 2.5 0 0 1 20 8.5v8A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5z" />
      <circle cx="12" cy="12.5" r="3.5" />
    </svg>
  );
}
