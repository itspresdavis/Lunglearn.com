# Architecture

Lung Learn is a Next.js 15 application. Pages, route handlers, and the file-backed account store live in one TypeScript project. Educational records are source files, not rows in a remote database.

## Request path

Public pages that do not read a session are statically generated. Account, learning, search, and administration pages read the `ll_session` cookie and render on demand. Middleware only checks that the cookie exists before `/admin`. Role checks happen in the server layout and in each admin route, because the edge runtime cannot open the account file.

The browser never receives `SESSION_SECRET`, `APP_ENCRYPTION_KEY`, `STRIPE_SECRET_KEY`, or `DATABASE_URL`.

## Content

Career articles, lessons, diseases, medications, questions, simulations, calculators, and anatomy records are TypeScript modules under `src/content`. Each item carries an editorial record. `src/lib/editorial.ts` decides whether an item may be indexed. Clinical items in this build stay in `clinical_review_required` and are marked `noindex`.

`src/lib/catalog.ts` builds search documents and the counts shown on the home page from those arrays. A count cannot get ahead of the arrays.

## Anatomy

`public/anatomy/adult-male-thoracic.glb` is a subset of BodyParts3D. `src/components/atlas-viewer.tsx` loads it with Three.js, raycasts against mesh triangles, and toggles layers from `src/lib/atlas-model.ts`. The viewer does not import the Node GLB reader. Selection in tests uses `src/lib/atlas.ts`, which parses the GLB and raycasts on the CPU.

There is no female mesh in the file. The female control explains that gap instead of recoloring the male model.

## Accounts

`src/server/store.ts` persists users, sessions, subscriptions, verification metadata, study records, classrooms, and audits as JSON under `DATA_DIR` (default `.data`). Verification bytes are encrypted with AES-256-GCM and stored beside the JSON, outside `public`. `db/migrations/001_initial.sql` is the Postgres shape for a later move. It has not been applied to a hosted database.

Entitlements are computed by `resolveEntitlement`. A plan name of `student` does not grant the library unless the subscription is paying or still inside a paid period, and verification is approved.

## Billing

Stripe checkout, the customer portal, and signature-checked webhooks are implemented. They return a clear not-configured response until `STRIPE_SECRET_KEY`, price ids, and `STRIPE_WEBHOOK_SECRET` exist. No Stripe account was created for this repository. `renewalDecision` refuses to move a student from 499 cents to 999 cents without `standardPriceConsentAt`.

## What is intentionally not in the browser bundle

The GLB parser that reads from disk, the account store, and the encryption helpers are server-only. The atlas viewer talks to `/anatomy/adult-male-thoracic.glb` as a static file.
