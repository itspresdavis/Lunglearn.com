export type InlinePart =
  | { type: "text"; text: string }
  | { type: "link"; href: string; text: string };

const LINK = /\[([^\]]+)\]\(((?:\/|https:\/\/)[^)\s]*)\)/g;

export function parseInline(input: string): InlinePart[] {
  const parts: InlinePart[] = [];
  let cursor = 0;
  for (const match of input.matchAll(LINK)) {
    const index = match.index ?? 0;
    if (index > cursor) parts.push({ type: "text", text: input.slice(cursor, index) });
    parts.push({ type: "link", text: match[1], href: match[2] });
    cursor = index + match[0].length;
  }
  if (cursor < input.length) parts.push({ type: "text", text: input.slice(cursor) });
  return parts;
}
