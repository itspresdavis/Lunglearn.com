# Implementation status

Checked on November 23, 2026, America/New_York. Counts below are the arrays in this commit, also rendered by `resourceCounts()`.

## Working in this repository

- Public site with the fifteen primary destinations, light and dark themes, and a shared search index.
- Career guides, versioned BLS statistics, and four school records checked on institution sites. Tuition and outcomes are null.
- Adult male thoracic atlas: 74 named meshes, 325,415 triangles, 8,041,132 bytes. Mesh picking is a raycast. Layers with no mesh are disabled. The female control does not show a recolored male.
- Eight lessons, fifteen disease entries, eight medication monographs with no doses, four clinical reference notes, twenty-six calculators, twelve original questions, two short practice forms, three simulations.
- Accounts, sessions, study notes, bookmarks, spaced-repetition cards, classrooms, assignments, and institutional inquiries.
- Student verification upload and attestation, encrypted files, one-minute reviewer links, and a refusal to approve evidence that has no enrollment dates.
- Stripe checkout, portal, consent, and webhook code paths. Checkout does not charge anyone until keys are present.
- Admin screens for accounts, verification, editorial state, reports, finance, and security events.
- Unit tests for formulas, entitlements, renewal price, editorial blocks, search, the GLB raycast, simulation flow, spaced repetition, finance labels, and verification privacy. `npm test` and `npm run build` passed in this workspace.

## Not done

- No female anatomical model, no lung parenchyma, pleura, alveoli, carina, phrenic nerve, vagus, or lymph mesh. Text records say so.
- No diseased meshes. Disease pages do not tint the healthy model and call it pathology.
- No 185-item examination, no specialty credential bank, and no claim of NBRC endorsement. Full-length exams on record: 0.
- Clinical lessons, diseases, drugs, questions, simulations, and reference notes have no named reviewer. They are readable drafts and are excluded from the sitemap.
- No Supabase project, no Vercel project, and no Stripe account were created. The file store is the running database.
- State wage tables were not imported. BLS publishes them; this build links to BLS instead of reprinting an unchecked workbook.
- CoARC’s directory was not copied. Four programs are listed from their own websites.
- Frame rate on an Apple M1 was not measured. The asset size and triangle count are measured. Do not treat them as a frame-rate benchmark.
- Continuing-education credit is not claimed.
- A generative tutor runs only if `AI_TUTOR_URL` and `AI_TUTOR_KEY` are set. Otherwise the tutor returns search hits.

## Credentials still required

- `SESSION_SECRET` and `APP_ENCRYPTION_KEY` before production.
- `ADMIN_EMAILS` for the first administrator.
- Stripe secret, webhook secret, and price ids for the $4.99 and $9.99 prices, plus tax settings the owner chooses.
- Written permission from CoARC before any commercial reuse of the accredited-program directory.
- Named clinical reviewers before any clinical item moves to `approved` or `published`.
- A licensed female model and missing organ meshes, without buying a license unless the owner approves the cost.
