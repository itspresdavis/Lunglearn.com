export type SearchDocument = {
  id: string;
  type: string;
  title: string;
  href: string;
  text: string;
  access: "free" | "premium";
};

export type SearchHit = SearchDocument & { score: number; excerpt: string };

function excerpt(text: string, terms: string[]): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return "";
  const lower = clean.toLowerCase();
  let at = -1;
  for (const term of terms) {
    const found = lower.indexOf(term);
    if (found >= 0 && (at < 0 || found < at)) at = found;
  }
  if (at < 0) return clean.slice(0, 160);
  const start = Math.max(0, at - 70);
  const end = Math.min(clean.length, at + 110);
  const slice = clean.slice(start, end).trim();
  return `${start > 0 ? "…" : ""}${slice}${end < clean.length ? "…" : ""}`;
}

export function searchDocuments(documents: SearchDocument[], query: string, limit = 24): SearchHit[] {
  const terms = query
    .toLowerCase()
    .split(/[^a-z0-9+]+/)
    .filter((term) => term.length > 1);
  if (terms.length === 0) return [];
  const hits: SearchHit[] = [];
  for (const document of documents) {
    const title = document.title.toLowerCase();
    const haystack = `${title} ${document.text.toLowerCase()}`;
    let score = 0;
    let matched = 0;
    for (const term of terms) {
      if (title.includes(term)) {
        score += 5;
        matched += 1;
      } else if (haystack.includes(term)) {
        score += 1;
        matched += 1;
      }
    }
    if (matched === terms.length) hits.push({ ...document, score, excerpt: excerpt(document.text, terms) });
  }
  hits.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
  return hits.slice(0, limit);
}
