// One member's connection to a class.
//
// The relay allows each connection only about five presence updates in thirty
// seconds and closes the channel of one that sends more (measured November
// 2026: ClientPresenceRateLimitReached). So presence carries only who a member
// is, sent once on joining, and everything that changes travels as broadcasts:
//  class channel  `state`: what a member is viewing, their guide progress, and
//                 for the instructor the class's mode. Sent on change (coalesced),
//                 again when someone new arrives, and every ten seconds.
//  bench channel  one per bench, joined only by those viewing it: `bench`
//                 updates, the `pose` of hands on it, and `want` (a newcomer
//                 asking its owner for it). The relay counts every delivery, so
//                 this traffic reaches only the people who draw it.
// A member the relay drops reconnects by itself. Transport-agnostic: the tests
// drive it with an in-memory relay.
import { audienceOf, benchInterval, benchWatched, classOf, poseInterval, shouldSendPose, viewFor } from "./rules.js";

export const roomName = (lab, code) => `circuits-lab:${lab}:${code}`;
export const benchRoom = (lab, code, bench) => `${roomName(lab, code)}:bench:${bench}`;
export const STATE_GAP = 150; // ms to coalesce state changes
export const STATE_HEARTBEAT = 10000; // ms between repeats, for anything missed

export class ClassSession {
  constructor({ lab, code, me, transport, now = () => Date.now(), retry = [1000, 2000, 4000, 8000, 15000], heartbeat = STATE_HEARTBEAT }) {
    this.lab = lab;
    this.code = code;
    this.transport = transport;
    this.now = now;
    this.retry = retry;
    this.heartbeat = heartbeat;
    this.attempt = 0;
    this.left = false;
    this.status = "connecting";
    this.handlers = {};
    // who this member is: the only thing presence carries
    this.identity = { id: me.id, name: me.name, role: me.role, joined: now() };
    // what changes: sent as `state` broadcasts
    this.state = { viewing: me.id, progress: null };
    if (me.role === "instructor") Object.assign(this.state, { mode: "demo", watch: null, release: 0, copy: false });
    this.seq = 0;
    this.here = []; // identities presence reports
    this.states = new Map(); // id → { seq, joined, state } from their broadcasts
    this.members = [this.presence];
    this.peek = false;
    this.stateTimer = null;
    this.sub = null; // { bench, handle, ready }: the channel of the bench being viewed
  }
  /** This member as everyone sees them: identity and current state. */
  get presence() { return { ...this.identity, ...this.state }; }
  get me() { return this.presence; }
  get cls() { return classOf(this.members); }
  on(event, fn) { (this.handlers[event] ??= []).push(fn); return this; }
  emit(event, ...args) { for (const fn of this.handlers[event] ?? []) fn(...args); }

  connect() {
    this.transport.connect(roomName(this.lab, this.code), this.identity.id, {
      onStatus: (status) => this.onStatus(status),
      onPresence: (list) => this.setHere(list),
      onBroadcast: (event, payload) => { if (event === "state") this.onState(payload); },
    });
    return this;
  }
  onStatus(status) {
    if (this.left) return;
    this.status = status;
    clearTimeout(this.retryTimer);
    if (status === "joined") {
      this.attempt = 0;
      this.transport.track({ ...this.identity }); // once per join
      this.sendState(true);
      this.startHeartbeat();
      this.openSub(true);
    } else if (status === "closed" || status === "error") {
      // dropped, by the network or by the relay: come back
      clearInterval(this.beat);
      const wait = this.retry[Math.min(this.attempt, this.retry.length - 1)];
      this.attempt += 1;
      this.retryTimer = setTimeout(() => this.reconnect(), wait);
    }
    this.emit("status", status);
  }
  reconnect() {
    if (this.left) return;
    this.closeSub();
    this.transport.close();
    this.status = "connecting";
    this.emit("status", "connecting");
    this.connect();
  }
  leave() {
    this.left = true;
    clearTimeout(this.stateTimer);
    clearTimeout(this.retryTimer);
    clearTimeout(this.greetTimer);
    clearInterval(this.beat);
    this.closeSub();
    this.transport.close();
    this.status = "closed";
    this.emit("status", "closed");
  }
  startHeartbeat() {
    clearInterval(this.beat);
    this.beat = setInterval(() => this.sendState(true), this.heartbeat);
  }

  // ---- who is here, and what they are doing ----
  setHere(list) {
    const before = new Set(this.here.map((m) => m.id));
    this.here = list.filter((m) => m && m.id && m.id !== this.identity.id);
    for (const id of this.states.keys()) if (!this.here.some((m) => m.id === id)) this.states.delete(id);
    // someone new: tell them what this member is doing (a little apart from the others)
    if (this.here.some((m) => !before.has(m.id))) {
      clearTimeout(this.greetTimer);
      this.greetTimer = setTimeout(() => this.sendState(true), 100 + Math.random() * 400);
    }
    this.recompute();
  }
  onState(payload) {
    if (!payload?.from || payload.from === this.identity.id) return;
    const known = this.states.get(payload.from);
    // a reload starts its count again, so a lower number from a new join is still news
    if (known && payload.joined === known.joined && payload.seq <= known.seq) return;
    this.states.set(payload.from, { seq: payload.seq, joined: payload.joined, state: payload.state });
    this.recompute();
  }
  recompute() {
    const others = this.here.map((m) => ({ viewing: m.id, progress: null, ...m, ...(this.states.get(m.id)?.state ?? {}) }));
    this.members = [...others, this.presence];
    this.refreshView();
    this.emit("members", this.members);
  }
  /** Work out what this member should be viewing now; publishes the change and moves channel. */
  refreshView() {
    const view = viewFor({ id: this.identity.id, role: this.identity.role, watch: this.state.watch, peek: this.peek }, this.members);
    if (view.viewing !== this.state.viewing) this.update({ viewing: view.viewing });
    this.view = view;
    this.openSub();
    return view;
  }
  /** Change this member's state; the class hears it within STATE_GAP. */
  update(fields) {
    Object.assign(this.state, fields);
    this.members = this.members.map((m) => (m.id === this.identity.id ? this.presence : m));
    this.sendState(false);
  }
  sendState(now) {
    clearTimeout(this.stateTimer);
    const go = () => {
      if (this.status !== "joined") return;
      this.seq += 1;
      this.transport.send("state", { from: this.identity.id, joined: this.identity.joined, seq: this.seq, state: { ...this.state } });
    };
    if (now) go(); else this.stateTimer = setTimeout(go, STATE_GAP);
  }

  // ---- the viewed bench's channel ----
  openSub(force = false) {
    const bench = this.state.viewing;
    if (!force && this.sub?.bench === bench) return;
    this.closeSub();
    if (this.status !== "joined") return;
    const sub = { bench, ready: false, handle: null };
    this.sub = sub;
    sub.handle = this.transport.openSub(benchRoom(this.lab, this.code, bench), {
      onStatus: (status) => {
        if (this.sub !== sub) return;
        sub.ready = status === "joined";
        if (sub.ready) this.emit("bench-channel", bench);
      },
      onBroadcast: (event, payload) => {
        if (this.sub !== sub || !payload || payload.from === this.identity.id) return;
        if (event === "bench" && payload.to && payload.to !== this.identity.id) return;
        this.emit(event, payload);
      },
    });
  }
  closeSub() {
    this.sub?.handle?.close();
    this.sub = null;
  }
  subReady(bench) { return this.status === "joined" && this.sub?.ready && this.sub.bench === bench; }

  // ---- what the instructor does ----
  setMode(mode) {
    if (this.identity.role !== "instructor") return;
    const fields = { mode, watch: null };
    if (mode === "work" && this.state.mode !== "work") fields.release = (this.state.release ?? 0) + 1;
    this.update(fields);
    this.recompute();
  }
  setCopy(copy) { if (this.identity.role === "instructor") { this.update({ copy }); this.emit("members", this.members); } }
  watch(id) {
    if (this.identity.role !== "instructor") return;
    this.update({ watch: id && id !== this.identity.id ? id : null });
    this.recompute();
  }

  // ---- what a student does ----
  setPeek(peek) {
    this.peek = Boolean(peek);
    this.recompute();
  }

  // ---- traffic on the viewed bench's channel ----
  /** How long to wait between hand updates, and between bench updates, on this channel. */
  get poseGap() { return poseInterval(audienceOf(this.state.viewing, this.members)); }
  get benchGap() { return benchInterval(audienceOf(this.state.viewing, this.members)); }
  /** Send this member's bench to those viewing it (or to one newcomer who asked). */
  sendBench(bench, to = null) {
    const mine = this.identity.id;
    if (!this.subReady(mine)) return false;
    if (!to && !benchWatched(this.presence, this.members)) return false;
    this.sub.handle.send("bench", { from: mine, to, at: this.now(), bench });
    return true;
  }
  sendPose(pose) {
    if (!this.subReady(this.state.viewing) || !shouldSendPose(this.presence, this.members)) return false;
    this.sub.handle.send("pose", { from: this.identity.id, at: this.now(), pose });
    return true;
  }
  /** Ask a bench's owner to send it now, as a newcomer to it. */
  askBench(owner) {
    if (owner !== this.identity.id && this.subReady(owner)) this.sub.handle.send("want", { from: this.identity.id, owner });
  }
}
