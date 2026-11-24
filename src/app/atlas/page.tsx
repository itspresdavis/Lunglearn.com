import type { Metadata } from "next";
import Link from "next/link";
import { AtlasViewer } from "@/components/atlas-viewer";
import { anatomyManifest, anatomyRecords } from "@/content/anatomy";

export const metadata: Metadata = {
  title: "Anatomy atlas",
  description: "An interactive adult male thoracic atlas built from BodyParts3D meshes, with text records where a mesh is not available.",
};

export default function AtlasPage() {
  return (
    <section className="section wrap-wide">
      <p className="kicker">Anatomy</p>
      <h1>Anatomy atlas</h1>
      <p className="lede">
        {anatomyManifest.structures} named meshes from the adult male BodyParts3D subset. {anatomyRecords.filter((record) => !record.mesh).length} additional records have no mesh and say so.
      </p>
      <p>{anatomyManifest.attribution}</p>
      <AtlasViewer quiz />
      <p>
        <Link href="/atlas/physiology">Physiological diagrams</Link> · <Link href="/atlas/fma-7394">Trachea record</Link>
      </p>
    </section>
  );
}
