"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import manifest from "@/content/generated/anatomy-meshes.json";
import { ATLAS_LAYERS, visibleMeshIds } from "@/lib/atlas-model";

type MeshInfo = (typeof manifest.meshes)[number];

const MESHES: MeshInfo[] = manifest.meshes;
const BY_ID = new Map(MESHES.map((mesh) => [mesh.mesh, mesh]));
const PRESENT = new Set(MESHES.flatMap((mesh) => mesh.layers));

type ViewName = "anterior" | "posterior" | "left" | "right" | "superior";

function colorForLayers(layers: string[]): THREE.Color {
  if (layers.includes("respiratory")) return new THREE.Color("#d9b7b0");
  if (layers.includes("coronary")) return new THREE.Color("#8d3030");
  if (layers.includes("veins")) return new THREE.Color("#3d5f8a");
  if (layers.includes("arteries") || layers.includes("cardiovascular")) return new THREE.Color("#b94a48");
  if (layers.includes("skeletal") || layers.includes("cartilage")) return new THREE.Color("#e6d7c3");
  if (layers.includes("muscular")) return new THREE.Color("#c4786a");
  if (layers.includes("digestive")) return new THREE.Color("#c4a574");
  return new THREE.Color("#d7c3b0");
}

export function AtlasViewer({ highlight, quiz = false }: { highlight?: string; quiz?: boolean }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    selected: highlight ? [highlight] : ([] as string[]),
    hidden: [] as string[],
    enabled: [] as string[],
    opacity: {} as Record<string, number>,
    clips: { sagittal: 0, coronal: 0, transverse: 0 },
    explode: 0,
    depth: 4,
    breathe: false,
  });
  const apiRef = useRef<{ view: (name: ViewName) => void; shot: () => void } | null>(null);
  const [webgl, setWebgl] = useState(true);
  const [sex, setSex] = useState<"male" | "female">("male");
  const [selected, setSelected] = useState<string[]>(highlight ? [highlight] : []);
  const [hidden, setHidden] = useState<string[]>([]);
  const [enabled, setEnabled] = useState<string[]>([]);
  const [opacity, setOpacity] = useState<Record<string, number>>({});
  const [clips, setClips] = useState({ sagittal: 0, coronal: 0, transverse: 0 });
  const [explode, setExplode] = useState(0);
  const [depth, setDepth] = useState(4);
  const [breathe, setBreathe] = useState(false);
  const [status, setStatus] = useState("Loading the adult male thoracic model.");
  const labelRef = useRef<HTMLSpanElement>(null);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [quizNote, setQuizNote] = useState("");
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    const narrow = window.matchMedia("(max-width: 800px)").matches;
    const initial = ATLAS_LAYERS.map((layer) => layer.id).filter((id) => PRESENT.has(id) && !(narrow && id === "muscular"));
    setEnabled(initial);
    stateRef.current.enabled = initial;
    const stored = window.localStorage.getItem("ll-atlas-views");
    if (stored) {
      try {
        setSaved(Object.keys(JSON.parse(stored) as Record<string, unknown>));
      } catch {
        setSaved([]);
      }
    }
    if (quiz) {
      const pool = MESHES.filter((mesh) => mesh.layers.includes("respiratory"));
      const pick = pool[Math.floor(Math.random() * pool.length)];
      if (pick) setQuizId(pick.mesh);
    }
  }, [quiz]);

  useEffect(() => {
    stateRef.current = { selected, hidden, enabled, opacity, clips, explode, depth, breathe };
  }, [selected, hidden, enabled, opacity, clips, explode, depth, breathe]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || sex !== "male") return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: false });
    } catch {
      setWebgl(false);
      setStatus("WebGL is unavailable. The structure list below still works.");
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x102226);
    renderer.localClippingEnabled = true;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, mount.clientWidth / Math.max(1, mount.clientHeight), 0.01, 50);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 0, 0);
    const planes = [
      new THREE.Plane(new THREE.Vector3(1, 0, 0), 10),
      new THREE.Plane(new THREE.Vector3(0, 0, 1), 10),
      new THREE.Plane(new THREE.Vector3(0, 1, 0), 10),
    ];
    const materials = new Map<string, THREE.MeshStandardMaterial>();
    const originals = new Map<string, THREE.Vector3>();
    const centers = new Map<string, THREE.Vector3>();
    const root = new THREE.Group();
    scene.add(root);
    scene.add(new THREE.HemisphereLight(0xf2f7f7, 0x1a2a2e, 1.1));
    const key = new THREE.DirectionalLight(0xffffff, 1.3);
    key.position.set(1, 2, 1);
    scene.add(key);

    let frame = 0;
    let stopped = false;
    let box = new THREE.Box3(new THREE.Vector3(-0.3, -0.3, -0.3), new THREE.Vector3(0.3, 0.3, 0.3));

    function fit(view: ViewName) {
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const dist = Math.max(size.x, size.y, size.z) * 2.15;
      const sign = manifest.anteriorZSign;
      const left = manifest.patientLeftXSign;
      const position = new THREE.Vector3(0, 0, sign * dist);
      if (view === "posterior") position.set(0, 0, -sign * dist);
      if (view === "left") position.set(left * dist, 0, 0);
      if (view === "right") position.set(-left * dist, 0, 0);
      if (view === "superior") position.set(center.x, center.y + dist, center.z + 0.001);
      else position.add(center);
      camera.position.copy(position);
      controls.target.copy(center);
      camera.lookAt(center);
      controls.update();
    }

    const loader = new GLTFLoader();
    loader.load(
      manifest.file,
      (gltf) => {
        root.add(gltf.scene);
        box = new THREE.Box3().setFromObject(gltf.scene);
        gltf.scene.traverse((object) => {
          const mesh = object as THREE.Mesh;
          if (!mesh.isMesh) return;
          const info = BY_ID.get(mesh.name);
          const color = colorForLayers(info?.layers ?? []);
          const material = new THREE.MeshStandardMaterial({
            color,
            roughness: 0.62,
            metalness: 0.02,
            side: THREE.DoubleSide,
            clippingPlanes: planes,
          });
          mesh.material = material;
          materials.set(mesh.name, material);
          originals.set(mesh.name, mesh.position.clone());
          const geometry = mesh.geometry;
          geometry.computeBoundingBox();
          const center = new THREE.Vector3();
          geometry.boundingBox?.getCenter(center);
          center.applyMatrix4(mesh.matrixWorld);
          centers.set(mesh.name, center);
        });
        fit("anterior");
        setStatus(`${manifest.structures} structures, ${manifest.triangles.toLocaleString("en-US")} triangles, ${(manifest.bytes / 1_000_000).toFixed(1)} MB.`);
        try {
          const worker = new Worker("/anatomy/mesh-centers.worker.js");
          gltf.scene.traverse((object) => {
            const mesh = object as THREE.Mesh;
            if (!mesh.isMesh) return;
            const position = mesh.geometry.getAttribute("position");
            if (!position) return;
            const copy = new Float32Array(position.array as ArrayLike<number>);
            worker.postMessage({ id: mesh.name, positions: copy }, [copy.buffer]);
          });
          worker.onmessage = (event: MessageEvent<{ id: string; center: number[] }>) => {
            const [x, y, z] = event.data.center;
            if ([x, y, z].every(Number.isFinite)) centers.set(event.data.id, new THREE.Vector3(x, y, z));
          };
        } catch {
          setStatus((current) => `${current} Mesh centers stayed on the main thread.`);
        }
      },
      undefined,
      () => {
        setWebgl(false);
        setStatus("The model file did not load. The structure list below still works.");
      },
    );

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    function pick(event: PointerEvent) {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(root.children, true).filter((hit) => (hit.object as THREE.Mesh).isMesh && hit.object.visible);
      const hit = hits[0];
      if (!hit) return;
      const id = hit.object.name;
      const current = stateRef.current.selected;
      const next = event.shiftKey ? (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]) : [id];
      stateRef.current.selected = next;
      setSelected(next);
    }
    renderer.domElement.addEventListener("pointerdown", pick);

    apiRef.current = {
      view: fit,
      shot() {
        const source = renderer.domElement;
        const canvas = document.createElement("canvas");
        canvas.width = source.width;
        canvas.height = source.height;
        const context = canvas.getContext("2d");
        if (!context) return;
        context.drawImage(source, 0, 0);
        context.fillStyle = "rgba(16,34,38,0.82)";
        context.fillRect(0, canvas.height - 64, canvas.width, 64);
        context.fillStyle = "#f4fbfa";
        context.font = "16px sans-serif";
        context.fillText(manifest.attribution, 16, canvas.height - 28);
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "lung-learn-atlas.png";
        link.click();
      },
    };

    const started = performance.now();
    function tick() {
      if (stopped) return;
      frame = requestAnimationFrame(tick);
      const state = stateRef.current;
      const size = box.getSize(new THREE.Vector3());
      const min = box.min;
      const pad = 0.02;
      const sagittal = min.x - pad + (size.x + pad * 2) * state.clips.sagittal;
      const coronal = min.z - pad + (size.z + pad * 2) * state.clips.coronal;
      const transverse = min.y - pad + (size.y + pad * 2) * state.clips.transverse;
      planes[0].constant = -sagittal;
      planes[1].constant = -coronal;
      planes[2].constant = -transverse;
      const allowed = new Set(visibleMeshIds(MESHES, state.enabled, state.hidden));
      root.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (!mesh.isMesh) return;
        const info = BY_ID.get(mesh.name);
        const deepEnough = !info || info.depth <= state.depth;
        mesh.visible = allowed.has(mesh.name) && deepEnough;
        const material = materials.get(mesh.name);
        const base = originals.get(mesh.name);
        if (base) {
          const center = centers.get(mesh.name) ?? new THREE.Vector3();
          const offset = center.clone().normalize().multiplyScalar(state.explode * 0.12);
          if (state.breathe && mesh.name === "FMA13295") {
            const scale = 1 - Math.sin(((performance.now() - started) / 1000) * 1.4) * 0.04;
            mesh.scale.set(1, scale, 1);
          } else {
            mesh.scale.set(1, 1, 1);
          }
          mesh.position.copy(base).add(offset);
        }
        if (material && info) {
          const layerOpacity = info.layers.map((layer) => state.opacity[layer] ?? 1);
          material.opacity = Math.min(...layerOpacity);
          material.transparent = material.opacity < 0.99;
          material.emissive.set(state.selected.includes(mesh.name) ? "#f2d27a" : "#000000");
          material.emissiveIntensity = state.selected.includes(mesh.name) ? 0.45 : 0;
        }
      });
      const focus = state.selected[0];
      const center = focus ? centers.get(focus) : undefined;
      const chip = labelRef.current;
      if (chip && focus && center) {
        const projected = center.clone().project(camera);
        const rect = renderer.domElement.getBoundingClientRect();
        chip.hidden = projected.z > 1;
        chip.style.left = `${(projected.x * 0.5 + 0.5) * rect.width}px`;
        chip.style.top = `${(-projected.y * 0.5 + 0.5) * rect.height}px`;
        chip.textContent = BY_ID.get(focus)?.name ?? focus;
      } else if (chip) {
        chip.hidden = true;
      }
      controls.update();
      renderer.render(scene, camera);
    }
    tick();

    const resize = new ResizeObserver(() => {
      if (!mount.clientWidth) return;
      camera.aspect = mount.clientWidth / Math.max(1, mount.clientHeight);
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    });
    resize.observe(mount);

    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      renderer.domElement.removeEventListener("pointerdown", pick);
      controls.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      apiRef.current = null;
    };
  }, [sex]);

  function toggleLayer(id: string) {
    setEnabled((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function saveView() {
    const name = window.prompt("Name this view");
    if (!name) return;
    const raw = window.localStorage.getItem("ll-atlas-views");
    const views = raw ? (JSON.parse(raw) as Record<string, { selected: string[]; enabled: string[] }>) : {};
    views[name] = { selected, enabled };
    window.localStorage.setItem("ll-atlas-views", JSON.stringify(views));
    setSaved(Object.keys(views));
  }

  function restoreView(name: string) {
    const raw = window.localStorage.getItem("ll-atlas-views");
    if (!raw) return;
    const views = JSON.parse(raw) as Record<string, { selected: string[]; enabled: string[] }>;
    const view = views[name];
    if (!view) return;
    setSelected(view.selected);
    setEnabled(view.enabled);
  }

  const selectedRecords = selected.map((id) => BY_ID.get(id)).filter((item): item is MeshInfo => Boolean(item));

  return (
    <div>
      <div className="toolbar" role="toolbar" aria-label="Atlas">
        <div className="tool-group">
          <button type="button" className="btn-quiet" onClick={() => setSex("male")} aria-pressed={sex === "male"}>
            Adult male
          </button>
          <button type="button" className="btn-quiet" onClick={() => setSex("female")} aria-pressed={sex === "female"}>
            Adult female
          </button>
        </div>
        <div className="tool-group">
          {(["anterior", "posterior", "left", "right", "superior"] as ViewName[]).map((view) => (
            <button key={view} type="button" className="btn-quiet" onClick={() => apiRef.current?.view(view)}>
              {view}
            </button>
          ))}
        </div>
        <div className="tool-group">
          <button type="button" className="btn-quiet" onClick={() => setHidden((current) => [...new Set([...current, ...selected])])}>
            Hide selected
          </button>
          <button
            type="button"
            className="btn-quiet"
            onClick={() => setHidden(MESHES.map((mesh) => mesh.mesh).filter((id) => !selected.includes(id)))}
          >
            Isolate
          </button>
          <button type="button" className="btn-quiet" onClick={() => setHidden([])}>
            Restore hidden
          </button>
        </div>
        <div className="tool-group">
          <button type="button" className="btn-quiet" onClick={() => apiRef.current?.shot()}>
            Screenshot
          </button>
          <button type="button" className="btn-quiet" onClick={() => mountRef.current?.requestFullscreen?.()}>
            Full screen
          </button>
          <button type="button" className="btn-quiet" onClick={saveView}>
            Save view
          </button>
          <button type="button" className="btn-quiet" onClick={() => setBreathe((value) => !value)} aria-pressed={breathe}>
            Schematic breath
          </button>
        </div>
      </div>
      {sex === "female" ? (
        <section className="card">
          <h2>Adult female model</h2>
          <p>
            A female body is not included in this release. Recoloring the male mesh would be inaccurate, so the viewer refuses that shortcut. The Human Reference Atlas publishes a CC BY 4.0 united female assembly, but the current file is a single 212 MB model rather than individually selectable organs. It is not bundled.
          </p>
          <p>
            <a href="https://humanatlas.io/3d-reference-library">Human Reference Atlas 3D library</a>
          </p>
        </section>
      ) : (
        <div className="viewport" ref={mountRef} tabIndex={0} aria-label="Interactive adult male thoracic model">
          <span ref={labelRef} className="label-chip" hidden />
        </div>
      )}
      <p className="muted">{status}</p>
      {quiz && quizId ? (
        <p>
          Identification check: select <strong>{BY_ID.get(quizId)?.name}</strong> in the model.{" "}
          <button
            type="button"
            className="btn-quiet"
            onClick={() => {
              const hit = selected.includes(quizId);
              setQuizNote(hit ? "That selection matches the named structure." : "The current selection is a different mesh. Click the named structure.");
            }}
          >
            Check
          </button>{" "}
          {quizNote}
        </p>
      ) : null}
      <div className="grid grid-2">
        <section>
          <h2>Layers in this file</h2>
          <div className="layer-grid">
            {ATLAS_LAYERS.map((layer) => {
              const available = PRESENT.has(layer.id);
              return (
                <label key={layer.id}>
                  <input
                    type="checkbox"
                    checked={available && enabled.includes(layer.id)}
                    disabled={!available}
                    onChange={() => toggleLayer(layer.id)}
                  />{" "}
                  {layer.label}
                  {available ? "" : " — not in this asset"}
                </label>
              );
            })}
          </div>
          {enabled.map((layer) => (
            <label key={layer} className="field">
              {layer} opacity
              <input
                type="range"
                min="0.15"
                max="1"
                step="0.05"
                value={opacity[layer] ?? 1}
                onChange={(event) => setOpacity((current) => ({ ...current, [layer]: Number(event.target.value) }))}
              />
            </label>
          ))}
        </section>
        <section>
          <h2>Cuts and depth</h2>
          <label className="field">
            Sagittal clip. A higher value removes the patient’s right side.
            <input type="range" min="0" max="1" step="0.01" value={clips.sagittal} onChange={(event) => setClips({ ...clips, sagittal: Number(event.target.value) })} />
          </label>
          <label className="field">
            Coronal clip. A higher value removes anterior structures.
            <input type="range" min="0" max="1" step="0.01" value={clips.coronal} onChange={(event) => setClips({ ...clips, coronal: Number(event.target.value) })} />
          </label>
          <label className="field">
            Transverse clip. A higher value removes inferior structures.
            <input type="range" min="0" max="1" step="0.01" value={clips.transverse} onChange={(event) => setClips({ ...clips, transverse: Number(event.target.value) })} />
          </label>
          <label className="field">
            Dissection depth ({depth}). Higher values reveal deeper named structures in this file.
            <input type="range" min="0" max="4" step="1" value={depth} onChange={(event) => setDepth(Number(event.target.value))} />
          </label>
          <label className="field">
            Spacing. This separates meshes so they can be seen. It is not an anatomical explosion of a real dissection.
            <input type="range" min="0" max="1" step="0.01" value={explode} onChange={(event) => setExplode(Number(event.target.value))} />
          </label>
          <p className="muted">Shift-click adds a structure. Click selects one. Arrow keys orbit while the model is focused. The schematic breath only shortens the diaphragm mesh. It is not a measured tidal volume.</p>
          {saved.length ? (
            <p>
              Saved views:{" "}
              {saved.map((name) => (
                <button key={name} type="button" className="btn-quiet" onClick={() => restoreView(name)}>
                  {name}
                </button>
              ))}
            </p>
          ) : null}
        </section>
      </div>
      <section>
        <h2>Selection</h2>
        {selectedRecords.length === 0 ? <p>Select a mesh to open its record.</p> : null}
        <ul>
          {selectedRecords.map((mesh) => (
            <li key={mesh.mesh}>
              <Link href={`/atlas/${mesh.id}`}>{mesh.name}</Link>
              <span className="muted"> · {mesh.layers.join(", ")} · {mesh.triangles.toLocaleString("en-US")} triangles</span>
            </li>
          ))}
        </ul>
      </section>
      {!webgl || sex === "female" ? (
        <section>
          <h2>Structure list</h2>
          <ul>
            {MESHES.map((mesh) => (
              <li key={mesh.id}>
                <Link href={`/atlas/${mesh.id}`}>{mesh.name}</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
