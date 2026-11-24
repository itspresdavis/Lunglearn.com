import { notFound } from "next/navigation";
import { ResolveReport } from "@/components/admin-forms";
import { currentSession } from "@/lib/session";
import { getStore } from "@/server/store";

export default async function ReportsAdminPage() {
  const session = await currentSession();
  if (!session || !["admin", "editor", "reviewer"].includes(session.user.role)) notFound();
  const reports = getStore().listReports();
  return (
    <div>
      <h1>Correction queue</h1>
      {reports.map((report) => (
        <article key={report.id} className="card">
          <p>{report.status} · {report.href}</p>
          <p>{report.message}</p>
          {report.status === "open" ? <ResolveReport id={report.id} /> : null}
        </article>
      ))}
      {reports.length === 0 ? <p>No reports.</p> : null}
    </div>
  );
}
