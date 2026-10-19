import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mm, SURFACE } from "../design/tokens.js";

/**
 * The teaching laboratory, from the design system's BenchLayout: an 1800 x 750 mm
 * benchtop at 920 mm standing height, in a room with daylight.
 *
 * Metres, Y up, floor at y = 0, so the same geometry serves the desktop camera and
 * a room-scale headset without a second coordinate frame to keep in step.
 */

export const BENCH = Object.freeze({
  width: 1.8,
  depth: 0.75,
  height: 0.92,
  thickness: mm(40),
  /** Where a standing student's feet are: 0.42 m clear of the front edge. */
  stand: 0.75 / 2 + 0.42,
});

const ROOM = Object.freeze({ width: 9, depth: 9, height: 3.05 });

export function createRoom(scene, renderer, materials) {
  const group = new THREE.Group();
  group.name = "laboratory";
  scene.add(group);
  const disposables = [];
  const keep = (value) => (disposables.push(value), value);
  const srgb = materials.srgb;

  // Image-based lighting, generated in code: it needs no asset and no network, and
  // it is what makes a moulded case read as plastic rather than as flat shading.
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.75;
  scene.background = srgb("#aab4bb");
  scene.fog = new THREE.Fog(srgb("#aeb8bf"), 12, 26);

  const texture = (size, draw, repeat) => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    draw(canvas.getContext("2d"), size);
    const map = keep(new THREE.CanvasTexture(canvas));
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(repeat, repeat);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 8;
    return map;
  };

  const standard = (options) => keep(new THREE.MeshStandardMaterial(options));

  // ---- shell -------------------------------------------------------------
  const floor = new THREE.Mesh(
    keep(new THREE.PlaneGeometry(ROOM.width, ROOM.depth)),
    standard({
      roughness: 0.62,
      metalness: 0.02,
      map: texture(
        512,
        (c, s) => {
          c.fillStyle = SURFACE.floor;
          c.fillRect(0, 0, s, s);
          for (let i = 0; i < 9000; i += 1) {
            const v = 120 + Math.random() * 110;
            c.fillStyle = `rgba(${v},${v + 4},${v + 8},${0.12 + Math.random() * 0.3})`;
            c.fillRect(Math.random() * s, Math.random() * s, 1.6, 1.6);
          }
          c.strokeStyle = "rgba(70,78,84,0.5)";
          c.lineWidth = 2.5;
          c.strokeRect(0, 0, s, s);
        },
        12
      ),
    })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  group.add(floor);

  const wallMaterial = standard({ color: srgb(SURFACE.wall), roughness: 0.95, metalness: 0 });
  const wallGeometry = keep(new THREE.PlaneGeometry(ROOM.width, ROOM.height));
  for (const [x, z, rotation] of [
    [0, -ROOM.depth / 2, 0],
    [0, ROOM.depth / 2, Math.PI],
    [-ROOM.width / 2, 0, Math.PI / 2],
    [ROOM.width / 2, 0, -Math.PI / 2],
  ]) {
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.position.set(x, ROOM.height / 2, z);
    wall.rotation.y = rotation;
    wall.receiveShadow = true;
    group.add(wall);
  }

  const ceiling = new THREE.Mesh(keep(new THREE.PlaneGeometry(ROOM.width, ROOM.depth)), standard({ color: srgb("#eceff1"), roughness: 1 }));
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = ROOM.height;
  group.add(ceiling);

  const panelLight = keep(new THREE.MeshBasicMaterial({ color: srgb("#fdfbf4") }));
  const panelGeometry = keep(new THREE.PlaneGeometry(1.15, 0.4));
  for (const x of [-2.1, 2.1]) {
    for (const z of [-2.1, 0, 2.1]) {
      const fixture = new THREE.Mesh(panelGeometry, panelLight);
      fixture.rotation.x = Math.PI / 2;
      fixture.position.set(x, ROOM.height - 0.012, z);
      group.add(fixture);
    }
  }

  // Glazing on the far wall gives the room a direction to be lit from.
  const glass = standard({
    color: srgb("#cfe4f2"),
    roughness: 0.08,
    transparent: true,
    opacity: 0.55,
    emissive: srgb("#eaf4fc"),
    emissiveIntensity: 0.9,
  });
  const frameMaterial = standard({ color: srgb("#8d969c"), roughness: 0.5, metalness: 0.35 });
  for (const x of [-2.5, 0, 2.5]) {
    const pane = new THREE.Mesh(keep(new THREE.PlaneGeometry(2.2, 1.28)), glass);
    pane.position.set(x, 1.72, -ROOM.depth / 2 + 0.03);
    group.add(pane);
    const frame = new THREE.Mesh(keep(new RoundedBoxGeometry(2.32, 1.4, 0.07, 2, 0.02)), frameMaterial);
    frame.position.set(x, 1.72, -ROOM.depth / 2);
    group.add(frame);
  }

  // ---- light -------------------------------------------------------------
  scene.add(keep(new THREE.HemisphereLight(srgb("#f2f7fb"), srgb("#8d969c"), 1.0)));

  const key = new THREE.DirectionalLight(srgb("#fff6e4"), 1.7);
  key.position.set(-2.4, 3.2, 2.6);
  key.target.position.set(0, BENCH.height, 0);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far = 10;
  Object.assign(key.shadow.camera, { left: -1.6, right: 1.6, top: 1.4, bottom: -1.4 });
  key.shadow.bias = -0.0006;
  key.shadow.normalBias = 0.015;
  key.shadow.radius = 3;
  scene.add(key, key.target);

  const fill = new THREE.DirectionalLight(srgb("#dceaf6"), 0.55);
  fill.position.set(1.6, 2.4, -3.2);
  fill.target.position.set(0, BENCH.height, 0);
  scene.add(fill, fill.target);

  // ---- the bench ---------------------------------------------------------
  const bench = new THREE.Group();
  bench.name = "bench";
  group.add(bench);

  const top = new THREE.Mesh(
    keep(new RoundedBoxGeometry(BENCH.width, BENCH.thickness, BENCH.depth, 3, mm(3))),
    standard({
      roughness: 0.42,
      metalness: 0.06,
      map: texture(
        512,
        (c, s) => {
          c.fillStyle = SURFACE.benchTop;
          c.fillRect(0, 0, s, s);
          for (let i = 0; i < 14000; i += 1) {
            const v = 40 + Math.random() * 46;
            c.fillStyle = `rgba(${v},${v + 6},${v + 10},${0.18 + Math.random() * 0.26})`;
            c.fillRect(Math.random() * s, Math.random() * s, 2, 1);
          }
        },
        4
      ),
    })
  );
  top.position.set(0, BENCH.height - BENCH.thickness / 2, 0);
  top.castShadow = true;
  top.receiveShadow = true;
  bench.add(top);

  const bullnose = new THREE.Mesh(
    keep(new THREE.CylinderGeometry(BENCH.thickness / 2, BENCH.thickness / 2, BENCH.width, 16)),
    standard({ color: srgb("#272d31"), roughness: 0.5, metalness: 0.1 })
  );
  bullnose.rotation.z = Math.PI / 2;
  bullnose.position.set(0, BENCH.height - BENCH.thickness / 2, BENCH.depth / 2);
  bench.add(bullnose);

  // Drawer pedestals at each end: how a teaching bench is actually built, and it
  // means the underside is never a see-through gap at standing height.
  const carcass = standard({ color: srgb("#aeb6bb"), roughness: 0.66, metalness: 0.08 });
  const drawerFace = standard({ color: srgb("#c4ccd1"), roughness: 0.55, metalness: 0.12 });
  const steel = standard({ color: srgb("#b7bfc4"), roughness: 0.34, metalness: 0.8 });
  const pedestal = { width: 0.52, height: BENCH.height - BENCH.thickness - 0.07, depth: BENCH.depth - 0.12 };
  for (const side of [-1, 1]) {
    const unit = new THREE.Group();
    unit.position.set(side * (BENCH.width / 2 - pedestal.width / 2 - 0.05), 0, -0.02);
    bench.add(unit);
    const body = new THREE.Mesh(keep(new THREE.BoxGeometry(pedestal.width, pedestal.height, pedestal.depth)), carcass);
    body.position.y = pedestal.height / 2 + 0.07;
    body.castShadow = true;
    body.receiveShadow = true;
    unit.add(body);
    const plinth = new THREE.Mesh(
      keep(new THREE.BoxGeometry(pedestal.width - 0.05, 0.07, pedestal.depth - 0.05)),
      standard({ color: srgb("#6e767b"), roughness: 0.8 })
    );
    plinth.position.y = 0.035;
    unit.add(plinth);
    const drawer = keep(new RoundedBoxGeometry(pedestal.width - 0.04, pedestal.height / 3 - 0.02, 0.02, 2, 0.005));
    const handle = keep(new THREE.CylinderGeometry(0.007, 0.007, 0.18, 10));
    for (let i = 0; i < 3; i += 1) {
      const y = 0.07 + (i + 0.5) * (pedestal.height / 3);
      const front = new THREE.Mesh(drawer, drawerFace);
      front.position.set(0, y, pedestal.depth / 2 + 0.002);
      front.castShadow = true;
      unit.add(front);
      const pull = new THREE.Mesh(handle, steel);
      pull.rotation.z = Math.PI / 2;
      pull.position.set(0, y + pedestal.height / 9, pedestal.depth / 2 + 0.016);
      unit.add(pull);
    }
  }

  const backPanel = new THREE.Mesh(keep(new THREE.BoxGeometry(BENCH.width - 0.08, BENCH.height - BENCH.thickness - 0.14, 0.018)), carcass);
  backPanel.position.set(0, (BENCH.height - BENCH.thickness) / 2 + 0.03, -BENCH.depth / 2 + 0.09);
  backPanel.receiveShadow = true;
  bench.add(backPanel);

  // Neighbouring benches: depth and scale, with nothing to interact with.
  const neighbourTop = standard({ color: srgb("#434b50"), roughness: 0.5 });
  for (const [x, z, rotation] of [
    [-3.4, -1.4, Math.PI / 2],
    [3.4, -1.4, -Math.PI / 2],
    [-3.4, 1.9, Math.PI / 2],
    [3.4, 1.9, -Math.PI / 2],
  ]) {
    const unit = new THREE.Group();
    unit.position.set(x, 0, z);
    unit.rotation.y = rotation;
    const slab = new THREE.Mesh(keep(new THREE.BoxGeometry(1.9, 0.04, 0.8)), neighbourTop);
    slab.position.y = BENCH.height - 0.02;
    slab.castShadow = true;
    slab.receiveShadow = true;
    unit.add(slab);
    const base = new THREE.Mesh(keep(new THREE.BoxGeometry(1.8, BENCH.height - 0.06, 0.72)), carcass);
    base.position.y = (BENCH.height - 0.06) / 2;
    unit.add(base);
    group.add(unit);
  }

  return {
    group,
    bench,
    BENCH,
    dispose() {
      scene.environment = null;
      scene.fog = null;
      environment.texture.dispose();
      pmrem.dispose();
      for (const value of disposables) value.dispose?.();
      scene.remove(key, key.target, fill, fill.target);
      group.removeFromParent();
    },
  };
}
