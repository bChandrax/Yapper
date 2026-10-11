import "./Aside.css";

type NavKey = "dashboard" | "recording" | "history";

type AsideProps = {
  active: NavKey;
};

const links: { key: NavKey; label: string; href: string; icon: JSX.Element }[] = [
  {
    key: "dashboard",
    label: "Dashboard / Home",
    href: "/",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    key: "recording",
    label: "Recording Studio",
    href: "/recording",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="9" y="2" width="6" height="12" rx="3" />
        <path d="M5 11a7 7 0 0 0 14 0M12 18v4" />
      </svg>
    ),
  },
  {
    key: "history",
    label: "Audio & Transcripts History",
    href: "/history",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
        <path d="M14 3v5h5M9 13h6M9 17h4" />
      </svg>
    ),
  },
];

export default function Aside({ active }: AsideProps) {
  return (
    <aside className="aside">
      <div className="aside-top">
        <div className="aside-brand">
          <div className="aside-logo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#050d1a" strokeWidth="2.5" strokeLinecap="round">
              <path d="M4 10v4M8 6v12M12 3v18M16 7v10M20 10v4" />
            </svg>
          </div>
          <div className="aside-brand-text">
            <span className="aside-brand-name">YAPPER</span>
            <span className="aside-brand-sub">Setswana Whisper model</span>
          </div>
          <span className="aside-version">v3-STT</span>
        </div>

        <nav className="aside-nav">
          {links.map((l) => (
            <a
              key={l.key}
              href={l.href}
              className={`aside-link ${active === l.key ? "aside-link--active" : ""}`}
            >
              {l.icon}
              <span>{l.label}</span>
            </a>
          ))}
        </nav>
      </div>

      <div className="aside-user">
        <div className="aside-user-avatar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#050d1a" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21a8 8 0 0 1 16 0" />
          </svg>
        </div>
        <div className="aside-user-info">
          <strong>Daniel</strong>
          <span>Acoustic Lead</span>
        </div>
        <button className="aside-logout" type="button" aria-label="Log out">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
        </button>
      </div>
    </aside>
  );
}