import { anatomyRecords } from "@/content/anatomy";
import { allCareerArticles, specialties } from "@/content/career";
import { courses, lessons } from "@/content/curriculum";
import { diseases } from "@/content/diseases";
import { medications } from "@/content/medications";
import { questions } from "@/content/questions";
import { schools } from "@/content/schools";
import { simulations } from "@/content/simulation-cases";
import { statisticReleases } from "@/content/statistics";
import { calculators, referenceArticles } from "@/content/tools";
import { isIndexable } from "@/lib/editorial";
import { searchDocuments, type SearchDocument } from "@/lib/search";

export function documents(): SearchDocument[] {
  const docs: SearchDocument[] = [];
  for (const article of allCareerArticles()) {
    docs.push({
      id: `career-${article.slug}`,
      type: specialties.some((item) => item.slug === article.slug) ? "Specialty" : "Career",
      title: article.title,
      href: specialties.some((item) => item.slug === article.slug) ? `/explore/specialties/${article.slug}` : `/explore/${article.slug}`,
      text: article.blocks.map((block) => ("text" in block ? block.text : "items" in block ? block.items.join(" ") : "")).join(" "),
      access: "free",
    });
  }
  for (const record of anatomyRecords) {
    docs.push({
      id: `anatomy-${record.id}`,
      type: "Anatomy",
      title: record.name,
      href: `/atlas/${record.id}`,
      text: [record.location, record.function, record.respiratoryRelevance, record.synonyms.join(" ")].filter(Boolean).join(" "),
      access: "free",
    });
  }
  for (const lesson of lessons) {
    docs.push({
      id: `lesson-${lesson.slug}`,
      type: "Lesson",
      title: lesson.title,
      href: `/academy/${lesson.course}/${lesson.slug}`,
      text: lesson.blocks.map((block) => ("text" in block ? block.text : "")).join(" "),
      access: lesson.access,
    });
  }
  for (const disease of diseases) {
    docs.push({
      id: `disease-${disease.slug}`,
      type: "Disease",
      title: disease.title,
      href: `/diseases/${disease.slug}`,
      text: `${disease.definition} ${disease.pathophysiology}`,
      access: "free",
    });
  }
  for (const medication of medications) {
    docs.push({
      id: `med-${medication.slug}`,
      type: "Medication",
      title: medication.generic,
      href: `/pharmacology/${medication.slug}`,
      text: `${medication.className} ${medication.mechanism}`,
      access: "free",
    });
  }
  for (const calculator of calculators) {
    docs.push({
      id: `calc-${calculator.slug}`,
      type: "Calculator",
      title: calculator.title,
      href: `/calculators/${calculator.slug}`,
      text: calculator.formula,
      access: "free",
    });
  }
  for (const article of referenceArticles) {
    docs.push({
      id: `ref-${article.slug}`,
      type: "Reference",
      title: article.title,
      href: `/reference/${article.slug}`,
      text: article.description,
      access: "free",
    });
  }
  for (const simulation of simulations) {
    docs.push({
      id: `sim-${simulation.id}`,
      type: "Simulation",
      title: simulation.title,
      href: `/simulations/${simulation.id}`,
      text: simulation.stem,
      access: simulation.access,
    });
  }
  for (const question of questions) {
    docs.push({
      id: question.id,
      type: "Question",
      title: question.stem.slice(0, 90),
      href: `/board-prep/questions/${question.id}`,
      text: question.topic,
      access: question.access,
    });
  }
  for (const school of schools) {
    docs.push({
      id: `school-${school.slug}`,
      type: "School",
      title: school.institution,
      href: `/schools/${school.slug}`,
      text: `${school.program} ${school.state} ${school.degreeLabel}`,
      access: "free",
    });
  }
  return docs;
}

export function queryCatalog(query: string) {
  return searchDocuments(documents(), query);
}

export function resourceCounts() {
  const flashcards = lessons.reduce((sum, lesson) => sum + lesson.terms.length, 0) + diseases.length;
  return {
    lessons: lessons.length,
    courses: courses.length,
    diseases: diseases.length,
    medications: medications.length,
    questions: questions.length,
    simulations: simulations.length,
    calculators: calculators.length,
    referenceArticles: referenceArticles.length,
    anatomyRecords: anatomyRecords.length,
    anatomyMeshes: anatomyRecords.filter((record) => record.mesh).length,
    schools: schools.length,
    careerArticles: allCareerArticles().length,
    statisticReleases: statisticReleases.length,
    flashcardSeeds: flashcards,
    fullLengthExams: 0,
  };
}

export function indexablePaths(): string[] {
  const paths = ["/", "/explore", "/schools", "/atlas", "/calculators", "/pricing", "/board-prep"];
  for (const article of allCareerArticles()) {
    paths.push(specialties.some((item) => item.slug === article.slug) ? `/explore/specialties/${article.slug}` : `/explore/${article.slug}`);
  }
  for (const school of schools) paths.push(`/schools/${school.slug}`);
  for (const calculator of calculators) {
    if (isIndexable({ references: calculator.references, editorial: calculator.editorial })) {
      paths.push(`/calculators/${calculator.slug}`);
    }
  }
  return paths;
}
