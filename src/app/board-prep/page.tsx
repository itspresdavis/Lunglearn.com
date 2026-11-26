import type { Metadata } from "next";
import Link from "next/link";
import { practiceForms, questions } from "@/content/questions";

export const metadata: Metadata = {
  title: "Respiratory therapy examination practice",
  description: "Original practice questions aligned with public NBRC examination descriptions. Not an NBRC product and not a score prediction.",
};

export default function BoardPage() {
  const topics = [...new Set(questions.map((question) => question.topic))];
  return (
    <section className="section wrap">
      <p className="kicker">Practice</p>
      <h1>Board preparation</h1>
      <p className="lede">
        The NBRC Respiratory Therapy Examination, effective January 4, 2027, is a 185-item, four-hour examination. One hundred sixty items are scored and twenty-five are pretest items. Separate thresholds qualify candidates for the CRT and the RRT. The Therapist Multiple-Choice Examination remains available through December 31, 2026. Lung Learn is not endorsed by the NBRC and does not guarantee a result.
      </p>
      <p>
        This library holds {questions.length} original questions and {practiceForms.length} short forms. Full-length mock examinations published: 0. Specialty banks for ACCS, NPS, PFT, and SDS are not written yet. The same question record can hold them later.
      </p>
      <h2>Forms</h2>
      <ul className="rows">
        {practiceForms.map((form) => (
          <li key={form.id}>
            <Link href={`/board-prep/forms/${form.id}`}>
              <span className="row-title">{form.title}</span>
              <span className="row-meta">{form.access} · {form.minutes} minutes</span>
            </Link>
          </li>
        ))}
      </ul>
      <h2>Topics</h2>
      {topics.map((topic) => (
        <section key={topic}>
          <h3>{topic}</h3>
          <ul className="rows notes">
            {questions.filter((question) => question.topic === topic).map((question) => (
              <li key={question.id}>
                <Link href={`/board-prep/questions/${question.id}`}>
                  <span className="row-title">{question.stem}</span>
                  <span className="row-meta">{question.difficulty} · {question.access}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <p>
        Public source: <a href="https://www.nbrc.org/rt/">NBRC respiratory therapy examinations</a>.
      </p>
    </section>
  );
}
