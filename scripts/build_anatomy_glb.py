#!/usr/bin/env python3
"""Build a glTF binary from selected BodyParts3D 4.0 meshes.

The source archive is the 99% polygon-reduced IS-A release. This script does
not generate anatomy. It subsets, and for a few very dense muscles it clusters
vertices on a stated millimeter grid. Clustering is recorded per structure.
"""

from __future__ import annotations

import csv
import json
import math
import struct
import zipfile
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ZIP_PATH = Path("/tmp/anatomy/isa_BP3D_4.0_obj_99.zip")
ELEMENT_PATH = Path("/tmp/anatomy/isa_element_parts.txt")
PARTS_PATH = Path("/tmp/anatomy/isa_parts_list_e.txt")
OUT_GLB = ROOT / "public" / "anatomy" / "adult-male-thoracic.glb"
OUT_JSON = ROOT / "src" / "content" / "generated" / "anatomy-meshes.json"
OUT_NOTICE = ROOT / "public" / "anatomy" / "ATTRIBUTION.txt"

EXACT = {
    "FMA7394",  # trachea
    "FMA7396",  # left main bronchus
    "FMA68418",  # right main bronchus proper
    "FMA13295",  # diaphragm
    "FMA55130",  # epiglottis
    "FMA9615",  # cricoid cartilage
    "FMA55099",  # thyroid cartilage
    "FMA7131",  # esophagus
    "FMA7487",  # body of sternum
    "FMA50872",  # right pulmonary artery
    "FMA50873",  # left pulmonary artery
    "FMA49911",  # right inferior pulmonary vein
    "FMA49913",  # left inferior pulmonary vein
    "FMA49914",  # right superior pulmonary vein
    "FMA49916",  # left superior pulmonary vein
    "FMA8612",  # pulmonary trunk
    "FMA9291",  # cavity of right ventricle
    "FMA9466",  # cavity of left ventricle
    "FMA9465",  # cavity of left atrium
    "FMA11359",  # cavity of right atrium
    "FMA3802",  # trunk of right coronary artery
    "FMA3855",  # trunk of left coronary artery
    "FMA74912",  # trunk of anterior interventricular branch
    "FMA9756",  # external intercostal muscle
    "FMA9757",  # internal intercostal muscle
}

PARENT_EXCLUDE = {
    "FMA7405",
    "FMA7409",
    "FMA68208",
    "FMA31739",
    "FMA12224",
    "FMA66326",
    "FMA66643",
    "FMA13237",
    "FMA13238",
    "FMA87218",
    "FMA4677",
    "FMA9758",
    "FMA13354",
}


def selected(concept: str, name: str) -> bool:
    if concept in PARENT_EXCLUDE:
        return False
    if concept in EXACT:
        return True
    lower = name.lower()
    if lower.startswith(("left ", "right ")) and lower.endswith(" rib") and "cartilage" not in lower:
        return True
    if "bronchial tree" in lower:
        # Sided segmental trees and the lingular bronchi are included.
        # Unsided parent concepts such as "apical segmental bronchial tree"
        # repeat the same geometry and are left out.
        return lower.startswith(("left ", "right ")) or "lingular" in lower
    if lower in {"right vocal ligament", "left vocal ligament"}:
        return True
    if lower in {
        "right inferior nasal concha",
        "left inferior nasal concha",
        "septal nasal cartilage",
        "right clavicle",
        "left clavicle",
    }:
        return True
    return False


def layers_for(name: str, concept: str) -> list[str]:
    lower = name.lower()
    layers: list[str] = []
    if any(k in lower for k in ("trachea", "bronch", "epiglottis", "cricoid", "thyroid cartilage", "vocal", "nasal", "diaphragm")):
        layers.append("respiratory")
    if "rib" in lower or "sternum" in lower or "clavicle" in lower:
        layers.append("skeletal")
    if "cartilage" in lower or "cricoid" in lower or "epiglottis" in lower:
        layers.append("cartilage")
    if "intercostal" in lower or lower == "diaphragm":
        layers.append("muscular")
    if "esophagus" in lower:
        layers.append("digestive")
    if "pulmonary" in lower:
        layers.append("cardiovascular")
        layers.append("pulmonary_circulation")
    if "coronary" in lower:
        layers.append("cardiovascular")
        layers.append("coronary")
    if "ventricle" in lower or "atrium" in lower:
        layers.append("cardiovascular")
    if "ligament" in lower:
        layers.append("ligaments")
    # Stable order, unique.
    seen: list[str] = []
    for layer in layers:
        if layer not in seen:
            seen.append(layer)
    return seen or ["organs"]


def depth_for(name: str) -> int:
    lower = name.lower()
    if any(k in lower for k in ("rib", "sternum", "clavicle", "nasal")):
        return 0
    if "intercostal" in lower:
        return 1
    if lower == "diaphragm":
        return 2
    if any(k in lower for k in ("atrium", "ventricle", "coronary", "pulmonary", "esophagus")):
        return 3
    return 4


def system_for(name: str) -> str:
    lower = name.lower()
    if "esophagus" in lower:
        return "digestive"
    if any(k in lower for k in ("rib", "sternum", "clavicle")):
        return "skeletal"
    if "intercostal" in lower:
        return "muscular"
    if any(k in lower for k in ("atrium", "ventricle", "coronary")):
        return "cardiovascular"
    if "pulmonary" in lower and "bronch" not in lower:
        return "cardiovascular"
    return "respiratory"


def color_for(name: str) -> list[float]:
    lower = name.lower()
    def hex_to(h: str) -> list[float]:
        return [int(h[i : i + 2], 16) / 255 for i in (0, 2, 4)] + [1.0]

    if "coronary" in lower or "ventricle" in lower or "atrium" in lower:
        return hex_to("8d3b45")
    if "pulmonary vein" in lower:
        return hex_to("9a3d4a")
    if "pulmonary" in lower:
        return hex_to("2f5f9e")
    if "rib" in lower or "sternum" in lower or "clavicle" in lower:
        return hex_to("e4dccb")
    if "intercostal" in lower or lower == "diaphragm":
        return hex_to("a14b4b")
    if "cartilage" in lower or "cricoid" in lower or "epiglottis" in lower or "vocal" in lower:
        return hex_to("d7c7a4")
    if "esophagus" in lower:
        return hex_to("c47b6a")
    if "nasal" in lower:
        return hex_to("d9c7a8")
    return hex_to("c9b39a")


def load_obj(raw: bytes) -> tuple[list[tuple[float, float, float]], list[tuple[int, int, int]]]:
    verts: list[tuple[float, float, float]] = []
    faces: list[tuple[int, int, int]] = []
    for line in raw.splitlines():
        if line.startswith(b"v "):
            parts = line.split()
            verts.append((float(parts[1]), float(parts[2]), float(parts[3])))
        elif line.startswith(b"f "):
            idx = []
            for part in line.split()[1:]:
                idx.append(int(part.split(b"/")[0]) - 1)
            if len(idx) >= 3:
                for i in range(1, len(idx) - 1):
                    faces.append((idx[0], idx[i], idx[i + 1]))
    return verts, faces


def cluster(
    verts: list[tuple[float, float, float]],
    faces: list[tuple[int, int, int]],
    mm: float,
) -> tuple[list[tuple[float, float, float]], list[tuple[int, int, int]]]:
    mapping: dict[tuple[int, int, int], int] = {}
    new: list[tuple[float, float, float]] = []
    remap = [-1] * len(verts)
    for i, vert in enumerate(verts):
        key = tuple(int(round(c / mm)) for c in vert)
        slot = mapping.get(key)
        if slot is None:
            slot = len(new)
            mapping[key] = slot
            new.append((key[0] * mm, key[1] * mm, key[2] * mm))
        remap[i] = slot
    seen: set[tuple[int, int, int]] = set()
    out: list[tuple[int, int, int]] = []
    for a, b, c in faces:
        tri = (remap[a], remap[b], remap[c])
        if len(set(tri)) < 3:
            continue
        ordered = tuple(sorted(tri))
        if ordered in seen:
            continue
        seen.add(ordered)
        out.append(tri)
    return new, out


def fit(verts, faces, limit=20000):
    if len(faces) <= limit:
        return verts, faces, None
    mm = 2.0
    current_v, current_f = verts, faces
    used = None
    while mm <= 6.0:
        current_v, current_f = cluster(verts, faces, mm)
        used = mm
        if len(current_f) <= limit:
            break
        mm += 1.0
    return current_v, current_f, used


def normals(verts, faces):
    acc = [[0.0, 0.0, 0.0] for _ in verts]
    for a, b, c in faces:
        ax, ay, az = verts[a]
        bx, by, bz = verts[b]
        cx, cy, cz = verts[c]
        nx = (by - ay) * (cz - az) - (bz - az) * (cy - ay)
        ny = (bz - az) * (cx - ax) - (bx - ax) * (cz - az)
        nz = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax)
        length = math.sqrt(nx * nx + ny * ny + nz * nz) or 1.0
        nx, ny, nz = nx / length, ny / length, nz / length
        for i in (a, b, c):
            acc[i][0] += nx
            acc[i][1] += ny
            acc[i][2] += nz
    out = []
    for nx, ny, nz in acc:
        length = math.sqrt(nx * nx + ny * ny + nz * nz) or 1.0
        out.append((nx / length, ny / length, nz / length))
    return out


def to_y_up(v):
    x, y, z = v
    return (x / 1000.0, z / 1000.0, y / 1000.0)


def pack_glb(meshes: list[dict]) -> bytes:
    bin_parts = []
    buffer_views = []
    accessors = []
    gl_meshes = []
    nodes = []
    materials = []
    cursor = 0

    def align(n=4):
        nonlocal cursor
        pad = (n - cursor % n) % n
        if pad:
            bin_parts.append(b"\x00" * pad)
            cursor += pad

    for mesh in meshes:
        align(4)
        pos = mesh["positions"]
        norm = mesh["normals"]
        idx = mesh["indices"]
        pos_blob = b"".join(struct.pack("<fff", *p) for p in pos)
        norm_blob = b"".join(struct.pack("<fff", *p) for p in norm)
        idx_blob = b"".join(struct.pack("<I", i) for i in idx)
        pos_off = cursor
        bin_parts.append(pos_blob)
        cursor += len(pos_blob)
        norm_off = cursor
        bin_parts.append(norm_blob)
        cursor += len(norm_blob)
        align(4)
        idx_off = cursor
        bin_parts.append(idx_blob)
        cursor += len(idx_blob)
        xs = [p[0] for p in pos]
        ys = [p[1] for p in pos]
        zs = [p[2] for p in pos]
        views_start = len(buffer_views)
        buffer_views.extend(
            [
                {"buffer": 0, "byteOffset": pos_off, "byteLength": len(pos_blob), "target": 34962},
                {"buffer": 0, "byteOffset": norm_off, "byteLength": len(norm_blob), "target": 34962},
                {"buffer": 0, "byteOffset": idx_off, "byteLength": len(idx_blob), "target": 34963},
            ]
        )
        acc_start = len(accessors)
        accessors.extend(
            [
                {
                    "bufferView": views_start,
                    "componentType": 5126,
                    "count": len(pos),
                    "type": "VEC3",
                    "min": [min(xs), min(ys), min(zs)],
                    "max": [max(xs), max(ys), max(zs)],
                },
                {"bufferView": views_start + 1, "componentType": 5126, "count": len(norm), "type": "VEC3"},
                {"bufferView": views_start + 2, "componentType": 5125, "count": len(idx), "type": "SCALAR"},
            ]
        )
        mat_index = len(materials)
        materials.append(
            {
                "name": mesh["name"],
                "doubleSided": True,
                "pbrMetallicRoughness": {
                    "baseColorFactor": mesh["color"],
                    "metallicFactor": 0.0,
                    "roughnessFactor": 0.72,
                },
            }
        )
        gl_meshes.append(
            {
                "name": mesh["name"],
                "primitives": [
                    {
                        "attributes": {"POSITION": acc_start, "NORMAL": acc_start + 1},
                        "indices": acc_start + 2,
                        "material": mat_index,
                    }
                ],
            }
        )
        nodes.append({"name": mesh["name"], "mesh": len(gl_meshes) - 1})

    blob = b"".join(bin_parts)
    gltf = {
        "asset": {
            "version": "2.0",
            "generator": "Lung Learn BodyParts3D subset builder",
            "extras": {
                "attribution": "BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International",
                "license": "https://creativecommons.org/licenses/by/4.0/",
                "source": "https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html",
                "sourceVersion": "BodyParts3D 4.0 IS-A, polygon reduction 99%",
                "coordinateTransform": "millimeters, Z-up to meters, Y-up; centered on the subset bounds",
            },
        },
        "scene": 0,
        "scenes": [{"nodes": list(range(len(nodes)))}],
        "nodes": nodes,
        "meshes": gl_meshes,
        "materials": materials,
        "accessors": accessors,
        "bufferViews": buffer_views,
        "buffers": [{"byteLength": len(blob)}],
    }
    json_bytes = json.dumps(gltf, separators=(",", ":")).encode("utf-8")
    while len(json_bytes) % 4:
        json_bytes += b" "
    while len(blob) % 4:
        blob += b"\x00"
    total = 12 + 8 + len(json_bytes) + 8 + len(blob)
    header = struct.pack("<4sII", b"glTF", 2, total)
    json_chunk = struct.pack("<I4s", len(json_bytes), b"JSON") + json_bytes
    bin_chunk = struct.pack("<I4s", len(blob), b"BIN\x00") + blob
    return header + json_chunk + bin_chunk


def main() -> None:
    if not ZIP_PATH.exists():
        raise SystemExit(f"Missing source archive: {ZIP_PATH}")
    names = {}
    for row in csv.reader(PARTS_PATH.open(), delimiter="\t"):
        if row and row[0].startswith("FMA"):
            names[row[0]] = row[2]
    files = defaultdict(list)
    for concept, _name, file_id in csv.reader(ELEMENT_PATH.open(), delimiter="\t"):
        if concept.startswith("FMA"):
            files[concept].append(file_id)

    chosen = [c for c, n in names.items() if selected(c, n)]
    chosen.sort(key=lambda c: names[c].lower())
    archive = zipfile.ZipFile(ZIP_PATH)
    structures = []
    pending = []
    all_positions = []

    for concept in chosen:
        verts: list[tuple[float, float, float]] = []
        faces: list[tuple[int, int, int]] = []
        for file_id in files.get(concept, []):
            raw = archive.read(f"isa_BP3D_4.0_obj_99/{file_id}.obj")
            part_v, part_f = load_obj(raw)
            base = len(verts)
            verts.extend(part_v)
            faces.extend((a + base, b + base, c + base) for a, b, c in part_f)
        if not faces:
            continue
        source_faces = len(faces)
        verts, faces, cell = fit(verts, faces)
        converted = [to_y_up(v) for v in verts]
        pending.append((concept, names[concept], converted, faces, source_faces, cell))
        all_positions.extend(converted)

    if not all_positions:
        raise SystemExit("No meshes were built")

    cx = sum(p[0] for p in all_positions) / len(all_positions)
    cy = sum(p[1] for p in all_positions) / len(all_positions)
    cz = sum(p[2] for p in all_positions) / len(all_positions)

    # Nasal conchae sit anterior to the tracheal air column in this dataset.
    nasal = [p for c, n, pos, *_ in pending if "nasal concha" in n.lower() for p in pos]
    trachea = [p for c, n, pos, *_ in pending if n.lower() == "trachea" for p in pos]
    nasal_z = sum(p[2] for p in nasal) / len(nasal)
    trachea_z = sum(p[2] for p in trachea) / len(trachea)
    anterior_z_sign = 1 if nasal_z > trachea_z else -1

    def mean_x(label: str) -> float:
        pts = [p for _c, n, pos, *_rest in pending if n.lower() == label for p in pos]
        if not pts:
            raise SystemExit(f"Missing reference mesh for axis check: {label}")
        return sum(p[0] for p in pts) / len(pts)

    left_rib_x = mean_x("left sixth rib")
    right_rib_x = mean_x("right sixth rib")
    # Sign of the axis that points toward the model's anatomical left.
    patient_left_x_sign = 1 if left_rib_x > right_rib_x else -1

    glb_meshes = []
    total_tri = 0
    for concept, name, positions, faces, source_faces, cell in pending:
        centered = [(p[0] - cx, p[1] - cy, p[2] - cz) for p in positions]
        inds = [i for tri in faces for i in tri]
        glb_meshes.append(
            {
                "name": concept,
                "positions": centered,
                "normals": normals(centered, faces),
                "indices": inds,
                "color": color_for(name),
            }
        )
        total_tri += len(faces)
        structures.append(
            {
                "id": concept.lower().replace("fma", "fma-"),
                "fma": concept,
                "name": name[:1].upper() + name[1:],
                "sourceName": name,
                "mesh": concept,
                "layers": layers_for(name, concept),
                "system": system_for(name),
                "sex": "male",
                "depth": depth_for(name),
                "triangles": len(faces),
                "sourceTriangles": source_faces,
                "clusterMillimeters": cell,
                "uberon": None,
            }
        )

    OUT_GLB.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_GLB.write_bytes(pack_glb(glb_meshes))
    manifest = {
        "file": "/anatomy/adult-male-thoracic.glb",
        "sex": "male",
        "label": "Adult male thoracic and airway reference",
        "source": "BodyParts3D 4.0 IS-A, 99% polygon reduction",
        "license": "CC BY 4.0",
        "attribution": "BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International",
        "triangles": total_tri,
        "structures": len(structures),
        "bytes": OUT_GLB.stat().st_size,
        "centerOffsetMeters": [cx, cy, cz],
        "anteriorZSign": anterior_z_sign,
        "patientLeftXSign": patient_left_x_sign,
        "axes": {
            "x": "left-right after centering (sagittal clip)",
            "y": "inferior-superior (transverse clip)",
            "z": "anterior-posterior (coronal clip)",
            "anterior": "+z" if anterior_z_sign > 0 else "-z",
            "patientLeft": "+x" if patient_left_x_sign > 0 else "-x",
        },
        "meshes": structures,
    }
    OUT_JSON.write_text(json.dumps(manifest, indent=2) + "\n")
    OUT_NOTICE.write_text(
        "\n".join(
            [
                "BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International.",
                "License: https://creativecommons.org/licenses/by/4.0/",
                "Database license: https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html",
                "Dataset: https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html",
                "Source file: isa_BP3D_4.0_obj_99.zip (BodyParts3D 4.0, IS-A tree, 99% polygon reduction).",
                "Publication: Mitsuhashi N, et al. BodyParts3D: 3D structure database for anatomical concepts. Nucleic Acids Research. 2009. https://doi.org/10.1093/nar/gkn613",
                "Lung Learn subset: adult male thoracic cage, airway, diaphragm, selected pulmonary vessels, heart-chamber cavities, and neighboring esophagus.",
                "Individual OBJ files distributed in that archive still contain a 2013 header naming CC BY-SA 2.1 Japan. That header points at the database license URL, which the Database Center for Life Science updated on 2025-02-27 to CC BY 4.0. Lung Learn follows the current license statement and keeps this notice with the derivative.",
                "Some dense muscle meshes were simplified by vertex clustering. The millimeter cell, when used, is stored in anatomy-meshes.json. Clustering changes surface detail; it does not add anatomy.",
                "This file is not a complete male body and it is not a female body.",
                "",
            ]
        )
    )
    print(f"structures={len(structures)} triangles={total_tri} bytes={OUT_GLB.stat().st_size} anterior={manifest['axes']['anterior']}")


if __name__ == "__main__":
    main()
