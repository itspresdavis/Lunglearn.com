import { notFound } from "next/navigation";
import { currentSession } from "@/lib/session";
import { encryptionReady, getStore } from "@/server/store";

export default async function SecurityPage() {
  const session = await currentSession();
  if (!session || session.user.role !== "admin") notFound();
  const audits = getStore().audits().slice(-50).reverse();
  return (
    <div>
      <h1>Security events</h1>
      <p>Encryption key present: {encryptionReady() ? "yes" : "no, a derived development key is in use"}. Session secret is read from the environment and is not displayed.</p>
      <table>
        <thead><tr><th>When</th><th>Action</th><th>Detail</th></tr></thead>
        <tbody>
          {audits.map((audit) => (
            <tr key={audit.id}><td>{audit.at}</td><td>{audit.action}</td><td>{audit.detail}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
