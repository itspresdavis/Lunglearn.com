export type School = {
  slug: string;
  institution: string;
  program: string;
  city: string | null;
  state: string;
  degree: "associate" | "bachelor" | "master" | "unspecified";
  degreeLabel: string;
  url: string;
  accreditationNote: string;
  tuition: null;
  outcomes: null;
  reviewedOn: string;
};

export const schools: School[] = [
  {
    slug: "boise-state-university",
    institution: "Boise State University",
    program: "Respiratory Care",
    city: "Boise",
    state: "ID",
    degree: "bachelor",
    degreeLabel: "B.S. in Respiratory Care, including an on-campus option and an RRT-to-B.S. option described on the program page",
    url: "https://www.boisestate.edu/respiratorycare/",
    accreditationNote: "The program page says its degrees are CoARC accredited. Lung Learn did not copy the CoARC directory and has not audited that file. Confirm the current status with CoARC.",
    tuition: null,
    outcomes: null,
    reviewedOn: "2026-11-23",
  },
  {
    slug: "georgia-state-university",
    institution: "Georgia State University, Byrdine F. Lewis College of Nursing and Health Professions",
    program: "Respiratory Therapy",
    city: "Atlanta",
    state: "GA",
    degree: "bachelor",
    degreeLabel: "B.S. in Respiratory Therapy. The program page says classes are on the Atlanta campus.",
    url: "https://lewis.gsu.edu/program/respiratory-therapy-bs/",
    accreditationNote: "Current CoARC status was not copied from CoARC. Confirm it in the CoARC directory before you apply.",
    tuition: null,
    outcomes: null,
    reviewedOn: "2026-11-23",
  },
  {
    slug: "miami-dade-college",
    institution: "Miami Dade College",
    program: "Respiratory Care",
    city: "Miami",
    state: "FL",
    degree: "associate",
    degreeLabel: "Associate in Science",
    url: "https://www.mdc.edu/respiratorycare/",
    accreditationNote: "The page reviewed on 2026-11-23 identifies the A.S. program. It did not, in the text Lung Learn reviewed, replace a check of the CoARC directory.",
    tuition: null,
    outcomes: null,
    reviewedOn: "2026-11-23",
  },
  {
    slug: "valencia-college",
    institution: "Valencia College",
    program: "Respiratory Care",
    city: "Orlando",
    state: "FL",
    degree: "associate",
    degreeLabel: "Associate in Science. The same department page also describes a bachelor's pathway for people who already hold a respiratory care or related associate degree.",
    url: "https://valenciacollege.edu/academics/departments/health-sciences/respiratory-care/",
    accreditationNote: "The college's page discusses CoARC outcomes reporting and says the program has been accredited for many years. Lung Learn is not republishing CoARC outcome tables. Confirm the current status and the outcome numbers with CoARC and the college.",
    tuition: null,
    outcomes: null,
    reviewedOn: "2026-11-23",
  },
];

export const COARC_DIRECTORY = "https://coarc.com/students/find-an-accredited-program/";
