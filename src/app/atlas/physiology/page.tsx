import type { Metadata } from "next";
import { BreathSchematic, GasExchangeSchematic } from "@/components/diagrams";

export const metadata: Metadata = {
  title: "Respiratory physiology diagrams",
  robots: { index: false, follow: true },
};

export default function PhysiologyPage() {
  return (
    <article className="section wrap reading">
      <p className="kicker">Schematic</p>
      <h1>Physiological diagrams</h1>
      <div className="banner">These drawings simplify physiology. They are not measurements, and they are not a substitute for a reviewed animation of a real dataset.</div>
      <h2>Quiet breathing</h2>
      <BreathSchematic />
      <p>On the atlas, the schematic-breath control shortens only the diaphragm mesh. That motion is a teaching cue. It does not calculate a tidal volume.</p>
      <h2>Gas exchange</h2>
      <GasExchangeSchematic />
      <ul>
        <li>Inspiration: the diaphragm descends, thoracic volume rises, alveolar pressure falls below atmospheric pressure, and air enters.</li>
        <li>Expiration at rest is mostly elastic recoil.</li>
        <li>Pulmonary arteries carry mixed-venous blood to alveolar capillaries. Pulmonary veins return to the left atrium.</li>
        <li>Most oxygen in blood is bound to hemoglobin. A small amount is dissolved.</li>
        <li>Carbon dioxide travels dissolved, as bicarbonate, and bound to proteins.</li>
        <li>Ventilation-perfusion mismatch, airway resistance, compliance, bronchoconstriction, and surfactant are taught in the academy. They are not drawn here as if the drawing proved them.</li>
      </ul>
    </article>
  );
}
