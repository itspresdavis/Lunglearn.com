export type SearchDocument = {
  id: string;
  type: string;
  title: string;
  href: string;
  text: string;
  access: "free" | "premium";
};

export type SearchHit = SearchDocument & { score: number };

export function searchDocuments(documents: SearchDocument[], query: string, limit = 20): SearchHit[] {
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
    if (matched === terms.length) hits.push({ ...document, score });
  }
  hits.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
  return hits.slice(0, limit);
}
