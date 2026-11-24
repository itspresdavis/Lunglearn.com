"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  ["/", "Home"],
  ["/explore", "Explore the Career"],
  ["/atlas", "Anatomy Atlas"],
  ["/academy", "Respiratory Academy"],
  ["/diseases", "Disease Library"],
  ["/pharmacology", "Pharmacology"],
  ["/reference", "Clinical Reference"],
  ["/simulations", "Clinical Simulations"],
  ["/board-prep", "Board Preparation"],
  ["/calculators", "Calculators"],
  ["/study", "Study Tools"],
  ["/educators", "Educator Resources"],
  ["/schools", "Find a School"],
  ["/pricing", "Pricing"],
  ["/learn", "My Learning"],
] as const;

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

  return (
    <header className="topbar">
      <div className="wrap-wide brand-row">
        <Link href="/" className="brand">
          <svg width="36" height="36" viewBox="0 0 32 32" aria-hidden="true">
            <rect width="32" height="32" rx="4" fill="#0e5c66" />
            <path d="M8 23V9h3.2l6.3 9.2V9H21v14h-3.1L11.5 13.7V23H8Z" fill="#f4fbfa" />
          </svg>
          <span>
            <strong>Lung Learn</strong>
            <small>The home of respiratory education</small>
          </span>
        </Link>
        <div className="tools">
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
              placeholder="Search anatomy, disease, drugs"
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
      <div className="wrap-wide">
        <nav className={open ? "nav-row open" : "nav-row"} aria-label="Primary">
          {NAV.map(([href, label]) => {
            const current = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link key={href} href={href} aria-current={current ? "page" : undefined} onClick={() => setOpen(false)}>
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site">
      <div className="wrap-wide">
        <p>
          Lung Learn is an independent education product. It is not affiliated with the NBRC, CoARC, AARC, or any school. Nothing on this site is a patient order, a salary promise, or a guarantee of examination results.
        </p>
        <p>
          <Link href="/report">Report an error</Link> · <Link href="/legal/terms">Terms</Link> · <Link href="/legal/privacy">Privacy</Link> · <Link href="/pricing">Pricing</Link>
        </p>
      </div>
    </footer>
  );
}
