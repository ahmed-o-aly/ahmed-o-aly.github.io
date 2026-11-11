// Other people's hands on the bench you are viewing: a see-through head with
// their name, their two controllers and pointer beads, or, from a desktop, a
// line from their view to the point under their mouse. Poses arrive in the
// lab's own frame, so they land on your bench exactly where they were on theirs.
import * as THREE from "three";

const COLORS = { instructor: "#ff9b54", student: "#5ad1e6" };

function label(name, color) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "rgba(20, 24, 28, 0.78)";
  ctx.beginPath();
  ctx.roundRect(8, 20, 496, 88, 44);
  ctx.fill();
  ctx.fillStyle = color;
  ctx.font = "700 54px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(name.slice(0, 18), 256, 66);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, depthTest: false, transparent: true }));
  sprite.scale.set(0.16, 0.04, 1);
  sprite.renderOrder = 10;
  return sprite;
}

class Ghost {
  constructor(parent, member) {
    this.id = member.id;
    this.name = member.name;
    const color = new THREE.Color(COLORS[member.role] ?? COLORS.student);
    const skin = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.35, depthWrite: false });
    const solid = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.85, depthWrite: false });
    this.group = new THREE.Group();
    parent.add(this.group);
    this.head = new THREE.Group();
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.09, 0.1), skin);
    this.head.add(visor);
    this.tag = label(member.name, `#${color.getHexString()}`);
    this.tag.position.y = 0.11;
    this.head.add(this.tag);
    this.group.add(this.head);
    this.hands = [0, 1].map(() => {
      const hand = new THREE.Group();
      const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.018, 0.06, 4, 12).rotateX(Math.PI / 2), skin);
      hand.add(body);
      const bead = new THREE.Mesh(new THREE.SphereGeometry(0.004, 14, 10), solid);
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]), new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.7 }));
      this.group.add(hand, bead, line);
      return { hand, bead, line, body, p: new THREE.Vector3(), q: new THREE.Quaternion(), b: new THREE.Vector3(), seen: false };
    });
    this.target = null;
    this.headP = new THREE.Vector3();
    this.headQ = new THREE.Quaternion();
    this.fresh = true;
    this.at = 0;
  }
  set(pose, now) { this.target = pose; this.at = now; }
  update(dt, viewer, now) {
    const t = this.target;
    // hands stop drawing if their sender goes quiet
    this.group.visible = Boolean(t) && now - this.at < 5000;
    if (!this.group.visible) return;
    const k = this.fresh ? 1 : 1 - Math.exp(-dt * 10); // hands arrive a few times a second; glide between
    this.fresh = false;
    const v3 = (a) => new THREE.Vector3().fromArray(a);
    if (t.head) {
      this.headP.lerp(v3(t.head.p), k);
      this.headQ.slerp(new THREE.Quaternion().fromArray(t.head.q), k);
      this.head.position.copy(this.headP);
      this.head.quaternion.copy(this.headQ);
    }
    // a head right where you stand would fill your view: only its name shows then
    const near = viewer && this.headP.distanceTo(viewer) < 0.4;
    this.head.children[0].visible = !near;
    this.head.visible = Boolean(t.head);
    this.hands.forEach((h, i) => {
      const src = t.hands?.[i];
      const on = Boolean(src?.bead);
      h.bead.visible = h.line.visible = on;
      h.hand.visible = on && Boolean(src.p);
      if (!on) { h.seen = false; return; }
      const kk = h.seen ? k : 1;
      h.seen = true;
      h.b.lerp(v3(src.bead), kk);
      h.bead.position.copy(h.b);
      h.bead.scale.setScalar(src.grab ? 1.6 : 1);
      let from;
      if (src.p) {
        h.p.lerp(v3(src.p), kk);
        h.q.slerp(new THREE.Quaternion().fromArray(src.q), kk);
        h.hand.position.copy(h.p);
        h.hand.quaternion.copy(h.q);
        from = h.p;
      } else from = this.headP; // a desktop pointer: a line from their view
      const pos = h.line.geometry.attributes.position;
      pos.setXYZ(0, from.x, from.y, from.z);
      pos.setXYZ(1, h.b.x, h.b.y, h.b.z);
      pos.needsUpdate = true;
      h.line.geometry.computeBoundingSphere();
    });
  }
  dispose() {
    this.group.removeFromParent();
    this.group.traverse((o) => { o.geometry?.dispose(); o.material?.map?.dispose(); o.material?.dispose(); });
  }
}

export class Ghosts {
  constructor(parent) { this.parent = parent; this.map = new Map(); this.show = new Set(); }
  /** Who should be drawn now, from the members list. */
  setShown(members, ids) {
    this.show = new Set(ids);
    for (const [id, g] of this.map) if (!this.show.has(id)) { g.dispose(); this.map.delete(id); }
    for (const id of ids) if (!this.map.has(id)) { const m = members.find((x) => x.id === id); if (m) this.map.set(id, new Ghost(this.parent, m)); }
  }
  pose(from, pose, now) { this.map.get(from)?.set(pose, now); }
  update(dt, viewer, now) { for (const g of this.map.values()) g.update(dt, viewer, now); }
  clear() { this.setShown([], []); }
}
