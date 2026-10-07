import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import items from "./transformer-catalog.json";
import { MeshBVH, acceleratedRaycast } from "three-mesh-bvh";
const active = new Set(["lv-coils", "hv-coils", "core-limbs", "lower-yokes", "upper-yoke", "coil-end-rings", "coil-spacers"]);
const enclosure = new Set(["tank", "lid", "seals-covers"]);
function finish(cat, name, color) {
  const f = { color: 0xa8adb0, metalness: 0.82, roughness: 0.26, clearcoat: 0.12, clearcoatRoughness: 0.23 };
  if (Math.max(color.r, color.g, color.b) < 0.015) return { ...f, color: 0x181a1b, metalness: 0.08, roughness: 0.45, clearcoat: 0 };
  if (cat === "tank") return { ...f, color: 0x969b9e, metalness: 0.55, roughness: 0.3, clearcoat: 0.45, clearcoatRoughness: 0.16 };
  if (cat === "lid") return { ...f, color: 0xbfc3c4, metalness: 0.6, roughness: 0.28, clearcoat: 0.3 };
  if (cat === "hv-bushings" && /isolador porcelana/i.test(name) && !/parafuso/i.test(name))
    return { ...f, color: 0x785020, metalness: 0, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.12 };
  if (["lv-coils", "hv-coils", "internal-leads"].includes(cat))
    return { ...f, color: cat === "lv-coils" ? 0xb07842 : 0xa56b37, metalness: 0.7, roughness: 0.3, clearcoat: 0.32 };
  if (["core-limbs", "lower-yokes", "upper-yoke"].includes(cat)) return { ...f, color: 0x687078, metalness: 0.75, roughness: 0.39, clearcoat: 0 };
  if (["coil-spacers", "coil-end-rings"].includes(cat) || /madeira/i.test(name))
    return { ...f, color: 0xb8a27e, metalness: 0, roughness: 0.7, clearcoat: 0 };
  if (cat === "seals-covers" && /veda/i.test(name)) return { ...f, color: 0x303235, metalness: 0, roughness: 0.8, clearcoat: 0 };
  return f;
}
export async function loadTransformer() {
  const response = await fetch("/__private__/transformer/manifest.json");
  if (!response.ok) throw new Error("Local transformer unavailable.");
  const provenance = await response.json();
  const source = (await new GLTFLoader().loadAsync("/__private__/transformer/transformador.glb")).scene;
  const groups = [
    {
      id: "assembly",
      title: "Complete transformer",
      status: "Academic source assembly",
      copy: "Three concentric coil pairs surround the magnetic core inside the enclosure. Open the enclosure to inspect their placement.",
      evidence: "The drawing identifies inner BT and outer AT coils. Winding turns, connection diagram and rated ratio are not supplied.",
    },
    ...items.map(([id, title, copy, relationship, reference]) => ({
      id,
      title,
      copy,
      evidence: relationship,
      status: ["internal-leads", "hardware"].includes(id) ? "Role partly unverified" : "Drawing and geometry match",
      reference,
    })),
  ];
  const root = new THREE.Group(),
    normalization = new THREE.Group();
  root.add(normalization);
  normalization.add(source);
  normalization.scale.setScalar(6);
  source.rotation.x = -Math.PI / 2;
  for (const p of source.children) {
    p.matrixAutoUpdate = true;
    p.matrix.decompose(p.position, p.quaternion, p.scale);
    p.userData.originalPosition = p.position.clone();
    p.userData.originalCenter = new THREE.Box3().setFromObject(p).getCenter(new THREE.Vector3());
    p.traverse((o) => {
      if (!o.isMesh) return;
      if (!o.geometry.boundsTree) o.geometry.boundsTree = new MeshBVH(o.geometry, { indirect: true, maxLeafSize: 10 });
      o.raycast = acceleratedRaycast;
      const old = o.material;
      o.userData.sourceMaterial = old;
      o.userData.finish = finish(p.userData.category, p.userData.source_name || p.name, old.color);
      o.material = new THREE.MeshPhysicalMaterial({ color: old.color.clone(), metalness: old.metalness, roughness: old.roughness, side: old.side });
    });
  }
  root.updateWorldMatrix(true, true);
  const originalBox = new THREE.Box3().setFromObject(source);
  const center = originalBox.getCenter(new THREE.Vector3());
  normalization.position.set(-center.x, -originalBox.min.y, -center.z);
  let selected = groups[0],
    isolated = false,
    opened = false,
    coreOnly = false,
    explosion = 0,
    appearance = "presentation";
  function apply() {
    for (const p of source.children) {
      const cat = p.userData.category;
      p.visible = (!opened || !enclosure.has(cat)) && (!coreOnly || active.has(cat)) && (!isolated || cat === selected.id);
      p.position.copy(p.userData.originalPosition);
      const t = explosion;
      if (t) {
        if (cat === "hv-coils") {
          p.position.x += (p.userData.originalCenter.x - 0.03) * t * 2.8;
          p.position.z += 0.035 * t;
        }
        if (cat === "lv-coils") p.position.z += 0.008 * t;
        if (cat === "upper-yoke") p.position.z += 0.05 * t;
        if (["lid", "hv-bushings", "seals-covers"].includes(cat)) p.position.z += 0.09 * t;
        if (cat === "tank") p.position.y -= 0.1 * t;
        if (cat === "lower-yokes") p.position.z -= 0.03 * t;
      }
      p.traverse((o) => {
        if (!o.isMesh) return;
        const m = o.material;
        if (appearance === "source") {
          const s = o.userData.sourceMaterial;
          m.color.copy(s.color);
          m.metalness = s.metalness;
          m.roughness = s.roughness;
          m.clearcoat = 0;
        } else {
          const f = o.userData.finish;
          m.color.setHex(f.color);
          m.metalness = f.metalness;
          m.roughness = f.roughness;
          m.clearcoat = f.clearcoat;
          m.clearcoatRoughness = f.clearcoatRoughness;
        }
        m.emissive.setHex(cat === selected.id ? 0x183d22 : 0);
        m.emissiveIntensity = 0.12;
      });
    }
    root.updateWorldMatrix(true, true);
  }
  function select(id) {
    selected = groups.find((g) => g.id === id) || groups[0];
    isolated = false;
    coreOnly = false;
    if (active.has(selected.id)) opened = true;
    else if (enclosure.has(selected.id)) opened = false;
    apply();
    return selected;
  }
  function isolate(value) {
    isolated = Boolean(value) && selected.id !== "assembly";
    if (isolated) {
      opened = false;
      coreOnly = false;
    }
    apply();
  }
  function getBounds(group = selected) {
    root.updateWorldMatrix(true, true);
    const b = new THREE.Box3();
    for (const p of source.children)
      if (group.id === "assembly" ? p.visible : p.userData.category === group.id) b.union(new THREE.Box3().setFromObject(p));
    return b;
  }
  apply();
  return {
    id: "transformer",
    title: "Three-phase transformer · local",
    root,
    groups,
    allGroups: groups,
    provenance,
    video: "https://www.youtube.com/watch?v=Vz5x6ZtHdgY",
    tour: [
      {
        id: "tank",
        title: "01 · Inspect the enclosure",
        prompt: "Find the gray tank, radiator tubes and lid. The source geometry provides the exterior; finishes are representative.",
      },
      {
        id: "hv-bushings",
        title: "02 · Find the insulated terminals",
        prompt:
          "Compare the three high-voltage bushings with the low-voltage terminal fittings. Their count alone does not establish a winding connection.",
      },
      {
        id: "lv-coils",
        title: "03 · Open the concentric coils",
        prompt:
          "The inner BT coil sits inside the outer AT coil around each core limb. Separation illustrates placement; it is not a maintenance sequence.",
      },
      {
        id: "core-limbs",
        title: "04 · Follow the magnetic path",
        prompt: "Trace the limbs and upper and lower yokes. Solid CAD profiles do not show individual laminations.",
      },
    ],
    select,
    isolate,
    getBounds,
    pick(raycaster) {
      const hit = raycaster.intersectObjects(
        source.children.filter((p) => p.visible),
        true
      )[0];
      if (!hit) return null;
      let p = hit.object;
      while (p && !p.userData.category) p = p.parent;
      return p
        ? { point: hit.point, distance: hit.distance, group: groups.find((g) => g.id === p.userData.category) || groups[0], part: p.userData.part_id }
        : null;
    },
    get selected() {
      return selected;
    },
    get isolated() {
      return isolated;
    },
    get opened() {
      return opened;
    },
    get explosion() {
      return explosion;
    },
    get triangles() {
      let n = 0;
      source.traverse((o) => {
        if (o.isMesh && o.visible && o.parent.visible) n += (o.geometry.index?.count || o.geometry.attributes.position.count) / 3;
      });
      return n;
    },
    appearance(value) {
      appearance = value;
      apply();
    },
    open(value) {
      opened = value;
      coreOnly = false;
      isolated = false;
      apply();
    },
    core() {
      opened = true;
      coreOnly = true;
      isolated = false;
      selected = groups[0];
      apply();
    },
    separate(value) {
      explosion = THREE.MathUtils.clamp(value, 0, 1);
      apply();
    },
    reset() {
      selected = groups[0];
      opened = false;
      coreOnly = false;
      isolated = false;
      explosion = 0;
      apply();
    },
    dispose() {
      source.traverse((o) => {
        if (o.isMesh) {
          o.geometry.dispose();
          o.material.dispose();
          o.userData.sourceMaterial.dispose();
        }
      });
      root.removeFromParent();
    },
  };
}
