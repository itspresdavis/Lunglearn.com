# Anatomy data sources

## Used

**BodyParts3D 4.0, IS-A release, 99% polygon reduction.**

- License page: https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html
- License page last updated February 27, 2025. It states CC BY 4.0.
- Required credit, stored in `public/anatomy/ATTRIBUTION.txt` and written onto screenshot exports: “BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International.”
- Paper: Mitsuhashi et al., Nucleic Acids Research, 2009. https://doi.org/10.1093/nar/gkn613
- Individual OBJ headers in the source archive still mention CC BY-SA 2.1 Japan and point at the license URL. This derivative follows the current license page, CC BY 4.0, and keeps that discrepancy in the attribution file.
- The build script is `scripts/build_anatomy_glb.py`. It converts millimeters, Z-up, into meters, Y-up, then centers the subset. Vertex clustering is applied only to the diaphragm and the external and internal intercostals, at 5 mm, because those meshes were far denser than the rest. The innermost intercostals were left out.
- Output: `public/anatomy/adult-male-thoracic.glb`. 74 structures, 325,415 triangles, 8,041,132 bytes.
- Orientation measured from the meshes, not assumed: anterior is −Z (nasal conchae relative to the trachea). The patient’s anatomical left is +X (left versus right sixth rib). Facing the anterior surface, the patient’s left is on the viewer’s right.

## Evaluated and not bundled

**Human Reference Atlas united female, v1.5.** CC BY 4.0. The united file at `https://cdn.humanatlas.io/digital-objects/ref-organ/united-female/v1.5/assets/3d-vh-f-united.glb` is about 212 MB and a single assembly, not individually selectable organs. It is not in the repository. The atlas tells the user this instead of recoloring the male body.

**Z-Anatomy.** CC BY-SA. Share-alike would obligate the surrounding product. It was not imported.

**BioDigital.** Commercial developer and publishing licenses would be a new cost. Nothing was purchased and nothing was downloaded.

## Identifiers

UBERON:0003126 was confirmed for the trachea through the OLS API. Other UBERON ids were not guessed. FMA ids are the BodyParts3D concept ids on the meshes that were included.

## What must not be generated

No anatomical geometry in this project comes from a generative image or mesh model. Missing organs stay missing.
