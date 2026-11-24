# Security

## Authentication

Passwords are hashed with scrypt and must be at least 10 characters. Session tokens are random, stored as SHA-256, and set in an httpOnly, SameSite=Lax cookie named `ll_session` for 14 days. The cookie is marked Secure in production. Login is limited to 10 attempts per IP per 15 minutes. State-changing routes reject a mismatched `Origin`.

Administrators are the addresses in `ADMIN_EMAILS` at registration. Reviewer actions that open a verification file require an authenticator code confirmed within the last 12 hours. The authenticator is TOTP. It is not face recognition and it does not ask for a government ID.

## Verification files

Uploads are sniffed for JPEG, PNG, or PDF and rejected above 5 MB. Bytes are encrypted with AES-256-GCM before they touch disk, under `DATA_DIR/verification`, which is not a public folder. A reviewer receives a link that lasts 60 seconds and works once. Audit text passes through a redaction step that strips long base64 blobs and verification paths. Files are deleted 14 days after a decision. The tutor route never receives those bytes.

## Authorization

Premium lesson, question, simulation, calculator, and anatomy bodies are rendered on the server only when `canAccess` allows them. Hiding a link is not the control. Admin pages check the role again after middleware has checked the cookie.

## Headers

Responses set `X-Content-Type-Options`, a strict referrer policy, `X-Frame-Options: DENY`, a locked-down permissions policy, and HSTS. A content-security policy is not set yet. Adding one should be done without breaking the GLB viewer or the font host.

## Secrets

`.env` is gitignored. `.env.example` lists names only. Production startup throws if `APP_ENCRYPTION_KEY` or the session secret path used by `secretBytes` is empty. In development those keys are derived so the tests can run. Derived keys are not for a public server.

## What was not penetration-tested

Dependency audit, a hosted database’s row-level security, and a live Stripe webhook were not exercised against production, because there is no production project. The webhook handler does verify the Stripe signature when the secret is present, and it refuses a price increase on a student plan that lacks consent.
