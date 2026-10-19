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

/**
 * A U-shaped bench that wraps the student, rather than one long wall of equipment
 * they have to walk along. Everything is inside arm's reach from one standing
 * position, which is the whole point of doing this in a headset.
 *
 * Each wing is a bench segment with its own transform; `segments` is what the
 * layout places instruments on.
 */
export const BENCH = Object.freeze({
  height: 0.92,
  thickness: mm(40),
  /** The student stands here, inside the mouth of the U. */
  stand: 0.1,
  /** Sized from reach: nothing on this bench is more than 0.76 m from the student. */
  segments: [
    { id: "centre", width: 1.0, depth: 0.48, x: 0, z: -0.54, rotation: 0 },
    { id: "left", width: 0.76, depth: 0.48, x: -0.58, z: -0.2, rotation: 1.05 },
    { id: "right", width: 0.76, depth: 0.48, x: 0.58, z: -0.2, rotation: -1.05 },
  ],
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

  const benchTopMaterial = standard({
    roughness: 0.42,
    metalness: 0.06,
    map: texture(
      512,
      (c, s2) => {
        c.fillStyle = SURFACE.benchTop;
        c.fillRect(0, 0, s2, s2);
        for (let i = 0; i < 14000; i += 1) {
          const v = 40 + Math.random() * 46;
          c.fillStyle = `rgba(${v},${v + 6},${v + 10},${0.18 + Math.random() * 0.26})`;
          c.fillRect(Math.random() * s2, Math.random() * s2, 2, 1);
        }
      },
      4
    ),
  });
  const carcass = standard({ color: srgb("#767e84"), roughness: 0.72, metalness: 0.05 });
  const bullnoseMaterial = standard({ color: srgb("#272d31"), roughness: 0.5, metalness: 0.1 });

  const segments = new Map();
  for (const segment of BENCH.segments) {
    const unit = new THREE.Group();
    unit.name = `bench-${segment.id}`;
    segments.set(segment.id, unit);
    unit.position.set(segment.x, 0, segment.z);
    unit.rotation.y = segment.rotation;
    bench.add(unit);

    const top = new THREE.Mesh(keep(new RoundedBoxGeometry(segment.width, BENCH.thickness, segment.depth, 3, mm(3))), benchTopMaterial);
    top.position.y = BENCH.height - BENCH.thickness / 2;
    top.castShadow = true;
    top.receiveShadow = true;
    unit.add(top);

    const bullnose = new THREE.Mesh(
      keep(new THREE.CylinderGeometry(BENCH.thickness / 2, BENCH.thickness / 2, segment.width, 16)),
      bullnoseMaterial
    );
    bullnose.rotation.z = Math.PI / 2;
    bullnose.position.set(0, BENCH.height - BENCH.thickness / 2, segment.depth / 2);
    unit.add(bullnose);

    // A plain closed base. The student never opens it, so it carries no detail
    // that would compete with the equipment standing on top.
    const base = new THREE.Mesh(
      keep(new THREE.BoxGeometry(segment.width - 0.1, BENCH.height - BENCH.thickness, segment.depth - 0.14)),
      carcass
    );
    base.position.y = (BENCH.height - BENCH.thickness) / 2;
    base.castShadow = true;
    base.receiveShadow = true;
    unit.add(base);
  }

  return {
    group,
    bench,
    segments,
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
