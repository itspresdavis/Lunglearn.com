import Link from "next/link";
import type { Block } from "@/content/career";
import type { EditorialRecord, Reference } from "@/lib/editorial";
import { parseInline } from "@/lib/rich-text";

export function Rich({ text }: { text: string }) {
  const parts = parseInline(text);
  return (
    <>
      {parts.map((part, index) =>
        part.type === "link" ? (
          part.href.startsWith("/") ? (
            <Link key={index} href={part.href}>
              {part.text}
            </Link>
          ) : (
            <a key={index} href={part.href}>
              {part.text}
            </a>
          )
        ) : (
          <span key={index}>{part.text}</span>
        ),
      )}
    </>
  );
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="prose">
      {blocks.map((block, index) => {
        if (block.type === "h") return <h2 key={index}>{block.text}</h2>;
        if (block.type === "ul") {
          return (
            <ul key={index}>
              {block.items.map((item) => (
                <li key={item}>
                  <Rich text={item} />
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === "note") {
          return (
            <p key={index} className="banner">
              <Rich text={block.text} />
            </p>
          );
        }
        return (
          <p key={index}>
            <Rich text={block.text} />
          </p>
        );
      })}
    </div>
  );
}

const STATUS_LABEL: Record<EditorialRecord["status"], string> = {
  draft: "Draft",
  source_verification_required: "Source verification required",
  clinical_review_required: "Clinical review required",
  changes_requested: "Changes requested",
  approved: "Approved",
  published: "Published",
  review_overdue: "Review overdue",
  archived: "Archived",
};

export function EditorialNote({ editorial }: { editorial: EditorialRecord }) {
  if (editorial.status === "published") {
    return (
      <p className="meta">
        <span>Published {editorial.publishedOn}</span>
        <span>Version {editorial.version}</span>
        <span>{editorial.author}</span>
        {editorial.reviewer ? (
          <span>
            Reviewed by {editorial.reviewer.name}, {editorial.reviewer.credentials}
            {editorial.reviewedOn ? ` on ${editorial.reviewedOn}` : ""}
          </span>
        ) : (
          <span>No named clinical reviewer on this item</span>
        )}
      </p>
    );
  }
  return (
    <div className="banner">
      <strong>{STATUS_LABEL[editorial.status]}.</strong> This page is an educational draft. It is not a medically verified protocol, and it is kept out of the search index until review is complete.
      <span className="meta">
        <span>Author: {editorial.author}</span>
        <span>Version {editorial.version}</span>
      </span>
    </div>
  );
}

export function References({ references }: { references: Reference[] }) {
  if (!references.length) return null;
  return (
    <section>
      <h2>References</h2>
      <ol>
        {references.map((reference) => (
          <li key={reference.url}>
            <a href={reference.url}>{reference.title}</a>
            <div className="muted">
              {reference.source}
              {reference.published ? ` · ${reference.published}` : ""}
              {reference.accessed ? ` · accessed ${reference.accessed}` : ""}
              {reference.note ? ` · ${reference.note}` : ""}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Locked({ title }: { title: string }) {
  return (
    <section className="card">
      <h2>{title}</h2>
      <p>This item is part of the individual library. A verified student plan or a standard plan opens it. The free library stays available either way.</p>
      <p>
        <Link className="btn" href="/pricing">
          See pricing
        </Link>
      </p>
    </section>
  );
}
