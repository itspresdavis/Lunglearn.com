import fs from "fs";
import path from "path";
import * as THREE from "three";

export { ATLAS_LAYERS, clipPosition, visibleMeshIds } from "@/lib/atlas-model";
export type { LayerId } from "@/lib/atlas-model";

export type GlbMesh = {
  name: string;
  positions: Float32Array;
  indices: Uint32Array;
};

export function readGlbMeshes(filePath: string): GlbMesh[] {
  const buffer = fs.readFileSync(filePath);
  const magic = buffer.toString("utf8", 0, 4);
  if (magic !== "glTF") throw new Error("Not a glTF binary.");
  const jsonLength = buffer.readUInt32LE(12);
  const jsonType = buffer.toString("utf8", 16, 20);
  if (jsonType !== "JSON") throw new Error("Missing glTF JSON chunk.");
  const json = JSON.parse(buffer.toString("utf8", 20, 20 + jsonLength)) as {
    meshes: { name: string; primitives: { attributes: { POSITION: number }; indices: number }[] }[];
    accessors: { bufferView: number; count: number; componentType: number; type: string }[];
    bufferViews: { byteOffset?: number; byteLength: number }[];
  };
  const binStart = 20 + jsonLength + 8;
  const meshes: GlbMesh[] = [];
  for (const mesh of json.meshes) {
    const primitive = mesh.primitives[0];
    const position = json.accessors[primitive.attributes.POSITION];
    const index = json.accessors[primitive.indices];
    const positionView = json.bufferViews[position.bufferView];
    const indexView = json.bufferViews[index.bufferView];
    const positionOffset = binStart + (positionView.byteOffset ?? 0);
    const indexOffset = binStart + (indexView.byteOffset ?? 0);
    meshes.push({
      name: mesh.name,
      positions: new Float32Array(buffer.buffer, buffer.byteOffset + positionOffset, position.count * 3),
      indices: new Uint32Array(buffer.buffer, buffer.byteOffset + indexOffset, index.count),
    });
  }
  return meshes;
}

export function meshHits(
  mesh: GlbMesh,
  origin: [number, number, number],
  direction: [number, number, number],
): number {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(mesh.positions, 3));
  geometry.setIndex(new THREE.BufferAttribute(mesh.indices, 1));
  const material = new THREE.MeshBasicMaterial();
  const object = new THREE.Mesh(geometry, material);
  const raycaster = new THREE.Raycaster();
  raycaster.set(new THREE.Vector3(...origin), new THREE.Vector3(...direction).normalize());
  const hits = raycaster.intersectObject(object, false);
  geometry.dispose();
  material.dispose();
  return hits.length;
}

export const ATLAS_GLB_PATH = path.join(process.cwd(), "public", "anatomy", "adult-male-thoracic.glb");
