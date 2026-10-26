import { FloatingDecor } from "./FloatingDecor";
import { Sparkles } from "./Sparkles";

/** Fixed atmospheric layer behind the whole page: glows, circuit grid, sparkles, floaters. */
export function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <div className="backdrop__glow backdrop__glow--a" />
      <div className="backdrop__glow backdrop__glow--b" />
      <div className="backdrop__grid" />
      <svg className="backdrop__circuit" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
        <g fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M0 140h220l40 40h180l30-30h260" />
          <path d="M1200 620H960l-40-40H700l-30 30H420" />
          <path d="M120 800V600l40-40V420" />
          <path d="M1080 0v160l-40 40v120" />
        </g>
        <g fill="currentColor">
          <circle cx="260" cy="180" r="3" />
          <circle cx="440" cy="180" r="3" />
          <circle cx="920" cy="580" r="3" />
          <circle cx="160" cy="560" r="3" />
          <circle cx="1040" cy="200" r="3" />
        </g>
      </svg>
      <Sparkles count={26} seed={11} />
      <FloatingDecor count={10} seed={5} />
    </div>
  );
}
