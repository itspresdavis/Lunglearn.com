import type { EditorialRecord, Reference } from "@/lib/editorial";

export type Statistic = {
  id: string;
  label: string;
  value: string;
  unit: string;
  geography: string;
  period: string;
  sourceId: string;
  note?: string;
};

export type StatisticRelease = {
  id: string;
  title: string;
  geography: string;
  published: string;
  verifiedOn: string;
  verificationTimezone: string;
  url: string;
  publisher: string;
  notes: string[];
  statistics: Statistic[];
};

const blsOoh: Reference = {
  title: "Respiratory Therapists",
  source: "U.S. Bureau of Labor Statistics, Occupational Outlook Handbook",
  url: "https://www.bls.gov/ooh/healthcare/respiratory-therapists.htm",
  accessed: "2026-11-23",
};

const blsOews: Reference = {
  title: "Occupational Employment and Wages — May 2025",
  source: "U.S. Bureau of Labor Statistics, news release USDL-26-0725",
  url: "https://www.bls.gov/news.release/archives/ocwage_05152026.htm",
  published: "2026-05-15",
  accessed: "2026-11-23",
};

export const statisticReferences = { blsOoh, blsOews };

export const statisticReleases: StatisticRelease[] = [
  {
    id: "bls-ooh-rt-2025-35",
    title: "Occupational Outlook Handbook, respiratory therapists",
    geography: "United States",
    published: "Handbook page current at verification; wage year May 2025 and projections 2025–35",
    verifiedOn: "2026-11-23",
    verificationTimezone: "America/New_York",
    url: blsOoh.url,
    publisher: "U.S. Bureau of Labor Statistics",
    notes: [
      "These are national estimates and projections. They are not a job offer, a salary guarantee, or a prediction for any one person.",
      "The Outlook Handbook rounds employment to 142,000. The May 2025 wage news release reports 139,790 wage-and-salary respiratory therapists. The two programs do not count workers the same way.",
    ],
    statistics: [
      { id: "median-annual", label: "Median annual wage", value: "82280", unit: "USD per year", geography: "United States", period: "May 2025", sourceId: "bls-ooh-rt-2025-35" },
      { id: "median-hourly", label: "Median hourly wage", value: "39.56", unit: "USD per hour", geography: "United States", period: "May 2025", sourceId: "bls-ooh-rt-2025-35" },
      { id: "employment", label: "Employment", value: "142000", unit: "jobs", geography: "United States", period: "2025", sourceId: "bls-ooh-rt-2025-35" },
      { id: "growth", label: "Projected employment change", value: "9", unit: "percent", geography: "United States", period: "2025–2035", sourceId: "bls-ooh-rt-2025-35" },
      { id: "openings", label: "Projected annual openings", value: "8600", unit: "openings per year", geography: "United States", period: "2025–2035", sourceId: "bls-ooh-rt-2025-35", note: "BLS says many openings come from people leaving the occupation, not only from new jobs." },
      { id: "employment-change", label: "Projected numeric employment change", value: "12100", unit: "jobs", geography: "United States", period: "2025–2035", sourceId: "bls-ooh-rt-2025-35" },
      { id: "wage-low-decile", label: "Lowest 10 percent earned less than", value: "63660", unit: "USD per year", geography: "United States", period: "May 2025", sourceId: "bls-ooh-rt-2025-35" },
      { id: "wage-high-decile", label: "Highest 10 percent earned more than", value: "118050", unit: "USD per year", geography: "United States", period: "May 2025", sourceId: "bls-ooh-rt-2025-35" },
      { id: "all-occupations-median", label: "Median annual wage, all occupations", value: "50980", unit: "USD per year", geography: "United States", period: "May 2025", sourceId: "bls-ooh-rt-2025-35" },
      { id: "industry-other-practitioners", label: "Median annual wage, offices of other health practitioners", value: "88020", unit: "USD per year", geography: "United States", period: "May 2025", sourceId: "bls-ooh-rt-2025-35" },
      { id: "industry-hospitals", label: "Median annual wage, hospitals", value: "82730", unit: "USD per year", geography: "United States", period: "May 2025", sourceId: "bls-ooh-rt-2025-35" },
      { id: "industry-snf", label: "Median annual wage, skilled nursing facilities", value: "79270", unit: "USD per year", geography: "United States", period: "May 2025", sourceId: "bls-ooh-rt-2025-35" },
      { id: "industry-physician-offices", label: "Median annual wage, offices of physicians", value: "77890", unit: "USD per year", geography: "United States", period: "May 2025", sourceId: "bls-ooh-rt-2025-35" },
      { id: "share-hospitals", label: "Share of jobs in hospitals", value: "80", unit: "percent", geography: "United States", period: "2025", sourceId: "bls-ooh-rt-2025-35" },
    ],
  },
  {
    id: "bls-oews-may-2025-national",
    title: "OEWS national wage and salary estimates",
    geography: "United States",
    published: "2026-05-15",
    verifiedOn: "2026-11-23",
    verificationTimezone: "America/New_York",
    url: blsOews.url,
    publisher: "U.S. Bureau of Labor Statistics",
    notes: [
      "OEWS counts wage and salary workers. It is the source of the wage distribution used by the Outlook Handbook.",
      "State medians are published by BLS, but this release of Lung Learn does not reprint a 50-state table. Use the BLS state pages linked from the salary guide.",
    ],
    statistics: [
      { id: "oews-employment", label: "OEWS employment", value: "139790", unit: "wage and salary jobs", geography: "United States", period: "May 2025", sourceId: "bls-oews-may-2025-national" },
      { id: "oews-mean-hourly", label: "Mean hourly wage", value: "41.97", unit: "USD per hour", geography: "United States", period: "May 2025", sourceId: "bls-oews-may-2025-national" },
      { id: "oews-mean-annual", label: "Mean annual wage", value: "87300", unit: "USD per year", geography: "United States", period: "May 2025", sourceId: "bls-oews-may-2025-national" },
      { id: "oews-median-hourly", label: "Median hourly wage", value: "39.56", unit: "USD per hour", geography: "United States", period: "May 2025", sourceId: "bls-oews-may-2025-national" },
    ],
  },
];

export const careerEditorial: EditorialRecord = {
  status: "published",
  version: 1,
  contentClass: "career_fact",
  author: "Lung Learn editorial desk",
  reviewer: null,
  reviewedOn: "2026-11-23",
  publishedOn: "2026-11-23",
  corrections: [],
};

export function money(value: string): string {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return value;
  if (numeric >= 1000) return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(numeric);
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(numeric);
}
