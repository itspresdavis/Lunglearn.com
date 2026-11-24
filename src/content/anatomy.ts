import manifest from "@/content/generated/anatomy-meshes.json";
import type { EditorialRecord, Reference } from "@/lib/editorial";

const source: Reference = {
  title: "BodyParts3D",
  source: "Database Center for Life Science",
  url: "https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html",
  published: "2025-02-27",
  accessed: "2026-11-23",
  note: "Geometry is the BodyParts3D 4.0 IS-A release, 99% polygon reduction, used under CC BY 4.0.",
};

const mitsuhashi: Reference = {
  title: "BodyParts3D: 3D structure database for anatomical concepts",
  source: "Mitsuhashi N, et al. Nucleic Acids Research",
  url: "https://doi.org/10.1093/nar/gkn613",
  published: "2009",
};

const openstax: Reference = {
  title: "Anatomy and Physiology 2e, The Lungs",
  source: "OpenStax",
  url: "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-2-the-lungs",
  accessed: "2026-11-23",
};

const identityEditorial: EditorialRecord = {
  status: "published",
  version: 1,
  contentClass: "anatomy_identity",
  author: "Lung Learn editorial desk",
  reviewer: null,
  reviewedOn: "2026-11-23",
  publishedOn: "2026-11-23",
  corrections: [],
};

const teachingEditorial: EditorialRecord = {
  status: "clinical_review_required",
  version: 1,
  contentClass: "clinical_education",
  author: "Lung Learn editorial desk",
  reviewer: null,
  reviewedOn: null,
  publishedOn: null,
  corrections: [],
};

export type AnatomyRecord = {
  id: string;
  name: string;
  synonyms: string[];
  latin: string | null;
  system: string;
  layers: string[];
  mesh: string | null;
  sex: "male" | "female" | "not-applicable";
  fma: string | null;
  uberon: string | null;
  location: string;
  relationships: string[];
  composition: string | null;
  function: string | null;
  arterial: string | null;
  venous: string | null;
  innervation: string | null;
  lymphatic: string | null;
  diseases: string[];
  clinical: string | null;
  respiratoryRelevance: string | null;
  related: string[];
  references: Reference[];
  editorial: EditorialRecord;
  geometryNote: string;
  triangles: number | null;
  clusterMillimeters: number | null;
};

type Mesh = (typeof manifest.meshes)[number];

const lobes: Record<string, string> = {
  "fma-68211": "Right upper lobe, apical segment. The conventional name is the apical segmental bronchus.",
  "fma-68213": "Right upper lobe, posterior segment.",
  "fma-68212": "Right upper lobe, anterior segment.",
  "fma-68216": "Right lower lobe, superior segment.",
  "fma-68218": "Right lower lobe, medial basal segment.",
  "fma-68220": "Right lower lobe, lateral basal segment.",
  "fma-68221": "Right lower lobe, posterior basal segment.",
  "fma-68321": "Right lower lobe, anterior basal segment.",
  "fma-68223": "Left upper lobe, apical portion. On the left, the apical and posterior bronchi are often discussed together as the apicoposterior segment; this dataset keeps a separate mesh.",
  "fma-68225": "Left upper lobe, posterior portion.",
  "fma-68222": "Left upper lobe, anterior segment.",
  "fma-68226": "Lingula of the left upper lobe, superior division.",
  "fma-68227": "Lingula of the left upper lobe, inferior division.",
  "fma-68228": "Left lower lobe, superior segment.",
  "fma-68230": "Left lower lobe, medial basal segment. This segment is small and variable.",
  "fma-68232": "Left lower lobe, lateral basal segment.",
  "fma-68233": "Left lower lobe, posterior basal segment.",
  "fma-68231": "Left lower lobe, anterior basal segment.",
};

function geometryNote(mesh: Mesh): string {
  const base = "Adult male reference mesh from BodyParts3D. It is one person's modeled anatomy, not every normal variant.";
  if (!mesh.clusterMillimeters) return base;
  return `${base} Lung Learn clustered vertices on a ${mesh.clusterMillimeters} mm grid because the source mesh was very dense (${mesh.sourceTriangles.toLocaleString("en-US")} triangles to ${mesh.triangles.toLocaleString("en-US")}). Borders are approximate at that scale.`;
}

function fromMesh(mesh: Mesh): AnatomyRecord {
  const segment = lobes[mesh.id];
  const teaching = Boolean(segment) || ["fma-7394", "fma-7396", "fma-68418", "fma-13295", "fma-55130", "fma-9615", "fma-55099"].includes(mesh.id);
  return {
    id: mesh.id,
    name: mesh.name,
    synonyms: [],
    latin: null,
    system: mesh.system,
    layers: mesh.layers,
    mesh: mesh.mesh,
    sex: "male",
    fma: mesh.fma,
    uberon: mesh.id === "fma-7394" ? "UBERON:0003126" : null,
    location: segment ?? `This record is the BodyParts3D structure named “${mesh.sourceName}.”`,
    relationships: segment ? ["Part of the tracheobronchial tree in the adult male reference."] : [],
    composition: null,
    function: null,
    arterial: null,
    venous: null,
    innervation: null,
    lymphatic: null,
    diseases: [],
    clinical: null,
    respiratoryRelevance: segment
      ? "Segmental bronchi matter when a therapist or physician talks about lobar collapse, foreign-body location, or postural drainage. The segment name is not a diagnosis."
      : null,
    related: [],
    references: teaching ? [source, mitsuhashi, openstax] : [source, mitsuhashi],
    editorial: teaching ? teachingEditorial : identityEditorial,
    geometryNote: geometryNote(mesh),
    triangles: mesh.triangles,
    clusterMillimeters: mesh.clusterMillimeters,
  };
}

const meshRecords = manifest.meshes.map(fromMesh);

const textRecords: AnatomyRecord[] = [
  {
    id: "text-lung",
    name: "Lungs",
    synonyms: ["Right lung", "Left lung"],
    latin: "Pulmo",
    system: "respiratory",
    layers: ["respiratory", "organs"],
    mesh: null,
    sex: "not-applicable",
    fma: null,
    uberon: null,
    location: "The lungs fill most of the thoracic cavity, one on each side of the mediastinum, resting on the diaphragm.",
    relationships: ["The right lung usually has three lobes. The left lung usually has two lobes and a cardiac notch.", "The hilum carries the bronchus, pulmonary vessels, bronchial vessels, lymphatics, and nerves."],
    composition: "Spongy, elastic organs made of airways, vessels, lymphatics, and connective tissue. The gas-exchange surface is the alveolar region.",
    function: "They ventilate alveoli and provide the surface where oxygen and carbon dioxide move between air and blood.",
    arterial: "Pulmonary arteries carry mixed-venous blood to the alveolar capillaries. Bronchial arteries supply the airway walls.",
    venous: "Pulmonary veins return oxygenated blood to the left atrium. Bronchial venous blood returns by bronchial and pulmonary routes.",
    innervation: "Pulmonary plexus, with vagal parasympathetic fibers and sympathetic fibers from the thoracic sympathetic trunk.",
    lymphatic: "Superficial and deep lymphatic plexuses drain toward hilar nodes.",
    diseases: ["asthma", "copd", "pneumonia", "pulmonary-edema", "ards"],
    clinical: "Lobar anatomy explains why collapse and infection often respect fissures. It does not tell you which lobe is involved in a particular person without an image or an exam.",
    respiratoryRelevance: "Therapists use lobe and segment language when they assess breath sounds, chest images, and airway clearance.",
    related: ["fma-7394", "fma-7396", "fma-68418", "text-pleura", "text-alveolus"],
    references: [openstax, source],
    editorial: teachingEditorial,
    geometryNote: "BodyParts3D's adult male release used here includes the trachea and bronchial tree but not a lung-parenchyma mesh. Lung Learn does not invent one.",
    triangles: null,
    clusterMillimeters: null,
  },
  {
    id: "text-alveolus",
    name: "Pulmonary alveoli",
    synonyms: ["Alveolus", "Alveolar sac region"],
    latin: null,
    system: "respiratory",
    layers: ["respiratory"],
    mesh: null,
    sex: "not-applicable",
    fma: null,
    uberon: null,
    location: "Microscopic air spaces at the end of the respiratory bronchioles, clustered into alveolar sacs.",
    relationships: ["An alveolus shares walls with its neighbors. The shared wall is the interalveolar septum, which contains capillaries."],
    composition: "A thin epithelium, a fused basement-membrane region, and capillary endothelium. Type II cells produce surfactant.",
    function: "This is the usual site of oxygen and carbon dioxide exchange. It is not a structure you can see on the gross thoracic model.",
    arterial: "Pulmonary capillary blood.",
    venous: "Blood leaves by pulmonary venules.",
    innervation: null,
    lymphatic: null,
    diseases: ["emphysema", "ards", "pulmonary-edema", "pneumonia"],
    clinical: "Flooding, collapse, or destruction of alveoli lowers the surface available for gas exchange. The blood gas shows the result. It does not, by itself, name the disease.",
    respiratoryRelevance: "Surfactant, shunt, and diffusion are taught from this structure. A ventilator setting is not a treatment of the drawing.",
    related: ["text-lung", "text-pleura"],
    references: [openstax],
    editorial: teachingEditorial,
    geometryNote: "No microscopic reconstruction is bundled. The figure on this page is a schematic diagram, drawn as simple geometry so the relationships can be discussed. It is not a micrograph and it is not to scale with the thoracic model.",
    triangles: null,
    clusterMillimeters: null,
  },
  {
    id: "text-pleura",
    name: "Pleura",
    synonyms: ["Visceral pleura", "Parietal pleura"],
    latin: null,
    system: "respiratory",
    layers: ["respiratory"],
    mesh: null,
    sex: "not-applicable",
    fma: null,
    uberon: null,
    location: "The visceral pleura covers the lung. The parietal pleura lines the thoracic wall, diaphragm, and mediastinum. The pleural cavity between them is a potential space with a small amount of fluid.",
    relationships: ["The pleural pressure is normally slightly negative relative to the atmosphere, which keeps the lung expanded."],
    composition: "Serous membranes.",
    function: "They let the lung slide against the chest wall and transmit chest-wall motion to the lung.",
    arterial: null,
    venous: null,
    innervation: "The parietal pleura is sensitive. The visceral pleura has little pain sensation. Irritation of the parietal pleura can cause sharp pain with breathing.",
    lymphatic: null,
    diseases: ["pleural-effusion", "pneumothorax"],
    clinical: "Air or fluid in the pleural space uncouples the chest wall from the lung. The size and the pressure determine how urgent that is. A diagram cannot measure either.",
    respiratoryRelevance: "Therapists recognize the signs of pneumothorax and effusion and the effect of positive pressure on a pleural air leak. Recognition is not the same as a decision to place a chest tube.",
    related: ["text-lung", "fma-13295"],
    references: [openstax],
    editorial: teachingEditorial,
    geometryNote: "The bundled BodyParts3D subset does not include a pleural mesh. None was added.",
    triangles: null,
    clusterMillimeters: null,
  },
  {
    id: "text-carina",
    name: "Carina",
    synonyms: ["Tracheal carina"],
    latin: "Carina tracheae",
    system: "respiratory",
    layers: ["respiratory"],
    mesh: null,
    sex: "not-applicable",
    fma: null,
    uberon: null,
    location: "The ridge at the distal trachea where it divides into the right and left main bronchi. It is a landmark inside the airway, not a separate organ.",
    relationships: ["The right main bronchus leaves the trachea at a shallower angle than the left, which is why aspirated material more often enters the right side. That tendency is not a certainty in every person."],
    composition: "Cartilage and mucosa of the airway bifurcation.",
    function: "It marks the split of the trachea. Sensitive mucosa here produces a strong cough.",
    arterial: null,
    venous: null,
    innervation: null,
    lymphatic: null,
    diseases: [],
    clinical: "Endotracheal tube depth is judged partly by where the tip sits relative to the carina on a radiograph or by bronchoscopy. A tube that enters a main bronchus ventilates one lung.",
    respiratoryRelevance: "Airway management teaching uses the carina as the landmark for tube position. This page does not give a centimeter depth that is safe for every person.",
    related: ["fma-7394", "fma-7396", "fma-68418"],
    references: [openstax, source],
    editorial: teachingEditorial,
    geometryNote: "BodyParts3D models the trachea and both main bronchi. It does not isolate the carina as its own mesh. Use those three structures together.",
    triangles: null,
    clusterMillimeters: null,
  },
];

const overlays: Record<string, Partial<AnatomyRecord>> = {
  "fma-7394": {
    synonyms: ["Windpipe"],
    latin: "Trachea",
    location: "A midline airway in the neck and superior mediastinum, from the cricoid cartilage to the bronchial split.",
    relationships: ["It lies anterior to the esophagus.", "About 16 to 20 C-shaped cartilages keep it open. The posterior wall is membranous."],
    composition: "Cartilage, smooth muscle, and a mucosa with cilia and mucus-producing cells.",
    function: "It conducts air. It does not exchange gas.",
    respiratoryRelevance: "This is the landing zone for an endotracheal tube and the structure a tracheostomy enters below the larynx. Length varies. A standard insertion depth is not in this record.",
    related: ["fma-9615", "fma-7396", "fma-68418", "text-carina", "fma-7131"],
    clinical: "Obstruction, malposition of a tube, and injury from pressure are the problems therapists watch for. The mesh shows shape, not a safe cuff pressure.",
  },
  "fma-7396": {
    synonyms: ["Left mainstem bronchus"],
    location: "From the tracheal bifurcation to the left lobar bronchi. It is longer and more horizontal than the right main bronchus.",
    respiratoryRelevance: "A tube or a foreign body that enters this bronchus ventilates only the left lung. The angle makes that less common than right-sided entry, not impossible.",
    related: ["fma-7394", "fma-68418", "text-carina"],
  },
  "fma-68418": {
    name: "Right main bronchus",
    synonyms: ["Right mainstem bronchus", "Right main bronchus proper"],
    location: "From the tracheal bifurcation into the right lung. It is wider, shorter, and more vertical than the left.",
    respiratoryRelevance: "Aspirated material and a deep endotracheal tube preferentially follow this path. Preferentially is not always.",
    related: ["fma-7394", "fma-7396", "text-carina"],
  },
  "fma-13295": {
    synonyms: ["Thoracoabdominal diaphragm"],
    location: "The dome-shaped muscle separating the thorax from the abdomen. The right dome sits a little higher than the left because of the liver.",
    composition: "Skeletal muscle and a central tendon.",
    function: "It is the main muscle of quiet inspiration. As it contracts, the dome descends, thoracic volume rises, and alveolar pressure falls below atmospheric pressure.",
    innervation: "The phrenic nerves, from cervical roots C3, C4, and C5. BodyParts3D's bundled subset does not include a phrenic-nerve mesh.",
    respiratoryRelevance: "Fatigue, weakness, or a high spinal injury changes the breathing pattern. Accessory muscles and paradoxical abdominal motion are the bedside clues. The animation of this mesh, when used, is a simplified excursion, not a measured tidal volume.",
    related: ["text-lung", "text-pleura", "fma-9756"],
    clinical: "A paralyzed hemidiaphragm elevates on the affected side. Fluoroscopy or ultrasound makes that call. This model cannot.",
  },
  "fma-55130": {
    name: "Epiglottis",
    location: "A cartilage at the entrance of the larynx, attached near the thyroid cartilage and projecting up behind the tongue.",
    function: "It helps protect the laryngeal inlet during swallowing. It is not a lid that hermetically seals the airway in every swallow.",
    respiratoryRelevance: "Swelling here, classically from infection or a burn, can obstruct the airway quickly. Examination of a swollen epiglottis is a specialist procedure, not a casual look with a tongue blade.",
    related: ["fma-55099", "fma-9615"],
  },
  "fma-9615": {
    location: "A complete ring of cartilage below the thyroid cartilage. It is the only complete cartilaginous ring in the airway and the inferior border of the larynx.",
    respiratoryRelevance: "A tracheostomy is placed below this cartilage. Injury or swelling at the cricoid narrows the airway because the ring cannot expand.",
    related: ["fma-7394", "fma-55099", "fma-55130"],
  },
  "fma-55099": {
    location: "The largest laryngeal cartilage, forming the anterior laryngeal prominence.",
    function: "It shields the vocal folds and gives the vocal ligaments and intrinsic muscles something to attach to.",
    related: ["fma-55130", "fma-9615", "fma-55245", "fma-55246"],
  },
};

export const anatomyManifest = manifest;

export const anatomyRecords: AnatomyRecord[] = [
  ...meshRecords.map((record) => ({ ...record, ...overlays[record.id], references: overlays[record.id]?.references ?? record.references })),
  ...textRecords,
];

export function getAnatomy(id: string): AnatomyRecord | undefined {
  return anatomyRecords.find((record) => record.id === id);
}

export function anatomyByLayer(layer: string): AnatomyRecord[] {
  return anatomyRecords.filter((record) => record.layers.includes(layer));
}
