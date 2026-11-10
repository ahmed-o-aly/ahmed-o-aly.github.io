// The class panel, a small stand left of the bench's console, shown while in a
// class. Its keys work in VR and on desktop like the bench's own.
//  instructor  DEMO gathers everyone on your bench; WORK sends them to their own
//              (COPY lit: starting from your circuit); MINE returns you to your
//              bench; the key beside a student's name visits their bench.
//  student     says what the class is doing; PEEK views the instructor's bench
//              while you work.
import * as THREE from "three";
import { studentsOf, instructorOf } from "./rules.js";

const MAX_ROWS = 8;
export class ClassPanel {
  constructor({ parent, addKey, dropKey, Display, text, MONO, rounded, mat }) {
    Object.assign(this, { parent, addKey, dropKey, text, MONO });
    const plate = new THREE.Group();
    this.group = plate;
    parent.add(plate);
    const body = new THREE.Mesh(rounded(0.23, 0.175, 0.024, 0.005), mat.plastic("#34383d", 0.6));
    body.position.z = -0.0125;
    body.castShadow = body.receiveShadow = true;
    plate.add(body);
    this.display = new Display(plate, 0.012, -0.012, 0.17, 0.118, { pxPerM: 5200, glass: "#0e1418" });
    this.keys = [];
    this.role = null;
    this.handlers = {};
    this.lineH = 0.118 / (MAX_ROWS + 1);
    this.top = -0.012 + 0.059;
  }
  on(event, fn) { this.handlers[event] = fn; return this; }
  fire(event, ...args) { this.handlers[event]?.(...args); }
  set visible(v) { this.group.visible = v; if (!v) this.build(null); }

  /** Keys for this role; rebuilt only when the role changes. */
  build(role) {
    if (role === this.role) return;
    for (const k of this.keys) this.dropKey(k);
    this.keys = [];
    this.byName = {};
    this.role = role;
    if (!role) return;
    const K = (x, y, w, h, label, name, onPress, extra = {}) => {
      const k = this.addKey(this.group, { x, y, w, h, label, color: "#d9d5cb", name: `class-${name}`, onPress, ...extra });
      k.classKey = true;
      this.keys.push(k);
      this.byName[name] = k;
      return k;
    };
    if (role === "instructor") {
      K(-0.081, 0.071, 0.044, 0.016, "DEMO", "demo", () => this.fire("mode", "demo"), { led: "#ffcf3f" });
      K(-0.029, 0.071, 0.044, 0.016, "WORK", "work", () => this.fire("mode", "work"), { led: "#53e07a" });
      K(0.023, 0.071, 0.044, 0.016, "COPY", "copy", () => this.fire("copy"), { led: "#7be0ff" });
      K(0.075, 0.071, 0.044, 0.016, "MINE", "mine", () => this.fire("watch", null), { led: "#ff9b54" });
      for (let i = 0; i < MAX_ROWS; i += 1) {
        const y = this.top - (i + 1.5) * this.lineH;
        K(-0.094, y, 0.016, 0.0095, "", `row${i}`, () => this.fire("row", i), { led: null });
      }
    } else {
      K(-0.055, 0.071, 0.06, 0.016, "PEEK", "peek", () => this.fire("peek"), { led: "#ff9b54" });
    }
  }

  /** Redraw from the class's state. */
  render({ session, view, watchers = [] }) {
    const role = session?.me.role ?? null;
    this.group.visible = Boolean(session);
    this.build(role);
    if (!session) return;
    const members = session.members;
    const cls = session.cls;
    const students = studentsOf(members).slice(0, MAX_ROWS);
    this.students = students;
    const lead = instructorOf(members);
    const me = session.me;
    if (role === "instructor") {
      this.byName.demo.setLit(cls.mode === "demo");
      this.byName.work.setLit(cls.mode === "work");
      this.byName.copy.setLit(Boolean(me.copy));
      this.byName.mine.setLit(view.viewing === me.id);
    } else {
      this.byName.peek.setLit(Boolean(session.peek));
    }
    const key = JSON.stringify([role, cls, view, session.status, students.map((s) => [s.id, s.name, s.progress, s.viewing]), lead?.name, watchers, me.copy, session.peek]);
    const { text, MONO } = this;
    this.display.draw(key, (ctx, w, h) => {
      const row = h / (MAX_ROWS + 1);
      const size = row * 0.62;
      const say = (s, x, i, color, opts = {}) => text(ctx, s, x, row * (i + 0.5), size, { color, font: MONO, weight: 600, align: "left", ...opts });
      const live = session.status === "joined";
      say(`CLASS ${session.code}`, 12, 0, "#ffcf3f", { weight: 800 });
      say(live ? (cls.mode === "work" ? "WORK" : cls.mode === "demo" ? "DEMO" : "SOLO") : session.status.toUpperCase(), w - 12, 0, live ? "#7be08f" : "#ffb347", { align: "right", weight: 800 });
      if (role === "instructor") {
        if (!students.length) say("Waiting for students to join…", 12, 1.2, "#9aa5a0");
        students.forEach((s, i) => {
          const watched = view.viewing === s.id;
          const p = s.progress;
          const color = watched ? "#ff9b54" : p?.warn ? "#ffb347" : "#dfe7e3";
          say(`${watched ? "▶ " : ""}${s.name}`.slice(0, 16), 12, i + 1, color);
          const status = p ? (p.warn ? "!" : `${p.done}/${p.total}`) : "—";
          say(status, w - 12, i + 1, color, { align: "right" });
        });
      } else {
        const lines = !lead
          ? ["No instructor here yet.", "Your bench is your own."]
          : view.viewing !== me.id
            ? [cls.mode === "demo" ? `Watching ${lead.name}'s bench.` : `Peeking at ${lead.name}'s bench.`, "It is read-only for you.", cls.mode === "demo" ? "Your bench comes back at WORK." : "Press PEEK again to return."]
            : ["Your bench: work on it.", watchers.length ? `${watchers.join(", ")} is watching.` : "", "PEEK views the instructor's."];
        lines.forEach((s, i) => s && say(s, 12, i + 1.4, i === 0 ? "#dfe7e3" : "#9aa5a0"));
      }
    });
  }
}
