import { seededRandom } from "@/lib/random";

interface SparklesProps {
  count?: number;
  seed?: number;
  className?: string;
}

/**
 * Twinkling golden sparkles. Pure CSS animation, deterministic positions,
 * decorative only (aria-hidden, pointer-events: none). On small screens CSS
 * hides every sparkle after the 14th.
 */
export function Sparkles({ count = 28, seed = 7, className = "" }: SparklesProps) {
  const random = seededRandom(seed);
  const sparkles = Array.from({ length: count }, (_, i) => {
    const size = 4 + random() * 10;
    return {
      key: i,
      style: {
        left: `${(random() * 100).toFixed(2)}%`,
        top: `${(random() * 100).toFixed(2)}%`,
        width: `${size.toFixed(1)}px`,
        height: `${size.toFixed(1)}px`,
        animationDelay: `${(random() * 6).toFixed(2)}s`,
        animationDuration: `${(2.6 + random() * 3.8).toFixed(2)}s`,
      } as React.CSSProperties,
      variant: random() > 0.62 ? "dot" : "star",
    };
  });
  return (
    <div className={`sparkles ${className}`} aria-hidden="true">
      {sparkles.map((s) => (
        <span key={s.key} className={`sparkle sparkle--${s.variant}`} style={s.style} />
      ))}
    </div>
  );
}

/** A one-shot radial burst of glowing particles, used when the envelope opens. */
export function SparkleBurst({ count = 26, seed = 21 }: { count?: number; seed?: number }) {
  const random = seededRandom(seed);
  return (
    <div className="burst" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + random() * 0.4;
        const distance = 120 + random() * 220;
        return (
          <span
            key={i}
            className={`burst__p ${i % 3 === 0 ? "burst__p--orange" : ""}`}
            style={
              {
                "--dx": `${(Math.cos(angle) * distance).toFixed(1)}px`,
                "--dy": `${(Math.sin(angle) * distance * 0.8 - 40).toFixed(1)}px`,
                "--s": (0.5 + random() * 0.9).toFixed(2),
                "--delay": `${(random() * 0.18).toFixed(2)}s`,
              } as React.CSSProperties
            }
          />
        );
      })}
    </div>
  );
}
