# Medical review workflow

Editorial states, in order of the allowed transitions in `src/lib/editorial.ts`:

1. Draft.
2. Source verification required.
3. Clinical review required.
4. Changes requested.
5. Approved.
6. Published.
7. Review overdue.
8. Archived.

`published` is reachable only from `approved`. `publishBlockers` rejects clinical content with no reviewer name and credentials, references without an https URL, and formulas that have not passed their checks.

## Who can move a state

Today the state lives in the content module. An editor changes it in git. A reviewer is a real person named on the record. This repository does not contain a fictional reviewer.

High-risk items, including ventilator teaching, drug monographs, blood-gas interpretation, and any new anatomical mesh, stay in `clinical_review_required` until that review exists.

## After publication

A published item keeps its version, publication date, reviewer, and correction list. When the review date is past the policy the editors set, the state moves to `review_overdue` and the item leaves the index until it is reviewed again. No review interval is being pretended for items that were never approved.

## Reporting

The public report form is the intake. Administrators, editors, and reviewers can mark a report resolved. Unpublishing is a source change, not a silent flag, until the content moves into the database.
