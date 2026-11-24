# Deployment

The app builds with `npm run build` and starts with `npm run start`. No Vercel project and no Supabase project were created.

## Environment

Copy `.env.example` to `.env`. Before a public server:

- `NEXT_PUBLIC_SITE_URL` is the canonical origin, used for metadata, the sitemap, and Stripe return URLs.
- `SESSION_SECRET` peppers session-token hashes. Production throws if it is missing when a token is hashed.
- `APP_ENCRYPTION_KEY` encrypts verification files. Production throws if it is missing when a file is stored. Use 32 bytes of base64, or any long secret. The code hashes a non-32-byte value to 32 bytes.
- `ADMIN_EMAILS` is a comma-separated list. Matching addresses become administrators at registration.
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_STUDENT`, and `STRIPE_PRICE_STANDARD` turn on checkout. Leave them empty and checkout responds that no charge was created.
- `STRIPE_AUTOMATIC_TAX=true` only after Stripe Tax is configured. The default in the example is false.
- `AI_TUTOR_URL` and `AI_TUTOR_KEY` are optional. Unset means retrieval only.
- `DATA_DIR` is the writable directory for the JSON store and verification ciphertext. On a serverless host this must be a persistent volume, or the store must be moved to Postgres using `db/migrations/001_initial.sql`.
- `DATABASE_URL` is reserved. The running store does not read it yet.

## Webhook

Point Stripe at `/api/stripe/webhook`. The route reads the raw body and checks `stripe-signature`. It does not trust an unsigned JSON post.

## Anatomy file

`public/anatomy/adult-male-thoracic.glb` is about 8 MB and is served as a static file. A CDN in front of the host is appropriate. The file is already a reduced subset. Do not replace it with a generated mesh.

## What not to do on the first deploy

Do not point the app at a production database and run the SQL until row-level security is enabled. Do not put verification ciphertext in a public bucket. Do not set clinical content to published to “fill the sitemap.”
