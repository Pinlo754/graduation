import type { SiteConfig } from "@/config/site";
import type { Guest } from "@/lib/types";
import { FloatingDecor } from "../FloatingDecor";
import { SectionHeading } from "../SectionHeading";

export function LetterSection({ guest, config }: { guest: Guest; config: SiteConfig }) {
  const { letter, graduate } = config;
  return (
    <section id="letter" className="section letter" aria-labelledby="letter-title">
      <FloatingDecor count={6} seed={31} className="letter__floaters" />
      <div className="container container--narrow">
        <SectionHeading index="05" kicker="README.md" id="letter-title" title="Đôi lời muốn nói" align="center" />
        <article className="paper" data-reveal>
          <span className="paper__file mono" aria-hidden="true">
            thank-you.md
          </span>
          <p className="paper__greeting">{letter.greeting}</p>
          {letter.paragraphs.map((paragraph, i) => (
            <p key={i} className="paper__p">
              {paragraph}
            </p>
          ))}
          <p className="paper__ps">
            <span className="mono">P.S.</span> {guest.name} ơi, nhớ đến nhé — thiếu bạn là build fail đó.
          </p>
          <footer className="paper__sign">
            <span>{letter.signOff}</span>
            <span className="paper__signature">{graduate.fullName}</span>
          </footer>
        </article>
      </div>
    </section>
  );
}
