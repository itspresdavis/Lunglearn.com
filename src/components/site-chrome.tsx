"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const GROUPS = [
  {
    label: "Study",
    links: [
      ["/atlas", "Atlas"],
      ["/academy", "Academy"],
      ["/diseases", "Diseases"],
      ["/pharmacology", "Pharmacology"],
    ],
  },
  {
    label: "Practice",
    links: [
      ["/reference", "Reference"],
      ["/simulations", "Simulations"],
      ["/board-prep", "Board prep"],
      ["/calculators", "Calculators"],
    ],
  },
  {
    label: "Career",
    links: [
      ["/explore", "Career"],
      ["/schools", "Schools"],
      ["/study", "Study desk"],
      ["/educators", "Educators"],
    ],
  },
] as const;

function Mark() {
  return (
    <svg width="34" height="34" viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="10" fill="#1a56a0" />
      <path fill="#fff" d="M30 8h4v12h-4z" />
      <path fill="#fff" d="M30 18c-8 1-16 8-16 18 0 8 5 14 11 14 4 0 6-3 6-8V18z" />
      <path fill="#fff" d="M34 18c8 1 16 8 16 18 0 8-5 14-11 14-4 0-6-3-6-8V18z" />
    </svg>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const stored = window.localStorage.getItem("ll-theme");
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
      document.documentElement.dataset.theme = stored;
    }
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem("ll-theme", next);
  }

  function item(href: string, label: string) {
    const current = pathname === href || pathname.startsWith(`${href}/`);
    return (
      <Link key={href} href={href} aria-current={current ? "page" : undefined} onClick={() => setOpen(false)}>
        {label}
      </Link>
    );
  }

  return (
    <header className="topbar">
      <div className="mast">
        <div className="wrap-wide mast-inner">
          <Link href="/" className="brand">
            <Mark />
            <span>
              <strong>Lung Learn</strong>
              <small>Respiratory education</small>
            </span>
          </Link>
          <div className="mast-tools">
            <Link href="/pricing" className="mast-link" aria-current={pathname === "/pricing" ? "page" : undefined}>
              Pricing
            </Link>
            <Link href="/learn" className="mast-link" aria-current={pathname === "/learn" || pathname.startsWith("/learn/") ? "page" : undefined}>
              My learning
            </Link>
            <form
              className="search"
              role="search"
              onSubmit={(event) => {
                event.preventDefault();
                router.push(`/search?q=${encodeURIComponent(query)}`);
              }}
            >
              <label className="skip" htmlFor="site-search">
                Search Lung Learn
              </label>
              <input
                id="site-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search"
              />
              <button type="submit">Search</button>
            </form>
            <button type="button" className="btn-quiet" onClick={toggleTheme}>
              {theme === "dark" ? "Light" : "Dark"}
            </button>
            <button type="button" className="btn-quiet menu-btn" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
              Menu
            </button>
          </div>
        </div>
      </div>
      <div className="wrap-wide">
        <nav className={open ? "nav-row open" : "nav-row"} aria-label="Primary">
          {GROUPS.map((group) => (
            <div className="nav-group" key={group.label}>
              <span className="nav-label">{group.label}</span>
              {group.links.map(([href, label]) => item(href, label))}
            </div>
          ))}
          <div className="nav-group nav-account">
            <span className="nav-label">Account</span>
            {item("/pricing", "Pricing")}
            {item("/learn", "My learning")}
          </div>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site">
      <div className="wrap-wide foot">
        <div>
          <strong>Lung Learn</strong>
          <p>An independent library for respiratory therapy students and practicing therapists. Not affiliated with the NBRC, CoARC, AARC, or any school.</p>
        </div>
        <div>
          <p className="foot-label">Study</p>
          <ul>
            <li><Link href="/atlas">Anatomy atlas</Link></li>
            <li><Link href="/academy">Respiratory academy</Link></li>
            <li><Link href="/diseases">Disease library</Link></li>
            <li><Link href="/pharmacology">Pharmacology</Link></li>
          </ul>
        </div>
        <div>
          <p className="foot-label">Practice</p>
          <ul>
            <li><Link href="/reference">Clinical reference</Link></li>
            <li><Link href="/simulations">Simulations</Link></li>
            <li><Link href="/board-prep">Board preparation</Link></li>
            <li><Link href="/calculators">Calculators</Link></li>
          </ul>
        </div>
        <div>
          <p className="foot-label">Career</p>
          <ul>
            <li><Link href="/explore">Explore the career</Link></li>
            <li><Link href="/schools">Find a school</Link></li>
            <li><Link href="/study">Study desk</Link></li>
            <li><Link href="/educators">Educators</Link></li>
          </ul>
        </div>
      </div>
      <div className="wrap-wide foot-note">
        <p>Nothing on this site is a patient order, a salary promise, or a guarantee of examination results.</p>
        <p>
          <Link href="/pricing">Pricing</Link> · <Link href="/report">Report an error</Link> · <Link href="/legal/terms">Terms</Link> · <Link href="/legal/privacy">Privacy</Link>
        </p>
      </div>
    </footer>
  );
}
