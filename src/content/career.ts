import { careerEditorial, statisticReferences } from "@/content/statistics";
import type { EditorialRecord, Reference } from "@/lib/editorial";

export type Block =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "note"; text: string };

export type Article = {
  slug: string;
  title: string;
  description: string;
  kicker: string;
  blocks: Block[];
  references: Reference[];
  editorial: EditorialRecord;
  related: string[];
};

const aarc: Reference = {
  title: "States with RRT entry to licensure",
  source: "American Association for Respiratory Care",
  url: "https://www.aarc.org/advocacy/state-advocacy/states-with-rrt-entry-to-licensure/",
  published: "2026-08",
  accessed: "2026-11-23",
  note: "AARC's summary says that, as of August 2026, 10 states require the RRT credential or an equivalent registry-level qualification for new licensure. Laws change. Read the state board.",
};

const nbrc: Reference = {
  title: "Certified Respiratory Therapist (CRT) and the Respiratory Therapy Examination",
  source: "National Board for Respiratory Care",
  url: "https://www.nbrc.org/examinations/crt/",
  accessed: "2026-11-23",
};

const rn: Reference = {
  title: "Registered Nurses",
  source: "U.S. Bureau of Labor Statistics, Occupational Outlook Handbook",
  url: "https://www.bls.gov/ooh/healthcare/registered-nurses.htm",
  accessed: "2026-11-23",
};

export const articles: Article[] = [
  {
    slug: "how-to-become-a-respiratory-therapist",
    title: "How to become a respiratory therapist",
    description: "The usual path from high school coursework through an accredited program, the NBRC examinations, and a state license.",
    kicker: "Career",
    editorial: careerEditorial,
    references: [statisticReferences.blsOoh, nbrc, aarc],
    related: ["degree-pathways", "crt-and-rrt", "state-licensing"],
    blocks: [
      { type: "p", text: "Most people enter respiratory therapy through an associate degree from a program accredited by the Commission on Accreditation for Respiratory Care. Some employers prefer a bachelor's degree. The Bureau of Labor Statistics describes the usual entry education as an associate degree and says the occupation does not require related work experience or a formal apprenticeship before hire." },
      { type: "h", text: "Before you apply" },
      { type: "p", text: "High school biology, chemistry, algebra, and physics are the courses BLS points future applicants toward. College programs add anatomy and physiology, cardiopulmonary diagnostics and treatment, and supervised clinical practice. Prerequisites differ by school. Read the program's own site, then confirm that it is accredited before you pay a deposit." },
      { type: "h", text: "Credential and license" },
      { type: "p", text: "Graduation does not by itself let you practice. The National Board for Respiratory Care sets the examinations. Through December 31, 2026, the Therapist Multiple-Choice Examination is the entry examination: 160 items, 140 of them scored, over three hours, with a lower cut score for the CRT credential and a higher cut score that can open the Clinical Simulation Examination for eligible candidates. Beginning with the Respiratory Therapy Examination in January 2027, one 185-item, four-hour examination carries separate CRT and RRT cut scores." },
      { type: "p", text: "BLS reports that respiratory therapists must be licensed in every state except Alaska, where national certification is recommended. A license application usually asks for the NBRC result and the accredited degree. AARC reports that a growing group of states requires the RRT, not only the CRT, for new applicants. That list is not a substitute for the state board's rule." },
      { type: "note", text: "Nothing on this page promises admission, a credential, a license, or a job. Boards and employers change their rules." },
    ],
  },
  {
    slug: "what-respiratory-therapists-do",
    title: "What respiratory therapists do",
    description: "The day-to-day work of respiratory therapists, drawn from the Bureau of Labor Statistics description of the occupation.",
    kicker: "Career",
    editorial: careerEditorial,
    references: [statisticReferences.blsOoh],
    related: ["a-day-in-the-life", "specialties"],
    blocks: [
      { type: "p", text: "Respiratory therapists care for people who have trouble breathing. Their patients include premature infants and older adults with chronic lung disease. The work sits at the intersection of assessment, devices, medications that are delivered to the airway, and the machines that support breathing when a person cannot do it alone." },
      { type: "h", text: "The work BLS describes" },
      { type: "ul", items: [
        "Interview and examine people with breathing or cardiopulmonary disorders.",
        "Consult with physicians about the person's condition and the treatment plan.",
        "Perform diagnostic tests, including pulmonary function tests and blood analysis for oxygen and carbon dioxide.",
        "Treat people with methods that clear airways and support oxygenation and ventilation.",
        "Monitor and record progress.",
        "Teach people how to take medications and use equipment.",
      ] },
      { type: "p", text: "In a hospital, that work happens in emergency departments, intensive care units, and neonatal units, among other places. In home care, the same professional may teach a family to use a ventilator, check the equipment, and look for hazards in the house. Some therapists also work with sleep-related breathing disorders and smoking cessation." },
      { type: "h", text: "What the job asks of a person" },
      { type: "p", text: "BLS is plain about the conditions. Most therapists work full time. Hospitals do not close, so nights, weekends, and holidays are part of many jobs. The work involves standing, lifting or turning patients, and exposure to infectious disease. Strains and infections are recognized hazards, which is why precautions are part of the job rather than an afterthought." },
      { type: "p", text: "The qualities BLS highlights are ordinary and demanding at the same time: compassion, attention to detail, patience, problem solving, and the ability to work under a physician's direction as part of a team." },
    ],
  },
  {
    slug: "a-day-in-the-life",
    title: "A day in the life of a respiratory therapist",
    description: "A composite picture of a hospital shift. It is not a diary and it is not a promise about any particular job.",
    kicker: "Career",
    editorial: careerEditorial,
    references: [statisticReferences.blsOoh],
    related: ["what-respiratory-therapists-do", "adult-critical-care"],
    blocks: [
      { type: "p", text: "There is no single day in this profession. A therapist in a 12-bed intensive care unit, a therapist in a pulmonary function lab, and a therapist driving between home-ventilator visits do not live the same schedule. What follows is a composite of the hospital work BLS describes, so a newcomer can picture the rhythm. It is not the story of a real named person, and it is not a survey." },
      { type: "h", text: "The start of a shift" },
      { type: "p", text: "A shift often begins with a report: who is intubated, who is on a high-flow device, who has a treatment due, and who deteriorated overnight. The therapist checks ventilators, oxygen devices, and emergency equipment before trusting them. That habit matters because the machines are only as safe as the person who noticed the leak, the empty cylinder, or the alarm that had been silenced." },
      { type: "h", text: "Through the day" },
      { type: "p", text: "The middle of the shift is a series of assessments and procedures. A therapist may draw and analyze an arterial blood sample, give an aerosolized medication, help a person cough, adjust a ventilator after talking with the physician and nurse, and then walk to the emergency department because someone has just arrived unable to protect their airway. Charting is not a side task. The record is how the next person knows what changed." },
      { type: "h", text: "The part people underestimate" },
      { type: "p", text: "The work is physical and it is often at night. Families ask hard questions. Some patients die. Infectious disease is a routine exposure, not a rare event. None of that cancels the fact that the work is skilled and, for many people, worth doing. It does mean a recruiting page that only talks about wages is incomplete." },
      { type: "note", text: "Schedules, autonomy, and pay vary by employer. Ask the department you are considering, and read the BLS figures as national medians rather than as your future paycheck." },
    ],
  },
  {
    slug: "respiratory-therapy-vs-nursing",
    title: "Respiratory therapy and nursing",
    description: "How the two professions differ in education, legal scope, and pay, using Bureau of Labor Statistics figures.",
    kicker: "Compare",
    editorial: careerEditorial,
    references: [statisticReferences.blsOoh, rn],
    related: ["respiratory-therapy-vs-allied-health", "degree-pathways"],
    blocks: [
      { type: "p", text: "Respiratory therapists and registered nurses work on the same patients and are not interchangeable. Nurses coordinate and provide broad patient care. Respiratory therapists concentrate on breathing, the heart-lung interaction, and the devices and tests that support that work. In a hospital they constantly hand work back and forth. The distinction is one of education, license, and focus, not of rank." },
      { type: "h", text: "Education" },
      { type: "p", text: "BLS says registered nurses usually take one of three paths: a bachelor's degree in nursing, an associate degree in nursing, or a diploma from an approved program, and that they must be licensed. Respiratory therapists typically need an associate degree in respiratory therapy, with some employers preferring a bachelor's degree, and they must be licensed in every state except Alaska." },
      { type: "h", text: "Pay, as a national median" },
      { type: "p", text: "In May 2025, BLS reported a median annual wage of $97,550 for registered nurses and $82,280 for respiratory therapists. Nursing is a much larger occupation: about 3,465,400 jobs in 2025, compared with about 142,000 for respiratory therapists. Projected growth from 2025 to 2035 is 6 percent for registered nurses and 9 percent for respiratory therapists. A higher median is not a reason to choose one license over the other, and a local offer can sit far from either median." },
      { type: "note", text: "Scope of practice is set by state law and by the facility. This comparison is not legal advice and it is not a ranking." },
    ],
  },
  {
    slug: "respiratory-therapy-vs-allied-health",
    title: "Respiratory therapy and other allied health professions",
    description: "Where respiratory therapy sits among the allied health professions, without invented salary tables.",
    kicker: "Compare",
    editorial: careerEditorial,
    references: [statisticReferences.blsOoh, rn],
    related: ["respiratory-therapy-vs-nursing", "degree-pathways"],
    blocks: [
      { type: "p", text: "Allied health is a family of licensed professions rather than one career with different badges. Physical therapists restore movement. Occupational therapists work on daily activity. Speech-language pathologists work on communication and swallowing. Clinical laboratory scientists analyze specimens. Radiographers produce images. Respiratory therapists are the clinicians whose center of gravity is the airway, the lungs, and mechanical support of breathing." },
      { type: "p", text: "The practical differences show up in the degree, the examination, and the unit where the person spends the night. A respiratory therapy associate degree is a shorter path than a physical therapy doctorate. It is also a different license. Someone who wants to diagnose and treat movement disorders should not choose respiratory therapy because the program is shorter, and someone who wants to manage ventilators should not choose a rehabilitation degree because the national median wage is higher." },
      { type: "p", text: "Lung Learn does not reprint wage figures for professions it has not just checked against the Bureau of Labor Statistics. Registered nursing is included on the comparison page because that Outlook Handbook page was reviewed on the same day. For physical therapy, occupational therapy, diagnostic imaging, and the rest, start at the BLS Occupational Outlook Handbook and read the current profile. State wage files are linked from the salary guide." },
      { type: "ul", items: [
        "[Registered nurses](https://www.bls.gov/ooh/healthcare/registered-nurses.htm)",
        "[Physical therapists](https://www.bls.gov/ooh/healthcare/physical-therapists.htm)",
        "[Occupational therapists](https://www.bls.gov/ooh/healthcare/occupational-therapists.htm)",
        "[Radiologic and MRI technologists](https://www.bls.gov/ooh/healthcare/radiologic-technologists.htm)",
      ] },
    ],
  },
  {
    slug: "degree-pathways",
    title: "Associate and bachelor's pathways",
    description: "What the two common degrees are for, and what neither degree can promise.",
    kicker: "Education",
    editorial: careerEditorial,
    references: [statisticReferences.blsOoh, nbrc],
    related: ["how-to-become-a-respiratory-therapist", "crt-and-rrt"],
    blocks: [
      { type: "p", text: "An accredited associate degree is the typical way into the profession. The program combines classroom science with clinical rotations. Graduates who meet NBRC eligibility can sit for the examination that leads to the CRT credential and, depending on the score and the year's rules, the RRT credential." },
      { type: "p", text: "A bachelor's degree is a second door, not a different profession. Some bachelor's programs are entry-level. Others are degree-completion programs for people who already hold the RRT credential. BLS notes that some employers prefer to hire candidates with a bachelor's degree. Preference is not a national requirement. Leadership, education, research, and some transport or neonatal roles are where the extra degree more often matters, and even then the job posting is the authority." },
      { type: "h", text: "What to compare" },
      { type: "ul", items: [
        "Is the program accredited, and for which degree? Confirm on the CoARC directory, not only in a brochure.",
        "How many clinical hours are required, and in which kinds of units?",
        "What have recent graduates actually paid? Publish a tuition number only when the college states it. Lung Learn leaves tuition blank until that happens.",
        "Does the state where you want to work require the RRT for a new license?",
      ] },
      { type: "note", text: "A degree from an unaccredited program can block the NBRC examination. That is a costly way to discover the directory." },
    ],
  },
  {
    slug: "crt-and-rrt",
    title: "CRT and RRT credentials",
    description: "How the Certified Respiratory Therapist and Registered Respiratory Therapist credentials are awarded, including the January 2027 examination.",
    kicker: "Credential",
    editorial: careerEditorial,
    references: [nbrc, aarc, statisticReferences.blsOoh],
    related: ["state-licensing", "how-to-become-a-respiratory-therapist"],
    blocks: [
      { type: "p", text: "CRT and RRT are credentials of the National Board for Respiratory Care. They are not academic degrees, and they are not the same thing as a state license. Employers and state boards use them as evidence that a candidate passed a national examination." },
      { type: "h", text: "Through December 31, 2026" },
      { type: "p", text: "The Therapist Multiple-Choice Examination has 160 multiple-choice items, 140 scored and 20 pretest, and a three-hour limit. Two cut scores apply. The lower score earns the CRT credential. The higher score earns the CRT credential and, for an eligible candidate, the chance to take the Clinical Simulation Examination. The RRT credential requires that further examination. NBRC's outline for this examination is effective January 2020 through December 31, 2026." },
      { type: "h", text: "Beginning in January 2027" },
      { type: "p", text: "The Respiratory Therapy Examination has 185 multiple-choice items, 160 scored and 25 pretest, and a four-hour limit. The low cut score earns the CRT credential. The high cut score earns the RRT credential. There are not two separate examinations for those two credentials under this design. NBRC tells candidates to use the detailed content outline for the date on which they will test." },
      { type: "p", text: "Lung Learn does not sell or reproduce NBRC items, Kettering items, or any other company's questions. Practice material on this site is original, and it does not predict whether a person will pass. NBRC does not endorse Lung Learn." },
      { type: "note", text: "Eligibility rules are detailed: age, an accredited associate degree, and several alternate pathways for people who already hold the CRT. Read the current NBRC handbook before you apply. This summary is not the handbook." },
    ],
  },
  {
    slug: "state-licensing",
    title: "State licensing",
    description: "Why a national credential is not a license, and where the rules actually live.",
    kicker: "License",
    editorial: careerEditorial,
    references: [statisticReferences.blsOoh, aarc],
    related: ["crt-and-rrt", "travel-respiratory-therapy"],
    blocks: [
      { type: "p", text: "BLS states that respiratory therapists must be licensed in every state except Alaska, where national certification is recommended. The requirements vary. A license is permission from a state to practice. The CRT or RRT is a national credential that the state may require as part of that permission." },
      { type: "h", text: "RRT as the entry credential" },
      { type: "p", text: "AARC's August 2026 summary lists 10 states that require the RRT credential, or an equivalent registry-level qualification, for new licensure: Ohio and California (2015), Arizona (2017), Oregon and New Mexico (2018), Georgia (2020), Washington and West Virginia (2022), Missouri (January 1, 2027), and Indiana (January 1, 2028). AARC also notes that New Jersey's earlier requirement was rescinded. Grandparent provisions differ. A person who already holds a CRT license is not automatically affected in the same way as a new applicant." },
      { type: "p", text: "Do not treat that paragraph as the statute. AARC is a professional society summarizing board actions, and boards amend rules. Before you move or apply, read the practice act and the current application on the state board's own site. AARC keeps a contact list for those boards." },
      { type: "ul", items: [
        "AARC's RRT-entry summary: https://www.aarc.org/advocacy/state-advocacy/states-with-rrt-entry-to-licensure/",
        "AARC's state board contacts: https://www.aarc.org/membership/state-societies/state-society-advocacy-resources/list-of-respiratory-therapist-state-licensure-contacts/",
      ] },
      { type: "note", text: "Lung Learn does not provide legal advice and does not file license applications." },
    ],
  },
  {
    slug: "respiratory-therapist-salary",
    title: "Respiratory therapist salary",
    description: "National wages from the Bureau of Labor Statistics, and what those figures do not say.",
    kicker: "Wages",
    editorial: careerEditorial,
    references: [statisticReferences.blsOoh, statisticReferences.blsOews],
    related: ["travel-respiratory-therapy", "how-to-become-a-respiratory-therapist"],
    blocks: [
      { type: "p", text: "In May 2025, the median annual wage for respiratory therapists was $82,280, or $39.56 an hour. The median is the middle: half of workers earned less and half earned more. BLS says the lowest 10 percent earned less than $63,660 and the highest 10 percent earned more than $118,050. The May 2025 OEWS news release also reports a mean hourly wage of $41.97 and a mean annual wage of $87,300 for 139,790 wage-and-salary respiratory therapists. The mean sits above the median, which is what happens when the top of the distribution pulls the average up." },
      { type: "h", text: "Industry medians, May 2025" },
      { type: "ul", items: [
        "Offices of other health practitioners: $88,020",
        "Hospitals, state, local, and private: $82,730",
        "Nursing care facilities: $79,270",
        "Offices of physicians: $77,890",
      ] },
      { type: "p", text: "About 80 percent of the jobs were in hospitals. A higher median in a small industry is not evidence that most therapists can get that job." },
      { type: "h", text: "Experience, states, and travel pay" },
      { type: "p", text: "BLS does not publish a separate entry-level wage and experienced wage for this occupation. The 10th and 90th percentiles are not years of experience. A new graduate in a high-wage city can earn more than a veteran in a low-wage region. State estimates exist in the OEWS tables. Lung Learn links to those tables instead of retyping a state grid it has not stored from the official workbook." },
      { type: "p", text: "Travel contracts, stipends, and shift differentials are not a line in the Outlook Handbook. Anyone quoting a weekly travel rate as if it were a BLS wage is mixing two different things. See the travel page before you compare a contract offer with the $82,280 median." },
      { type: "note", text: "These figures do not guarantee a salary, a signing bonus, or a job." },
    ],
  },
  {
    slug: "travel-respiratory-therapy",
    title: "Travel respiratory therapy",
    description: "What travel work is, and why Lung Learn does not publish a travel pay number.",
    kicker: "Work settings",
    editorial: careerEditorial,
    references: [statisticReferences.blsOoh, aarc],
    related: ["respiratory-therapist-salary", "state-licensing"],
    blocks: [
      { type: "p", text: "Travel respiratory therapists take temporary contracts, often through an agency, and work away from home for a set number of weeks. Pay may be split among a taxable hourly wage, housing, and other stipends. The mix changes with the contract, the season, and the hospital's staffing crisis. There is no BLS series that isolates travel respiratory therapy, so Lung Learn does not invent a national travel rate." },
      { type: "h", text: "The parts that are easy to miss" },
      { type: "ul", items: [
        "A license is state-specific. A contract in a new state can require a new application, and some states want the RRT for new applicants.",
        "Benefits, cancellation clauses, and guaranteed hours are contract terms. Read them.",
        "Housing stipends are not the same thing as wages. Tax treatment is a question for a tax adviser, not for an education site.",
        "The clinical expectations can be high on day one. A traveler is often hired because the unit is already short.",
      ] },
      { type: "p", text: "Compare a contract with the BLS median only after you have converted it to an honest annual picture: weeks worked, weeks unpaid between contracts, benefits you must buy yourself, and duplicate housing. A large weekly number can shrink once those are included." },
    ],
  },
];

export const specialties: Article[] = [
  {
    slug: "adult-critical-care",
    title: "Adult critical care",
    description: "Respiratory therapy in adult intensive care units.",
    kicker: "Specialty",
    editorial: careerEditorial,
    references: [statisticReferences.blsOoh],
    related: ["a-day-in-the-life", "neonatal-and-pediatric"],
    blocks: [
      { type: "p", text: "Adult critical care is where many new graduates meet the full weight of the job. Patients may be intubated, sedated, and dependent on a ventilator. The therapist manages the airway, interprets graphics and blood gases, responds to emergencies, and works beside nursing and medicine. BLS places hospitals, including intensive care, at the center of the occupation: about 80 percent of jobs were in hospitals in 2025." },
      { type: "p", text: "The NBRC adult critical care specialist examination is a separate credential for people who already hold the RRT and meet practice requirements. Lung Learn does not imply that reading this page prepares anyone for that examination. The draw of the work is also its cost: nights, rapid decisions, and patients who do not survive." },
    ],
  },
  {
    slug: "neonatal-and-pediatric",
    title: "Neonatal and pediatric respiratory care",
    description: "Care for newborns and children, including the limits of adult habits.",
    kicker: "Specialty",
    editorial: careerEditorial,
    references: [statisticReferences.blsOoh],
    related: ["adult-critical-care"],
    blocks: [
      { type: "p", text: "BLS notes that respiratory therapists care for premature infants whose lungs are not fully developed as well as for older adults. Neonatal and pediatric units are not smaller adult units. Drug doses, tube sizes, ventilator settings, and the way a child compensates for illness are different. Many departments require specific orientation before a therapist works independently in a neonatal intensive care unit." },
      { type: "p", text: "The NBRC offers a neonatal/pediatric specialist credential for eligible RRTs. Eligibility and the examination outline live on the NBRC site. This page is an introduction to the career path, not a clinical protocol for newborns." },
    ],
  },
  {
    slug: "pulmonary-function-testing",
    title: "Pulmonary function testing",
    description: "Laboratory testing of lung volumes, flows, and gas transfer.",
    kicker: "Specialty",
    editorial: careerEditorial,
    references: [statisticReferences.blsOoh],
    related: ["what-respiratory-therapists-do"],
    blocks: [
      { type: "p", text: "BLS describes pulmonary function testing as one of the diagnostic tasks of the profession: the patient breathes into an instrument that measures volume and flow. A full laboratory also measures lung volumes, diffusing capacity, and the response to a bronchodilator, and it may perform bronchial challenge or exercise tests. The work is precise and repetitive in a way that bedside critical care is not. It still requires judgment about whether a test is acceptable or whether the person needs to stop." },
      { type: "p", text: "The NBRC pulmonary function technologist credential is a specialist examination. Passing the entry respiratory examination does not confer it." },
    ],
  },
  {
    slug: "sleep-medicine",
    title: "Sleep medicine",
    description: "Respiratory therapists and the testing and treatment of sleep-disordered breathing.",
    kicker: "Specialty",
    editorial: careerEditorial,
    references: [statisticReferences.blsOoh],
    related: ["home-respiratory-care"],
    blocks: [
      { type: "p", text: "BLS notes that some respiratory therapists diagnose breathing problems related to sleep apnea and counsel people about smoking. In a sleep center, the work includes overnight monitoring, positive-airway-pressure titration, and education about the masks and devices people will use at home. Hours are deliberately nocturnal. The NBRC sleep disorders specialist credential is separate from the CRT and RRT." },
    ],
  },
  {
    slug: "home-respiratory-care",
    title: "Home respiratory care",
    description: "Ventilators, oxygen, and education outside the hospital.",
    kicker: "Specialty",
    editorial: careerEditorial,
    references: [statisticReferences.blsOoh],
    related: ["travel-respiratory-therapy", "sleep-medicine"],
    blocks: [
      { type: "p", text: "BLS describes home-care therapists teaching families to use ventilators and other life-support equipment, inspecting and cleaning devices, checking the home for hazards, and making emergency visits. The clinical decisions are different from an intensive care unit because the equipment, the helpers, and the distance to a hospital have all changed. It is not lighter work by default. A ventilator in a living room still fails, and the person who answers may be the therapist on call." },
    ],
  },
  {
    slug: "transport-medicine",
    title: "Transport medicine",
    description: "Moving critically ill patients by ground or air.",
    kicker: "Specialty",
    editorial: careerEditorial,
    references: [statisticReferences.blsOoh],
    related: ["adult-critical-care"],
    blocks: [
      { type: "p", text: "Some respiratory therapists move patients between hospitals or from the scene of an emergency, by ambulance or aircraft. The environment is cramped, loud, and poorly suited to the usual intensive-care assumptions about power, oxygen supply, and extra hands. Teams are small. Additional training and, often, experience in critical care come before independent transport work. BLS does not publish a separate wage for transport therapists." },
    ],
  },
  {
    slug: "education-and-management",
    title: "Education and management",
    description: "Teaching, supervising, and running respiratory care departments.",
    kicker: "Specialty",
    editorial: careerEditorial,
    references: [statisticReferences.blsOoh],
    related: ["degree-pathways"],
    blocks: [
      { type: "p", text: "Departments need educators, supervisors, and managers. Programs need faculty and clinical instructors. BLS says some employers prefer a bachelor's degree at hire. Academic and leadership roles more often ask for a bachelor's or graduate degree and for years of practice. Those preferences are hiring policies, not a national license rule. Management trades some of the bedside work for staffing, budgets, and responsibility when the department is short." },
    ],
  },
  {
    slug: "research-and-industry",
    title: "Research and medical device careers",
    description: "Paths outside the bedside, and the caution that comes with them.",
    kicker: "Specialty",
    editorial: careerEditorial,
    references: [statisticReferences.blsOoh],
    related: ["education-and-management"],
    blocks: [
      { type: "p", text: "Respiratory therapists work in clinical research, in device and pharmaceutical companies, and in education for those companies. The credential and the bedside experience are the usual entry, sometimes with a graduate degree for investigator roles. Industry jobs can pay differently from the hospital median and can come with sales targets or restrictions on what the person may say about a product. BLS does not break out a wage for this slice of the occupation. A job that markets a device is not the same job as one that studies it." },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug) ?? specialties.find((article) => article.slug === slug);
}

export function allCareerArticles(): Article[] {
  return [...articles, ...specialties];
}
