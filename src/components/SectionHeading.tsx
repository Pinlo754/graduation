interface SectionHeadingProps {
  index: string;
  kicker: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  id?: string;
  align?: "left" | "center";
}

export function SectionHeading({ index, kicker, title, lead, id, align = "left" }: SectionHeadingProps) {
  return (
    <div className={`section-heading section-heading--${align}`}>
      <p className="section-heading__kicker mono" data-reveal>
        <span className="section-heading__index">{index}</span>
        <span className="section-heading__rule" aria-hidden="true" />
        {kicker}
      </p>
      <h2 id={id} className="section-heading__title" data-reveal style={{ "--d": 1 } as React.CSSProperties}>
        {title}
      </h2>
      {lead && (
        <p className="section-heading__lead" data-reveal style={{ "--d": 2 } as React.CSSProperties}>
          {lead}
        </p>
      )}
    </div>
  );
}
