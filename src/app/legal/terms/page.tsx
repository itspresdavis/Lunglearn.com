import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <article className="section wrap prose">
      <h1>Terms</h1>
      <p>Lung Learn provides education. It does not provide medical care, a prescription, a job, a license, or an examination result. Calculators and simulations are labeled for education and use fictional numbers.</p>
      <p>Accounts are for the person who created them. Do not upload someone else’s identity document. Do not upload a document you are not willing for a designated reviewer to see.</p>
      <p>Paid plans renew monthly until cancelled in the billing portal. The verified-student price stays at $4.99 while verification is current. It does not become $9.99 unless you record consent. Without that consent, a lapsed verification ends the subscription at the close of the paid period.</p>
      <p>Institutional use is by written agreement. A classroom inside a personal account is not that agreement.</p>
      <p>Anatomical meshes from BodyParts3D remain under CC BY 4.0. Screenshot exports include the required credit.</p>
    </article>
  );
}
