import { notFound } from "next/navigation";
import { anatomyRecords } from "@/content/anatomy";
import { allCareerArticles } from "@/content/career";
import { lessons } from "@/content/curriculum";
import { diseases } from "@/content/diseases";
import { medications } from "@/content/medications";
import { questions } from "@/content/questions";
import { simulations } from "@/content/simulation-cases";
import { calculators, referenceArticles } from "@/content/tools";
import { currentSession } from "@/lib/session";

export default async function EditorialPage() {
  const session = await currentSession();
  if (!session || !["admin", "editor", "reviewer"].includes(session.user.role)) notFound();
  const items = [
    ...allCareerArticles().map((item) => ({ title: item.title, status: item.editorial.status, reviewer: item.editorial.reviewer?.name ?? "none" })),
    ...anatomyRecords.map((item) => ({ title: item.name, status: item.editorial.status, reviewer: item.editorial.reviewer?.name ?? "none" })),
    ...lessons.map((item) => ({ title: item.title, status: item.editorial.status, reviewer: item.editorial.reviewer?.name ?? "none" })),
    ...diseases.map((item) => ({ title: item.title, status: item.editorial.status, reviewer: item.editorial.reviewer?.name ?? "none" })),
    ...medications.map((item) => ({ title: item.generic, status: item.editorial.status, reviewer: item.editorial.reviewer?.name ?? "none" })),
    ...questions.map((item) => ({ title: item.id, status: item.editorial.status, reviewer: item.editorial.reviewer?.name ?? "none" })),
    ...simulations.map((item) => ({ title: item.title, status: item.editorial.status, reviewer: item.editorial.reviewer?.name ?? "none" })),
    ...calculators.map((item) => ({ title: item.title, status: item.editorial.status, reviewer: item.editorial.reviewer?.name ?? "none" })),
    ...referenceArticles.map((item) => ({ title: item.title, status: item.editorial.status, reviewer: item.editorial.reviewer?.name ?? "none" })),
  ];
  const counts = items.reduce<Record<string, number>>((map, item) => {
    map[item.status] = (map[item.status] ?? 0) + 1;
    return map;
  }, {});
  return (
    <div>
      <h1>Editorial states</h1>
      <p>These states live in the source of this build. There is no button that marks a clinical draft approved. A named reviewer has to be a real person added to the record.</p>
      <ul>{Object.entries(counts).map(([status, count]) => <li key={status}>{status}: {count}</li>)}</ul>
      <table>
        <thead><tr><th>Item</th><th>State</th><th>Reviewer</th></tr></thead>
        <tbody>
          {items.slice(0, 80).map((item) => (
            <tr key={`${item.status}-${item.title}`}><td>{item.title}</td><td>{item.status}</td><td>{item.reviewer}</td></tr>
          ))}
        </tbody>
      </table>
      {items.length > 80 ? <p>Showing 80 of {items.length}.</p> : null}
    </div>
  );
}
