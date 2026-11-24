import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <article className="section wrap prose">
      <h1>Privacy</h1>
      <p>An account stores an email address, a password hash, and study records you create. Sessions use an httpOnly cookie. The application does not sell personal information.</p>
      <p>Student-verification files are encrypted at rest, excluded from analytics, and available to a reviewer only through a link that expires in 60 seconds and works once. The file is deleted 14 days after a decision. What remains is the decision, the enrollment dates, and the method of review.</p>
      <p>The tutor, when a model is configured, receives your question and the titles of matching Lung Learn pages. It does not receive verification files. When no model is configured, the question is answered by search alone.</p>
      <p>Payments, if enabled, are processed by Stripe. Lung Learn does not store card numbers.</p>
    </article>
  );
}
