"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PRIMARY = [
  ["/atlas", "Atlas"],
  ["/academy", "Academy"],
  ["/diseases", "Diseases"],
  ["/calculators", "Calculators"],
  ["/board-prep", "Board prep"],
] as const;

const MENU = [
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
      ["/calculators", "Calculators"],
      ["/board-prep", "Board prep"],
      ["/simulations", "Simulations"],
      ["/reference", "Reference"],
    ],
  },
  {
    label: "Career",
    links: [
      ["/explore", "Career"],
      ["/schools", "Schools"],
      ["/study", "Study desk"],
      ["/educators", "Educators"],
      ["/pricing", "Pricing"],
    ],
  },
] as const;

function Mark() {
  return (
    <svg width="32" height="32" viewBox="0 0 64 64" aria-hidden="true">
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

  function current(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="topbar">
      <div className="wrap-wide bar">
        <Link href="/" className="brand">
          <Mark />
          <strong>Lung Learn</strong>
        </Link>
        <nav className="primary" aria-label="Primary">
          {PRIMARY.map(([href, label]) => (
            <Link key={href} href={href} aria-current={current(href) ? "page" : undefined}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="mast-tools">
          <form
            className="search"
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              const term = query.trim();
              if (term) router.push(`/search?q=${encodeURIComponent(term)}`);
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
          </form>
          <button type="button" className="theme-toggle" onClick={toggleTheme}>
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          <Link href="/learn" className="btn" aria-current={current("/learn") ? "page" : undefined}>
            My learning
          </Link>
          <button type="button" className="theme-toggle menu-btn" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>
      <nav className={open ? "mobile-menu open" : "mobile-menu"} aria-label="All sections" hidden={!open}>
        {MENU.map((group) => (
          <div key={group.label}>
            <p className="nav-label">{group.label}</p>
            {group.links.map(([href, label]) => (
              <Link key={href} href={href} aria-current={current(href) ? "page" : undefined} onClick={() => setOpen(false)}>
                {label}
              </Link>
            ))}
          </div>
        ))}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site">
      <div className="wrap-wide foot-simple">
        <p>Lung Learn is independent. It is not affiliated with the NBRC, CoARC, AARC, or any school, and nothing here is a patient order, a wage offer, or an exam guarantee.</p>
        <p className="foot-links">
          <Link href="/atlas">Atlas</Link>
          <Link href="/academy">Academy</Link>
          <Link href="/diseases">Diseases</Link>
          <Link href="/pharmacology">Pharmacology</Link>
          <Link href="/calculators">Calculators</Link>
          <Link href="/board-prep">Board prep</Link>
          <Link href="/explore">Career</Link>
          <Link href="/schools">Schools</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/report">Report an error</Link>
          <Link href="/legal/terms">Terms</Link>
          <Link href="/legal/privacy">Privacy</Link>
        </p>
      </div>
    </footer>
  );
}
