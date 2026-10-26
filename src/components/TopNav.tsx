const LINKS = [
  { href: "#details", label: "Chi tiết" },
  { href: "#memories", label: "Kỷ niệm" },
  { href: "#rsvp", label: "RSVP" },
];

export function TopNav({ name }: { name: string }) {
  return (
    <header className="topnav">
      <a className="topnav__brand mono" href="#welcome" aria-label="Về đầu trang">
        <span className="topnav__dot" aria-hidden="true" />
        {name}.graduate()
      </a>
      <nav aria-label="Mục lục">
        <ul className="topnav__links">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="topnav__progress" aria-hidden="true" />
    </header>
  );
}
