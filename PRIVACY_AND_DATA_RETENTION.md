# Privacy and data retention

Lung Learn stores the least that lets an account, a subscription, and a study desk work.

## Account data

Email, password hash, role, and the study records the person creates (notes, bookmarks, flashcards, lesson completions) stay until the person asks for the account to be removed. Session rows expire after 14 days and are dropped on logout. There is no public self-serve account deletion screen yet. An administrator can remove the row from the store.

## Student verification

A student may upload a JPEG, PNG, or PDF, or submit an attestation with a school, an email, and term dates. The upload path asks the student to redact account numbers, full birth dates, and government identifiers. Government ID is not required. Biometrics are not collected.

The file is encrypted and is not placed in a public bucket, an analytics event, or an AI request. A reviewer with a current authenticator check can open it through a link that expires in 60 seconds and is single-use. Fourteen days after a decision the ciphertext is deleted. The decision, the method, and the enrollment dates remain so the subscription price can be explained later.

An ID card with no enrollment dates cannot be approved.

## Payments

Card numbers are not stored. Stripe, once configured, holds the payment method. The local record keeps the plan, the status, the price in cents, and the consent timestamp for a move from the student price to the standard price.

## Tutor

The retrieval tutor searches Lung Learn records. If a model endpoint is configured, the question and the matching titles are sent there. Verification files are not. The route allows 20 questions per account per hour.

## Analytics

No third-party analytics script is installed. Pages that should not be indexed send a noindex robots directive. That is not a substitute for a privacy review when analytics are added later.
