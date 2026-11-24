import { notFound } from "next/navigation";
import { FileLink, ReviewDecision } from "@/components/admin-forms";
import { currentSession } from "@/lib/session";
import { getStore } from "@/server/store";

export default async function VerificationAdminPage() {
  const session = await currentSession();
  if (!session || (session.user.role !== "admin" && session.user.role !== "reviewer")) notFound();
  const records = getStore().verifications();
  return (
    <div>
      <h1>Student verification</h1>
      <p>Opening a file requires an authenticator confirmation in the last 12 hours. The link expires in 60 seconds.</p>
      {records.map((record) => (
        <article key={record.id} className="card">
          <h2>{record.id}</h2>
          <p>{record.method} · {record.status} · dates on evidence: {record.evidenceHasDates ? "yes" : "no"}</p>
          <p>Term: {record.enrollmentStart ?? "unset"} to {record.enrollmentEnd ?? "unset"}</p>
          <p>File deleted: {record.ciphertextRemoved ? "yes" : "no"}</p>
          {record.fileKind && !record.ciphertextRemoved ? <FileLink id={record.id} /> : null}
          {record.status === "pending" ? <ReviewDecision id={record.id} /> : null}
        </article>
      ))}
      {records.length === 0 ? <p>No verification records.</p> : null}
    </div>
  );
}
