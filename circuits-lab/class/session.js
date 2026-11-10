// One member's connection to a class: presence (who is here, what they view),
// and the two kinds of broadcast, `bench` (a whole bench's setup, sent by its
// owner while someone views it) and `pose` (head and hands, sent while someone
// would see them). Transport-agnostic, so the tests drive it with a fake one.
import { benchWatched, classOf, shouldSendPose, viewFor } from "./rules.js";

export const roomName = (lab, code) => `circuits-lab:${lab}:${code}`;

export class ClassSession {
  constructor({ lab, code, me, transport, now = () => Date.now() }) {
    this.lab = lab;
    this.code = code;
    this.transport = transport;
    this.now = now;
    this.status = "connecting";
    this.members = [];
    this.handlers = {};
    // what this member publishes; an instructor also publishes the class's mode
    this.presence = { id: me.id, name: me.name, role: me.role, joined: now(), viewing: me.id, progress: null };
    if (me.role === "instructor") Object.assign(this.presence, { mode: "demo", watch: null, release: 0, copy: false });
    this.peek = false;
    this.trackTimer = null;
    this.tracked = "";
  }
  get me() { return this.presence; }
  get cls() { return classOf(this.members); }
  on(event, fn) { (this.handlers[event] ??= []).push(fn); return this; }
  emit(event, ...args) { for (const fn of this.handlers[event] ?? []) fn(...args); }

  connect() {
    this.transport.connect(roomName(this.lab, this.code), this.presence.id, {
      onStatus: (status) => {
        this.status = status;
        if (status === "joined") { this.tracked = ""; this.flush(true); } // after a reconnect, announce again
        this.emit("status", status);
      },
      onPresence: (list) => this.setMembers(list),
      onBroadcast: (event, payload) => {
        if (!payload || payload.from === this.presence.id) return;
        if (event === "bench" && payload.to && payload.to !== this.presence.id) return;
        this.emit(event, payload);
      },
    });
    return this;
  }
  leave() {
    clearTimeout(this.trackTimer);
    this.transport.close();
    this.status = "closed";
    this.emit("status", "closed");
  }

  /** Members as presence reports them, with this member's latest state in place of its echo. */
  setMembers(list) {
    const others = list.filter((m) => m && m.id && m.id !== this.presence.id);
    this.members = [...others, { ...this.presence }];
    this.refreshView();
    this.emit("members", this.members);
  }
  /** Work out what this member should be viewing now; publishes the change. */
  refreshView() {
    const view = viewFor({ id: this.presence.id, role: this.presence.role, watch: this.presence.watch, peek: this.peek }, this.members);
    if (view.viewing !== this.presence.viewing) this.update({ viewing: view.viewing });
    this.view = view;
    return view;
  }
  /** Change what this member publishes (sent at most every 150 ms). */
  update(fields) {
    Object.assign(this.presence, fields);
    this.members = this.members.map((m) => (m.id === this.presence.id ? { ...this.presence } : m));
    if (!this.members.some((m) => m.id === this.presence.id)) this.members.push({ ...this.presence });
    this.flush(false);
  }
  flush(now) {
    clearTimeout(this.trackTimer);
    const go = () => {
      if (this.status !== "joined") return;
      const json = JSON.stringify(this.presence);
      if (json === this.tracked) return;
      this.tracked = json;
      this.transport.track({ ...this.presence });
    };
    if (now) go(); else this.trackTimer = setTimeout(go, 150);
  }

  // ---- what the instructor does ----
  setMode(mode) {
    if (this.presence.role !== "instructor") return;
    const fields = { mode, watch: null };
    if (mode === "work" && this.presence.mode !== "work") fields.release = (this.presence.release ?? 0) + 1;
    this.update(fields);
    this.refreshView();
    this.emit("members", this.members);
  }
  setCopy(copy) { if (this.presence.role === "instructor") this.update({ copy }); }
  watch(id) {
    if (this.presence.role !== "instructor") return;
    this.update({ watch: id && id !== this.presence.id ? id : null });
    this.refreshView();
    this.emit("members", this.members);
  }

  // ---- what a student does ----
  setPeek(peek) {
    this.peek = Boolean(peek);
    this.refreshView();
    this.emit("members", this.members);
  }

  // ---- traffic ----
  /** Send this member's bench, if anyone else is viewing it (or to one newcomer). */
  sendBench(bench, to = null) {
    if (this.status !== "joined") return false;
    if (!to && !benchWatched(this.presence, this.members)) return false;
    this.transport.send("bench", { from: this.presence.id, to, at: this.now(), bench });
    return true;
  }
  sendPose(pose) {
    if (this.status !== "joined" || !shouldSendPose(this.presence, this.members)) return false;
    this.transport.send("pose", { from: this.presence.id, at: this.now(), pose });
    return true;
  }
  /** Ask a bench's owner to send it now, as a newcomer to it. */
  askBench(owner) {
    if (this.status === "joined" && owner !== this.presence.id) this.transport.send("want", { from: this.presence.id, owner });
  }
}
