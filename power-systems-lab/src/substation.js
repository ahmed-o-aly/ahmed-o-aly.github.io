import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshBVH, acceleratedRaycast } from "three-mesh-bvh";

const base = "./data/substation/";
export async function fetchData(name, kind = "json") {
  const response = await fetch(base + name);
  if (!response.ok) throw new Error(`Asset ${name} could not be loaded (${response.status}).`);
  return kind === "json" ? response.json() : response.arrayBuffer();
}
async function unpack(name) {
  const response = await fetch(base + name);
  if (!response.ok) throw new Error(`Asset ${name} could not be loaded (${response.status}).`);
  const bytes = await response.arrayBuffer(),
    magic = new Uint8Array(bytes, 0, Math.min(2, bytes.byteLength));
  // Some servers label .gz responses for automatic browser decompression.
  if (magic[0] !== 31 || magic[1] !== 139) return bytes;
  if (!globalThis.DecompressionStream)
    throw new Error("This browser cannot unpack the model. Open this lab in a current Chrome, Firefox, Safari or Quest Browser.");
  return new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"))).arrayBuffer();
}
export const SUBSTATION_TOUR = [
  {
    id: "line",
    title: "01 · Follow the incoming line",
    prompt: "Trace the suspended conductors to their support structures. Which parts carry current, and which carry mechanical load?",
  },
  {
    id: "bus",
    title: "02 · Find the shared bus",
    prompt:
      "Follow the long conductors through their repeated support frames. A bus provides a common connection; this model does not establish a switching diagram.",
  },
  {
    id: "disconnect",
    title: "03 · Inspect an isolation candidate",
    prompt: "Inspect the paired posts for a visible opening contact. That mechanism is not established in this mesh.",
  },
  {
    id: "breaker",
    title: "04 · Distinguish the circuit breaker",
    prompt:
      "Find the three enclosed tanks, six angled bushings and operating box. A breaker interrupts current. Its medium and ratings are not supplied here.",
  },
  {
    id: "transformer",
    title: "05 · Trace the transformer exterior",
    prompt: "Locate the main tank, cooling banks and insulated terminals. Identify their roles before isolating the cooling banks or bushings.",
  },
  {
    id: "arrester",
    title: "06 · Compare surge protection",
    prompt: "Inspect these ribbed columns and their connections. A verified connection to earth is needed to confirm this candidate’s role.",
  },
];

export async function loadSubstation() {
  const [buffer, catalog, boundsBuffer, classesBuffer, provenance, bvhBytes, bvhInfo] = await Promise.all([
    unpack("substation.glb.gz"),
    fetchData("equipment.json"),
    fetchData("piece-bounds.bin", "binary"),
    fetchData("surface-classes.bin", "binary"),
    fetchData("provenance.json"),
    unpack("bvh.bin.gz"),
    fetchData("bvh.json"),
  ]);
  const gltf = await new GLTFLoader().parseAsync(buffer, new URL(base, location.href).href);
  const mesh = gltf.scene.children[0],
    originalGeometry = mesh.geometry;
  const sourceIndex = originalGeometry.index;
  const piece = originalGeometry.getAttribute("_source_piece");
  const originalNormals = originalGeometry.getAttribute("normal");
  const smoothNormals = originalGeometry.getAttribute("_presentation_normal");
  const uv = originalGeometry.getAttribute("uv");
  // Only the viewer's UV buffer changes; the packed source remains bit-identical.
  for (let i = 0; i < uv.count; i++) uv.setY(i, 1 - uv.getY(i));
  const roots = [];
  let offset = 0;
  for (const size of bvhInfo.sizes.slice(0, -1)) {
    roots.push(bvhBytes.slice(offset, offset + size));
    offset += size;
  }
  const indirectBuffer = new Uint32Array(bvhBytes.slice(offset));
  originalGeometry.boundsTree = MeshBVH.deserialize({ version: bvhInfo.version, roots, index: sourceIndex.array, indirectBuffer }, originalGeometry, {
    setIndex: false,
  });
  const pickMesh = new THREE.Mesh(originalGeometry, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }));
  pickMesh.raycast = acceleratedRaycast;
  const geometry = new THREE.BufferGeometry();
  for (const [key, value] of Object.entries(originalGeometry.attributes)) geometry.setAttribute(key, value);
  geometry.setIndex(sourceIndex);
  mesh.geometry = geometry;
  mesh.scale.setScalar(0.002);
  mesh.position.set(1, 0, -1.6);
  const root = new THREE.Group();
  root.name = "Substation view";
  root.add(mesh);
  const bounds = new Float32Array(boundsBuffer),
    classes = new Uint8Array(classesBuffer);
  const width = 128,
    height = 120,
    data = new Uint8Array(width * height * 4);
  classes.forEach((value, i) => {
    data[i * 4] = value;
    data[i * 4 + 3] = 255;
  });
  const lookup = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
  lookup.needsUpdate = true;
  const mode = { value: 1 };
  const colors = [0x9ca4a8, 0x785020, 0x858d91, 0xc5c3b8, 0x77878c].map((c) => new THREE.Vector4(...new THREE.Color(c).toArray(), 1));
  const properties = [
    [0.82, 0.28, 0.12, 0.23],
    [0, 0.22, 1, 0.12],
    [0.55, 0.3, 0.45, 0.16],
    [0, 0.93, 0, 0.23],
    [0.85, 0.32, 0, 0.23],
  ].map((v) => new THREE.Vector4(...v));
  const atlas = mesh.material.map;
  mesh.material.dispose();
  const material = new THREE.MeshPhysicalMaterial({
    map: atlas,
    color: 0xffffff,
    roughness: 0.8,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.3,
    side: THREE.DoubleSide,
  });
  mesh.material = material;
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, {
      pieceLookup: { value: lookup },
      appearanceMode: mode,
      finishColors: { value: colors },
      finishProperties: { value: properties },
    });
    shader.vertexShader = "attribute float _source_piece; varying float vPiece;\n" + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\nvPiece=_source_piece;");
    shader.fragmentShader =
      "uniform sampler2D pieceLookup; uniform float appearanceMode; uniform vec4 finishColors[5]; uniform vec4 finishProperties[5]; varying float vPiece;\n" +
      shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <color_fragment>",
      `#include <color_fragment>
      vec2 pieceUV=vec2((mod(vPiece,128.)+.5)/128.,(floor(vPiece/128.)+.5)/120.);
      vec4 pieceInfo=texture2D(pieceLookup,pieceUV);
      int finishID=int(pieceInfo.r*255.+.5);vec4 finish=finishProperties[finishID];
      if(appearanceMode>.5){float shade=clamp(dot(diffuseColor.rgb,vec3(.2126,.7152,.0722))*1.8,0.,1.);diffuseColor.rgb=finishColors[finishID].rgb*mix(.86,1.03,shade);}
      if(pieceInfo.g>.5)diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.37,.51,.38),.1);`
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <roughnessmap_fragment>",
      "#include <roughnessmap_fragment>\nif(appearanceMode>.5)roughnessFactor=finish.y;"
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <metalnessmap_fragment>",
      "#include <metalnessmap_fragment>\nif(appearanceMode>.5)metalnessFactor=finish.x;"
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <lights_physical_fragment>",
      "#include <lights_physical_fragment>\nmaterial.clearcoat=appearanceMode>.5?finish.z:0.;material.clearcoatRoughness=finish.w;"
    );
  };
  material.customProgramCacheKey = () => "elen424-approved-finishes-v1";
  const all = [...catalog.equipment, ...catalog.aliases],
    pieceGroups = new Map();
  // Smaller functional groups (e.g. bushings) win over their encompassing device.
  for (const group of [...all].filter((g) => g.id !== "yard").sort((a, b) => a.pieces.length - b.pieces.length))
    for (const id of group.pieces) if (!pieceGroups.has(id)) pieceGroups.set(id, group);
  let selected = all[0],
    isolated = false,
    allowed = null;
  function sourceBox(group) {
    const frame = group.frame_bounds || group.bounds;
    if (frame) return new THREE.Box3(new THREE.Vector3(...frame.bounds_min), new THREE.Vector3(...frame.bounds_max));
    const box = new THREE.Box3();
    for (const id of group.pieces) {
      box.expandByPoint(new THREE.Vector3(...bounds.subarray(id * 6, id * 6 + 3)));
      box.expandByPoint(new THREE.Vector3(...bounds.subarray(id * 6 + 3, id * 6 + 6)));
    }
    return box;
  }
  function select(id) {
    selected = all.find((g) => g.id === id) || all[0];
    for (let i = 0; i < classes.length; i++) data[i * 4 + 1] = 0;
    if (selected.id !== "yard") for (const id of selected.pieces) data[id * 4 + 1] = 255;
    lookup.needsUpdate = true;
    if (isolated) isolate(true);
    return selected;
  }
  function isolate(value) {
    isolated = Boolean(value) && selected.id !== "yard";
    allowed = isolated ? new Set(selected.pieces) : null;
    if (!allowed) {
      geometry.setIndex(sourceIndex);
      return;
    }
    const indices = [];
    for (let i = 0; i < sourceIndex.count; i += 3)
      if (allowed.has(piece.getX(sourceIndex.array[i]))) indices.push(sourceIndex.array[i], sourceIndex.array[i + 1], sourceIndex.array[i + 2]);
    geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1));
    // Picking still uses the immutable, full-source BVH and face order.
  }
  function pick(raycaster) {
    root.updateWorldMatrix(true, true);
    pickMesh.matrixWorld.copy(mesh.matrixWorld);
    const hits = raycaster.intersectObject(pickMesh, false);
    for (const hit of hits) {
      const id = piece.getX(sourceIndex.array[hit.faceIndex * 3]);
      if (allowed && !allowed.has(id)) continue;
      return { point: hit.point, distance: hit.distance, group: pieceGroups.get(id) || all[0], sourcePiece: id };
    }
    return null;
  }
  select("yard");
  return {
    id: "substation",
    title: "Distribution substation",
    root,
    groups: catalog.equipment,
    allGroups: all,
    tour: SUBSTATION_TOUR,
    provenance,
    select,
    isolate,
    pick,
    get selected() {
      return selected;
    },
    get isolated() {
      return isolated;
    },
    get triangles() {
      return geometry.index.count / 3;
    },
    getBounds(group = selected) {
      root.updateWorldMatrix(true, true);
      return sourceBox(group).applyMatrix4(mesh.matrixWorld);
    },
    appearance(value) {
      mode.value = value === "source" ? 0 : 1;
      geometry.setAttribute("normal", value === "source" ? originalNormals : smoothNormals);
    },
    reset() {
      isolate(false);
      select("yard");
    },
    dispose() {
      geometry.dispose();
      originalGeometry.dispose();
      material.dispose();
      lookup.dispose();
      atlas.dispose();
      pickMesh.material.dispose();
      root.removeFromParent();
    },
  };
}
