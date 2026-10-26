/** Wax seal with a graduation cap over a </> mark. */
export function WaxSeal({ className = "" }: { className?: string }) {
  return (
    <svg className={`wax-seal ${className}`} viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <radialGradient id="wax" cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#FFB27A" />
          <stop offset=".45" stopColor="#F36B3F" />
          <stop offset="1" stopColor="#A8361A" />
        </radialGradient>
        <linearGradient id="wax-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFF1C9" />
          <stop offset=".5" stopColor="#F4D58D" />
          <stop offset="1" stopColor="#C99A45" />
        </linearGradient>
      </defs>
      <path
        d="M60 4c8 0 10 6 17 8s13-2 18 4 1 12 4 18 10 8 10 16-6 10-8 17 2 13-4 18-12 1-18 4-8 10-17 10-10-6-17-8-13 2-18-4-1-12-4-18-10-8-10-17 6-10 8-17-2-13 4-18 12-1 18-4 8-10 17-10z"
        fill="url(#wax)"
      />
      <circle cx="60" cy="60" r="38" fill="none" stroke="#7E2610" strokeOpacity=".45" strokeWidth="2.5" />
      <circle cx="60" cy="60" r="33" fill="none" stroke="url(#wax-gold)" strokeOpacity=".7" strokeWidth="1.2" strokeDasharray="2 3" />
      <path d="M60 36 34 47l26 11 26-11z" fill="url(#wax-gold)" />
      <path d="M45 52v9c0 4 7 7 15 7s15-3 15-7v-9l-15 6z" fill="url(#wax-gold)" opacity=".85" />
      <path d="M83 48v12" stroke="url(#wax-gold)" strokeWidth="2.2" strokeLinecap="round" />
      <path d="m51 75-6 5 6 5M69 75l6 5-6 5M62 73l-4 14" stroke="#FFF1C9" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
