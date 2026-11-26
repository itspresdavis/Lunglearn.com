import type { Metadata } from "next";
import { ReportForm } from "@/components/interactive";

export const metadata: Metadata = { title: "Report an error", robots: { index: false, follow: false } };

export default async function ReportPage({ searchParams }: { searchParams: Promise<{ href?: string }> }) {
  const { href = "/" } = await searchParams;
  const safe = href.startsWith("/") ? href : "/";
  return (
    <section className="section wrap schema">
      <h1>Report an error</h1>
      <p>Use this for a wrong fact, a broken interaction, or a citation that does not say what the page claims. Reports go to the correction queue. They do not unpublish a page by themselves.</p>
      <ReportForm href={safe} />
    </section>
  );
}
