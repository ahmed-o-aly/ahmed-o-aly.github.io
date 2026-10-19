import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

/**
 * A teaching laboratory around the amplifier bench: floor, walls, daylight and a
 * working bench at standing height. Metres, Y up, floor at y = 0, so the same
 * room serves the desktop camera and a room-scale WebXR viewer unchanged.
 *
 * The amplifier scene itself is authored Z-up in bench units. BENCH_RIG maps it
 * onto this room; see mountLabRoom's return value.
 */

/** Standing-height bench top. Matches a real electronics bench. */
export const BENCH_HEIGHT = 0.92;
/** Bench units per metre: the ~12.4-unit-wide bench becomes a 1.8 m benchtop. */
export const BENCH_SCALE = 0.145;
const ROOM = { width: 9, depth: 9, height: 3.05 };

const srgb = (hex) => new THREE.Color(hex).convertSRGBToLinear();

/** Canvas textures keep the room detailed without shipping image assets. */
function texture(w, h, draw, { repeat = [1, 1], anisotropy = 8 } = {}) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  draw(canvas.getContext("2d"), w, h);
  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(...repeat);
  map.anisotropy = anisotropy;
  map.colorSpace = THREE.SRGBColorSpace;
  return map;
}

/** Speckled vinyl tile, the usual laboratory floor. */
function floorTexture() {
  return texture(
    512,
    512,
    (c, w, h) => {
      c.fillStyle = "#9aa3a8";
      c.fillRect(0, 0, w, h);
      for (let i = 0; i < 9000; i += 1) {
        const shade = 120 + Math.random() * 110;
        c.fillStyle = `rgba(${shade},${shade + 4},${shade + 8},${0.12 + Math.random() * 0.3})`;
        c.fillRect(Math.random() * w, Math.random() * h, 1.6, 1.6);
      }
      c.strokeStyle = "rgba(70,78,84,0.5)";
      c.lineWidth = 2.5;
      c.strokeRect(0, 0, w, h);
    },
    { repeat: [12, 12] }
  );
}

/** Brushed-steel look for bench legs and instrument trim. */
function steelTexture() {
  return texture(
    256,
    256,
    (c, w, h) => {
      c.fillStyle = "#b7bfc4";
      c.fillRect(0, 0, w, h);
      for (let i = 0; i < 2600; i += 1) {
        const y = Math.random() * h;
        c.strokeStyle = `rgba(255,255,255,${Math.random() * 0.14})`;
        c.beginPath();
        c.moveTo(0, y);
        c.lineTo(w, y + (Math.random() - 0.5) * 2);
        c.stroke();
      }
    },
    { repeat: [2, 2] }
  );
}

/** Dark ESD laminate benchtop with a faint woven grain. */
function benchTopTexture() {
  return texture(
    512,
    512,
    (c, w, h) => {
      c.fillStyle = "#3b4349";
      c.fillRect(0, 0, w, h);
      for (let i = 0; i < 14000; i += 1) {
        const shade = 40 + Math.random() * 46;
        c.fillStyle = `rgba(${shade},${shade + 6},${shade + 10},${0.18 + Math.random() * 0.26})`;
        c.fillRect(Math.random() * w, Math.random() * h, 2, 1);
      }
    },
    { repeat: [4, 2] }
  );
}

export function mountLabRoom(scene, renderer) {
  const room = new THREE.Group();
  room.name = "lab-room";
  scene.add(room);
  const disposables = [];
  const keep = (value) => {
    disposables.push(value);
    return value;
  };

  // Image-based lighting. RoomEnvironment is generated in code, so the reflections
  // that make the instrument cases read as plastic and metal need no external asset
  // and no network fetch.
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.72;
  scene.background = srgb("#aab4bb");
  scene.fog = new THREE.Fog(srgb("#aeb8bf"), 11, 23);

  const standard = (options) => keep(new THREE.MeshStandardMaterial(options));

  // ---- Shell -------------------------------------------------------------
  const floor = new THREE.Mesh(
    keep(new THREE.PlaneGeometry(ROOM.width, ROOM.depth)),
    standard({ map: keep(floorTexture()), roughness: 0.62, metalness: 0.02, color: srgb("#ffffff") })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  room.add(floor);

  const wallMaterial = standard({ color: srgb("#d8dee2"), roughness: 0.95, metalness: 0 });
  const wallGeometry = keep(new THREE.PlaneGeometry(ROOM.width, ROOM.height));
  const walls = [
    [0, ROOM.height / 2, -ROOM.depth / 2, 0],
    [0, ROOM.height / 2, ROOM.depth / 2, Math.PI],
    [-ROOM.width / 2, ROOM.height / 2, 0, Math.PI / 2],
    [ROOM.width / 2, ROOM.height / 2, 0, -Math.PI / 2],
  ];
  for (const [x, y, z, rotation] of walls) {
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.position.set(x, y, z);
    wall.rotation.y = rotation;
    wall.receiveShadow = true;
    room.add(wall);
  }

  const ceiling = new THREE.Mesh(
    keep(new THREE.PlaneGeometry(ROOM.width, ROOM.depth)),
    standard({ color: srgb("#eceff1"), roughness: 1, metalness: 0 })
  );
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = ROOM.height;
  room.add(ceiling);

  // Recessed ceiling panels, the visible source of the room's fill light.
  const panelMaterial = keep(new THREE.MeshBasicMaterial({ color: srgb("#fdfbf4") }));
  for (const x of [-2.1, 2.1]) {
    for (const z of [-2.1, 0, 2.1]) {
      const panel = new THREE.Mesh(keep(new THREE.PlaneGeometry(1.15, 0.4)), panelMaterial);
      panel.rotation.x = Math.PI / 2;
      panel.position.set(x, ROOM.height - 0.012, z);
      room.add(panel);
    }
  }

  // ---- Daylight ----------------------------------------------------------
  // A glazed bay on the far wall. Figure 2 reads as a bright teaching lab, and the
  // window gives the scene a direction to be lit from.
  const glass = standard({
    color: srgb("#cfe4f2"),
    roughness: 0.08,
    metalness: 0,
    transparent: true,
    opacity: 0.55,
    emissive: srgb("#eaf4fc"),
    emissiveIntensity: 0.85,
  });
  const frameMaterial = standard({ color: srgb("#8d969c"), roughness: 0.5, metalness: 0.35 });
  const bay = new THREE.Group();
  bay.position.set(0, 1.72, -ROOM.depth / 2 + 0.03);
  room.add(bay);
  for (const x of [-2.5, 0, 2.5]) {
    const pane = new THREE.Mesh(keep(new THREE.PlaneGeometry(2.2, 1.28)), glass);
    pane.position.set(x, 0, 0);
    bay.add(pane);
    const frame = new THREE.Mesh(keep(new RoundedBoxGeometry(2.32, 1.4, 0.07, 2, 0.02)), frameMaterial);
    frame.position.set(x, 0, -0.03);
    bay.add(frame);
    const mullion = new THREE.Mesh(keep(new THREE.BoxGeometry(0.045, 1.28, 0.05)), frameMaterial);
    mullion.position.set(x, 0, 0.012);
    bay.add(mullion);
  }

  // ---- Lighting ----------------------------------------------------------
  scene.add(keep(new THREE.HemisphereLight(srgb("#f2f7fb"), srgb("#8d969c"), 1.0)));

  const key = new THREE.DirectionalLight(srgb("#fff6e4"), 1.65);
  key.position.set(-2.6, 3.4, 2.9);
  key.target.position.set(0, BENCH_HEIGHT, 0);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far = 12;
  Object.assign(key.shadow.camera, { left: -2.2, right: 2.2, top: 2.2, bottom: -2.2 });
  key.shadow.bias = -0.0008;
  key.shadow.normalBias = 0.02;
  key.shadow.radius = 3;
  key.shadow.blurSamples = 8;
  scene.add(key);
  scene.add(key.target);

  // Cool bounce from the window side, so the far edge of the bench is not black.
  const fill = new THREE.DirectionalLight(srgb("#dceaf6"), 0.55);
  fill.position.set(1.8, 2.6, -3.4);
  fill.target.position.set(0, BENCH_HEIGHT, 0);
  scene.add(fill);
  scene.add(fill.target);

  // ---- Working bench -----------------------------------------------------
  const bench = new THREE.Group();
  bench.name = "lab-bench";
  room.add(bench);

  const TOP = { width: 2.42, depth: 1.16, thickness: 0.045 };
  const top = new THREE.Mesh(
    keep(new RoundedBoxGeometry(TOP.width, TOP.thickness, TOP.depth, 3, 0.008)),
    standard({ map: keep(benchTopTexture()), roughness: 0.42, metalness: 0.06, color: srgb("#ffffff") })
  );
  top.position.set(0, BENCH_HEIGHT - TOP.thickness / 2, 0);
  top.castShadow = true;
  top.receiveShadow = true;
  bench.add(top);

  // Front edge trim, the bullnose of a real bench.
  const trim = new THREE.Mesh(
    keep(new THREE.CylinderGeometry(TOP.thickness / 2, TOP.thickness / 2, TOP.width, 16)),
    standard({ color: srgb("#272d31"), roughness: 0.5, metalness: 0.1 })
  );
  trim.rotation.z = Math.PI / 2;
  trim.position.set(0, BENCH_HEIGHT - TOP.thickness / 2, TOP.depth / 2);
  bench.add(trim);

  const steel = standard({ map: keep(steelTexture()), roughness: 0.38, metalness: 0.72, color: srgb("#ffffff") });
  const carcass = standard({ color: srgb("#aeb6bb"), roughness: 0.66, metalness: 0.08 });
  const drawerFace = standard({ color: srgb("#c4ccd1"), roughness: 0.55, metalness: 0.12 });

  // A drawer pedestal at each end with open knee space between, which is how a
  // teaching bench is actually built. It also means the underside of the bench is
  // never a see-through gap at a low camera angle or standing height in VR.
  const PEDESTAL = { width: 0.62, height: BENCH_HEIGHT - TOP.thickness - 0.07, depth: TOP.depth - 0.16 };
  for (const side of [-1, 1]) {
    const pedestal = new THREE.Group();
    pedestal.position.set(side * (TOP.width / 2 - PEDESTAL.width / 2 - 0.05), 0, -0.02);
    bench.add(pedestal);

    const body = new THREE.Mesh(keep(new THREE.BoxGeometry(PEDESTAL.width, PEDESTAL.height, PEDESTAL.depth)), carcass);
    body.position.y = PEDESTAL.height / 2 + 0.07;
    body.castShadow = true;
    body.receiveShadow = true;
    pedestal.add(body);

    // Recessed plinth, so the cabinet does not look like it is sitting on the floor.
    const plinth = new THREE.Mesh(
      keep(new THREE.BoxGeometry(PEDESTAL.width - 0.06, 0.07, PEDESTAL.depth - 0.06)),
      standard({ color: srgb("#6e767b"), roughness: 0.8, metalness: 0.05 })
    );
    plinth.position.y = 0.035;
    pedestal.add(plinth);

    const drawerGeometry = keep(new RoundedBoxGeometry(PEDESTAL.width - 0.05, PEDESTAL.height / 3 - 0.025, 0.022, 2, 0.006));
    const handleGeometry = keep(new THREE.CylinderGeometry(0.008, 0.008, 0.2, 10));
    for (let i = 0; i < 3; i += 1) {
      const y = 0.07 + (i + 0.5) * (PEDESTAL.height / 3);
      const drawer = new THREE.Mesh(drawerGeometry, drawerFace);
      drawer.position.set(0, y, PEDESTAL.depth / 2 + 0.002);
      drawer.castShadow = true;
      pedestal.add(drawer);
      const handle = new THREE.Mesh(handleGeometry, steel);
      handle.rotation.z = Math.PI / 2;
      handle.position.set(0, y + PEDESTAL.height / 9, PEDESTAL.depth / 2 + 0.02);
      pedestal.add(handle);
    }
  }

  // Back panel closing the knee space, and a rail tying the pedestals together.
  const backPanel = new THREE.Mesh(
    keep(new THREE.BoxGeometry(TOP.width - 0.1, BENCH_HEIGHT - TOP.thickness - 0.16, 0.02)),
    carcass
  );
  backPanel.position.set(0, (BENCH_HEIGHT - TOP.thickness) / 2 + 0.03, -TOP.depth / 2 + 0.1);
  backPanel.castShadow = true;
  backPanel.receiveShadow = true;
  bench.add(backPanel);

  const footRail = new THREE.Mesh(keep(new THREE.BoxGeometry(TOP.width - 1.3, 0.04, 0.04)), steel);
  footRail.position.set(0, 0.12, TOP.depth / 2 - 0.2);
  footRail.castShadow = true;
  bench.add(footRail);

  // A power strip along the back rail: the supply and generator plug into something.
  const strip = new THREE.Mesh(
    keep(new RoundedBoxGeometry(0.85, 0.06, 0.055, 2, 0.012)),
    standard({ color: srgb("#e4e8ea"), roughness: 0.5, metalness: 0.08 })
  );
  strip.position.set(-0.55, BENCH_HEIGHT + 0.03, -TOP.depth / 2 + 0.05);
  strip.castShadow = true;
  bench.add(strip);
  for (let i = 0; i < 4; i += 1) {
    const socket = new THREE.Mesh(
      keep(new THREE.CircleGeometry(0.016, 14)),
      standard({ color: srgb("#3c4349"), roughness: 0.8, metalness: 0 })
    );
    socket.position.set(-0.85 + i * 0.2, BENCH_HEIGHT + 0.032, -TOP.depth / 2 + 0.078);
    socket.rotation.x = -Math.PI / 2 + 0.25;
    bench.add(socket);
  }

  // Contact shadow under the bench; VSM alone leaves the floor looking detached.
  const contact = new THREE.Mesh(
    keep(new THREE.PlaneGeometry(TOP.width + 0.3, TOP.depth + 0.3)),
    keep(
      new THREE.MeshBasicMaterial({
        color: srgb("#5c646a"),
        transparent: true,
        opacity: 0.3,
        depthWrite: false,
        map: keep(
          texture(128, 128, (c, w, h) => {
            const gradient = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
            gradient.addColorStop(0, "rgba(0,0,0,0.85)");
            gradient.addColorStop(0.62, "rgba(0,0,0,0.32)");
            gradient.addColorStop(1, "rgba(0,0,0,0)");
            c.fillStyle = gradient;
            c.fillRect(0, 0, w, h);
          })
        ),
      })
    )
  );
  contact.rotation.x = -Math.PI / 2;
  contact.position.y = 0.004;
  room.add(contact);

  // ---- Surrounding room --------------------------------------------------
  // Neighbouring benches give the room depth and scale without adding interaction.
  const neighbourTop = standard({ color: srgb("#434b50"), roughness: 0.5, metalness: 0.05 });
  const cabinet = standard({ color: srgb("#c3cace"), roughness: 0.74, metalness: 0.04 });
  for (const [x, z, rotation] of [
    [-3.5, -1.5, Math.PI / 2],
    [3.5, -1.5, -Math.PI / 2],
    [-3.5, 1.9, Math.PI / 2],
    [3.5, 1.9, -Math.PI / 2],
  ]) {
    const neighbour = new THREE.Group();
    neighbour.position.set(x, 0, z);
    neighbour.rotation.y = rotation;
    const slab = new THREE.Mesh(keep(new THREE.BoxGeometry(1.9, 0.045, 0.8)), neighbourTop);
    slab.position.y = BENCH_HEIGHT - 0.02;
    slab.castShadow = true;
    slab.receiveShadow = true;
    neighbour.add(slab);
    const base = new THREE.Mesh(keep(new THREE.BoxGeometry(1.8, BENCH_HEIGHT - 0.07, 0.72)), cabinet);
    base.position.y = (BENCH_HEIGHT - 0.07) / 2;
    base.receiveShadow = true;
    neighbour.add(base);
    room.add(neighbour);
  }

  // A wall clock and a whiteboard: fixed reference points that help a headset
  // viewer keep their bearings when they turn away from the bench.
  const board = new THREE.Mesh(
    keep(new THREE.PlaneGeometry(2.6, 1.2)),
    standard({ color: srgb("#f6f8f9"), roughness: 0.3, metalness: 0.02 })
  );
  board.position.set(0, 1.65, ROOM.depth / 2 - 0.02);
  board.rotation.y = Math.PI;
  room.add(board);
  const boardFrame = new THREE.Mesh(keep(new RoundedBoxGeometry(2.72, 1.32, 0.05, 2, 0.015)), frameMaterial);
  boardFrame.position.set(0, 1.65, ROOM.depth / 2 - 0.04);
  room.add(boardFrame);

  return {
    room,
    bench,
    benchHeight: BENCH_HEIGHT,
    /** Place the authored Z-up bench scene on this table. */
    benchRig({ scale = BENCH_SCALE, height = BENCH_HEIGHT, z = 0.02 } = {}) {
      const rig = new THREE.Group();
      rig.name = "bench-rig";
      // Z-up bench units -> Y-up metres: (x, y, z) becomes (x, z, -y).
      rig.rotation.x = -Math.PI / 2;
      rig.scale.setScalar(scale);
      rig.position.set(0, height, z);
      return rig;
    },
    dispose() {
      scene.environment = null;
      scene.fog = null;
      environment.texture.dispose();
      pmrem.dispose();
      for (const value of disposables) value.dispose?.();
      room.removeFromParent();
      scene.remove(key, key.target, fill, fill.target);
    },
  };
}
