# Profitability

The operating target is $5,000 of monthly operating profit. Revenue is not profit. A projection is not a result.

## Prices

- Free: $0. Career pages, the school list, public articles, the thoracic atlas subset that is marked free, basic calculators, selected lessons, and a short question form.
- Verified student: $4.99 per month, 499 cents. Same individual library as standard.
- Standard: $9.99 per month, 999 cents.
- Institutions: inquiry only. No self-serve price is invented.

Entitlements are data in `src/lib/entitlements.ts`, not scattered conditionals. Student and standard both resolve to `individual_premium` when the subscription is actually paying.

## Renewal

If student verification is current, renewal stays at 499 cents. If it has lapsed and the person has recorded consent, renewal can move to 999 cents. Without that consent the decision is `cancel_at_period_end` at 499 cents. The webhook applies the same hold if Stripe reports a higher price and consent is missing.

## What the admin finance page shows

Monthly recurring revenue is the sum of active subscription prices. Canceled subscriptions are excluded. Annualized revenue is that sum times twelve. Card fees at 2.9% plus $0.30 are labeled as a projection, from Stripe’s published domestic online card rate, not from an invoice. Operating profit uses collected cash, refunds, processing fees, and expenses marked actual. In this build collected cash is zero, so profit is zero minus any actual expense an administrator has entered. The scenario form is labeled `projection` in the return value and on the screen.

## Costs not yet incurred

No hosting bill, database bill, storage bill, model bill, anatomy license, or reviewer invoice exists in the ledger. Those categories can be entered as expenses when an invoice exists. Entering a guess as “actual” would make the profit figure false. The form asks the administrator to mark that distinction.

## Path to the target

The scenario tool can show, as a projection, how many student and standard subscribers cover a stated expense. It does not count toward the $5,000 target. The target is met only when a month of collected revenue minus refunds, processing, and actual expenses reaches $5,000.
