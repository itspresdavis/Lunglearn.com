export const EDITORIAL_STATUSES = [
  "draft",
  "source_verification_required",
  "clinical_review_required",
  "changes_requested",
  "approved",
  "published",
  "review_overdue",
  "archived",
] as const;

export type EditorialStatus = (typeof EDITORIAL_STATUSES)[number];

export type ContentClass =
  | "career_fact"
  | "educational_formula"
  | "clinical_education"
  | "anatomy_identity";

export type Reference = {
  title: string;
  source: string;
  url: string;
  published?: string;
  accessed?: string;
  note?: string;
};

export type Reviewer = {
  name: string;
  credentials: string;
};

export type EditorialRecord = {
  status: EditorialStatus;
  version: number;
  contentClass: ContentClass;
  author: string;
  reviewer: Reviewer | null;
  reviewedOn: string | null;
  publishedOn: string | null;
  formulaVerified?: boolean;
  corrections: { on: string; note: string }[];
};

const TRANSITIONS: Record<EditorialStatus, EditorialStatus[]> = {
  draft: ["source_verification_required", "archived"],
  source_verification_required: ["clinical_review_required", "changes_requested", "archived"],
  clinical_review_required: ["changes_requested", "approved", "archived"],
  changes_requested: ["draft", "clinical_review_required", "archived"],
  approved: ["published", "changes_requested", "archived"],
  published: ["review_overdue", "changes_requested", "archived"],
  review_overdue: ["clinical_review_required", "archived"],
  archived: ["draft"],
};

export function canTransition(from: EditorialStatus, to: EditorialStatus): boolean {
  return TRANSITIONS[from].includes(to);
}

export type Publishable = {
  references: Reference[];
  editorial: EditorialRecord;
};

export function publishBlockers(item: Publishable): string[] {
  const reasons: string[] = [];
  if (item.references.length === 0) {
    reasons.push("A published item needs at least one real source.");
  }
  for (const reference of item.references) {
    if (!reference.url.startsWith("https://")) {
      reasons.push(`Reference “${reference.title}” needs an https source URL.`);
    }
  }
  if (item.editorial.reviewer) {
    const name = item.editorial.reviewer.name.trim();
    const credentials = item.editorial.reviewer.credentials.trim();
    if (!name || !credentials) {
      reasons.push("A reviewer record needs a name and credentials.");
    }
  }
  if (item.editorial.contentClass === "clinical_education") {
    if (!item.editorial.reviewer) {
      reasons.push("Clinical content cannot be published until a named reviewer approves it.");
    }
  }
  if (item.editorial.contentClass === "educational_formula" && !item.editorial.formulaVerified) {
    reasons.push("A formula is published only after its automated checks pass.");
  }
  return reasons;
}

export function transition(
  item: Publishable,
  to: EditorialStatus,
  on: string,
): { ok: true; editorial: EditorialRecord } | { ok: false; reasons: string[] } {
  if (!canTransition(item.editorial.status, to)) {
    return { ok: false, reasons: [`Cannot move from ${item.editorial.status} to ${to}.`] };
  }
  if (to === "published") {
    const reasons = publishBlockers(item);
    if (reasons.length) return { ok: false, reasons };
  }
  const editorial: EditorialRecord = {
    ...item.editorial,
    status: to,
    publishedOn: to === "published" ? on : item.editorial.publishedOn,
    reviewedOn: to === "approved" || to === "published" ? item.editorial.reviewedOn ?? on : item.editorial.reviewedOn,
  };
  return { ok: true, editorial };
}

export function isIndexable(item: Publishable): boolean {
  return item.editorial.status === "published" && publishBlockers(item).length === 0;
}

export function isPubliclyReadable(status: EditorialStatus): boolean {
  return status !== "archived" && status !== "draft";
}
