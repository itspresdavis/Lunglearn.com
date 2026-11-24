export const ATLAS_LAYERS = [
  { id: "integumentary", label: "Integumentary system" },
  { id: "skeletal", label: "Skeletal system" },
  { id: "muscular", label: "Muscular system" },
  { id: "nervous", label: "Nervous system" },
  { id: "endocrine", label: "Endocrine system" },
  { id: "cardiovascular", label: "Cardiovascular system" },
  { id: "lymphatic", label: "Lymphatic and immune system" },
  { id: "respiratory", label: "Respiratory system" },
  { id: "digestive", label: "Digestive system" },
  { id: "urinary", label: "Urinary system" },
  { id: "reproductive", label: "Reproductive system" },
  { id: "arteries", label: "Arteries" },
  { id: "veins", label: "Veins" },
  { id: "pulmonary_circulation", label: "Pulmonary circulation" },
  { id: "systemic_circulation", label: "Systemic circulation" },
  { id: "coronary", label: "Coronary circulation" },
  { id: "cerebral_circulation", label: "Cerebral circulation" },
  { id: "peripheral_nerves", label: "Peripheral nerves" },
  { id: "cranial_nerves", label: "Cranial nerves" },
  { id: "lymphatic_vessels", label: "Lymphatic vessels" },
  { id: "lymph_nodes", label: "Lymph nodes" },
  { id: "ligaments", label: "Ligaments" },
  { id: "tendons", label: "Tendons" },
  { id: "fascia", label: "Fascia" },
  { id: "cartilage", label: "Cartilage" },
  { id: "joints", label: "Joints" },
  { id: "organs", label: "Internal organs" },
  { id: "connective", label: "Connective tissues" },
] as const;

export type LayerId = (typeof ATLAS_LAYERS)[number]["id"];

export function visibleMeshIds(
  meshes: { mesh: string; layers: string[] }[],
  enabled: string[],
  hidden: string[],
): string[] {
  const allow = new Set(enabled);
  const hide = new Set(hidden);
  return meshes
    .filter((mesh) => mesh.layers.some((layer) => allow.has(layer)) && !hide.has(mesh.mesh))
    .map((mesh) => mesh.mesh);
}

export function clipPosition(min: number, max: number, t: number): number {
  const clamped = Math.min(1, Math.max(0, t));
  return min + (max - min) * clamped;
}
