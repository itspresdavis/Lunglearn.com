# Testing

`npm test` runs Vitest. `npm run lint` runs ESLint. `npm run build` runs the Next.js production build, which typechecks and prerenders the public pages.

## What the unit tests cover

- Calculator examples, including predicted body weight for a 180 cm man, oxygen content, static compliance, RSBI, Winter’s formula, oxygenation index, and E-cylinder duration.
- Rejection of out-of-range calculator inputs.
- Acid-base classification without a treatment recommendation.
- A canceled student subscription with no open period is free, even if the plan field says student.
- Renewal never changes 499 cents to 999 cents without consent.
- Clinical items in the content modules are not `published`, and publication is blocked without a reviewer.
- Search requires every term to match.
- Catalog counts equal the arrays, and full-length exams are zero.
- The GLB contains 74 meshes, including `FMA7394`, and a ray cast at a real triangle hits.
- Layer visibility and clipping math.
- An inappropriate simulation action does not advance the case.
- Spaced repetition resets a missed card and keeps ease at or above 1.3.
- Recurring revenue ignores canceled subscriptions, and a scenario is labeled `projection`.
- A verification upload is accepted only for a sniffed file type, approval without dates fails, a file token issued in the past does not open the file, and a token without authenticator confirmation is refused.
- A Stripe checkout event maps to the student price of 499 cents.

## What was run

In this workspace, `npx vitest run` reported 18 passed tests. `npx next build` completed and prerendered 124 pages. ESLint completed with no warnings.

## What was not run

A browser pass on November 23, 2026 checked the home page in light and dark, search for trachea, the atlas including the female-model gap and a posterior view, the predicted-body-weight calculator at 180 cm (75.12 kg), pricing, and a 390-pixel-wide header. No frame time was measured. No phone and no Apple M1 were available, so no frame-rate number is published. No live Stripe webhook was posted. No hosted Postgres migration was applied. Accessibility was reviewed in markup (labels, skip link, button names, and text alternatives on the diagrams) and was not run through a screen reader in this workspace.

## Adding a test before a formula change

Put the new example next to the others in `tests/platform.test.ts` and keep the formula text on the calculator page in agreement with the function.
