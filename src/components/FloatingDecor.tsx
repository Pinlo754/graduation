import { seededRandom } from "@/lib/random";

const SYMBOLS = ["cap", "code", "braces", "star", "semi", "diamond", "binary", "cap", "star", "code"] as const;
type SymbolName = (typeof SYMBOLS)[number];

function Glyph({ name }: { name: SymbolName }) {
  switch (name) {
    case "cap":
      return (
        <svg viewBox="0 0 48 48" fill="none">
          <path d="M24 9 3 18l21 9 21-9z" fill="currentColor" opacity=".9" />
          <path d="M12 22v8c0 3 5.5 6 12 6s12-3 12-6v-8l-12 5z" fill="currentColor" opacity=".55" />
          <path d="M43 19v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "star":
      return (
        <svg viewBox="0 0 48 48">
          <path d="M24 2c1.6 12.4 9.6 20.4 22 22-12.4 1.6-20.4 9.6-22 22-1.6-12.4-9.6-20.4-22-22C14.4 22.4 22.4 14.4 24 2z" fill="currentColor" />
        </svg>
      );
    case "diamond":
      return (
        <svg viewBox="0 0 48 48" fill="none">
          <path d="M24 4 44 24 24 44 4 24z" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case "code":
      return <span className="glyph-text">{"</>"}</span>;
    case "braces":
      return <span className="glyph-text">{"{ }"}</span>;
    case "semi":
      return <span className="glyph-text">;</span>;
    case "binary":
      return <span className="glyph-text glyph-text--sm">01</span>;
  }
}

/** Slow-floating background symbols (graduation caps + code glyphs). Decorative only. */
export function FloatingDecor({ count = 10, seed = 3, className = "" }: { count?: number; seed?: number; className?: string }) {
  const random = seededRandom(seed);
  return (
    <div className={`floaters ${className}`} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => {
        const name = SYMBOLS[i % SYMBOLS.length];
        const size = 18 + random() * 30;
        return (
          <span
            key={i}
            className={`floater floater--${i % 3}`}
            style={{
              left: `${(4 + random() * 92).toFixed(1)}%`,
              top: `${(4 + random() * 92).toFixed(1)}%`,
              width: `${size.toFixed(0)}px`,
              height: `${size.toFixed(0)}px`,
              fontSize: `${(size * 0.6).toFixed(0)}px`,
              animationDelay: `${(-random() * 14).toFixed(1)}s`,
              animationDuration: `${(12 + random() * 10).toFixed(1)}s`,
            }}
          >
            <Glyph name={name} />
          </span>
        );
      })}
    </div>
  );
}
