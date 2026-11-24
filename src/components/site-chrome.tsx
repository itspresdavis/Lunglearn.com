"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const STUDY = [
  ["/atlas", "Atlas"],
  ["/academy", "Academy"],
  ["/diseases", "Diseases"],
  ["/pharmacology", "Pharmacology"],
  ["/reference", "Reference"],
  ["/simulations", "Simulations"],
  ["/board-prep", "Board prep"],
  ["/calculators", "Calculators"],
] as const;

const MORE = [
  ["/explore", "Career"],
  ["/schools", "Schools"],
  ["/study", "Study"],
  ["/educators", "Educators"],
  ["/pricing", "Pricing"],
  ["/learn", "My learning"],
] as const;

function Mark() {
  return <span className="mark" aria-hidden="true" />;
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
                placeholder="Search the library"
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
          {STUDY.map(([href, label]) => item(href, label))}
          <span className="nav-split" aria-hidden="true" />
          {MORE.map(([href, label]) => item(href, label))}
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
          <p className="foot-label">Library</p>
          <ul>
            <li><Link href="/atlas">Anatomy atlas</Link></li>
            <li><Link href="/academy">Respiratory academy</Link></li>
            <li><Link href="/diseases">Disease library</Link></li>
            <li><Link href="/calculators">Calculators</Link></li>
            <li><Link href="/board-prep">Board preparation</Link></li>
          </ul>
        </div>
        <div>
          <p className="foot-label">Policies</p>
          <ul>
            <li><Link href="/report">Report an error</Link></li>
            <li><Link href="/legal/terms">Terms</Link></li>
            <li><Link href="/legal/privacy">Privacy</Link></li>
            <li><Link href="/pricing">Pricing</Link></li>
          </ul>
        </div>
      </div>
      <div className="wrap-wide foot-note">Nothing on this site is a patient order, a salary promise, or a guarantee of examination results.</div>
    </footer>
  );
}
