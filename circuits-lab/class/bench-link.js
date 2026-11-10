// Connects one lab bench to a class session. The bench supplies what it is
// (benchState / applyBench), where its user's head and hands are (pose), and a
// lock; this keeps it showing the right bench:
//  - your own bench is kept aside while you view someone else's, and comes back
//  - an owner sends their bench while anyone views it, at most every 120 ms
//  - hands are sent ten times a second while someone would see them
//  - on WORK, a student's own bench returns, or becomes a copy of the instructor's
import { ghostsFor, poseMoved, progressOf, releaseAction } from "./rules.js";
import { ClassSession } from "./session.js";
import { memberId } from "./join-ui.js";

export function linkBench({ lab, ui, panel, ghosts, bench }) {
  let session = null;
  let viewing = null; // bench id shown now
  let own = null; // this member's own bench, kept while viewing another
  let lastFromInstructor = null;
  let lastRelease = 0;
  let lastMode = "solo";
  let sendTimer = null, progressTimer = null;
  let lastPose = null, lastPoseAt = 0, poseClock = 0;
  let watchedBy = new Set();
  const benchOwnerFeeds = new Map(); // id → last bench JSON applied
  let applying = false;
  let snapBack = null;
  const apply = (b) => { applying = true; try { bench.apply(b); } finally { applying = false; } };

  const me = () => session?.me;
  const instructorName = () => session?.members.find((m) => m.role === "instructor")?.name;

  function redraw() {
    bench.framing?.(Boolean(session));
    if (!session) { panel.render({ session: null }); return; }
    const watchers = session.members.filter((m) => m.id !== me().id && m.viewing === me().id).map((m) => m.name);
    panel.render({ session, view: session.view ?? { viewing: me().id, locked: false }, watchers });
    ui.setMembers(session.members);
  }

  function showBench(next) {
    if (next === viewing) return;
    const mine = me().id;
    if (viewing === mine || viewing === null) own = bench.state(); // keep your own bench aside
    viewing = next;
    if (next === mine) {
      if (own) apply(own);
      bench.setLocked(false);
    } else {
      bench.setLocked(true);
      const known = benchOwnerFeeds.get(next);
      if (known) apply(JSON.parse(known));
      session.askBench(next);
    }
  }

  function onMembers() {
    const view = session.view;
    const cls = session.cls;
    // released: a student's own bench comes back, or starts as the instructor's circuit
    if (me().role !== "instructor" && cls.mode === "work" && cls.release > lastRelease) {
      if (lastMode === "demo" && releaseAction(cls, Boolean(lastFromInstructor)) === "copy") own = structuredClone(lastFromInstructor);
      lastRelease = cls.release;
    }
    lastMode = cls.mode;
    showBench(view.viewing);
    ghosts.setShown(session.members, ghostsFor(me(), session.members));
    // someone new is viewing my bench: send it now
    const now = new Set(session.members.filter((m) => m.id !== me().id && m.viewing === me().id).map((m) => m.id));
    if (viewing === me().id && [...now].some((id) => !watchedBy.has(id))) session.sendBench(bench.state());
    watchedBy = now;
    redraw();
  }

  async function join({ code, role, name }) {
    leave(true);
    const relay = new URLSearchParams(location.search).get("relay");
    const transport = relay === "local"
      ? (await import("./transport-local.js")).localTransport()
      : (await import("./transport-supabase.js")).supabaseTransport();
    session = new ClassSession({ lab, code, me: { id: memberId(), name, role }, transport });
    viewing = session.me.id;
    own = null;
    lastFromInstructor = null;
    lastMode = "solo";
    lastRelease = Infinity; // a class already at work does not overwrite a newcomer's bench
    session.on("status", (status) => {
      ui.setStatus({ joined: "Connected.", connecting: "Connecting…", error: "Can't reach the class relay. Check the network; it will keep trying.", closed: "Disconnected." }[status] ?? status);
      redraw();
    });
    session.on("members", () => {
      if (lastRelease === Infinity && session.cls.instructor) lastRelease = session.cls.release;
      onMembers();
    });
    session.on("bench", ({ from, bench: b }) => {
      const json = JSON.stringify(b);
      benchOwnerFeeds.set(from, json);
      if (session.members.find((m) => m.id === from)?.role === "instructor") lastFromInstructor = b;
      if (from === viewing && from !== me().id) apply(b);
    });
    session.on("want", ({ from, owner }) => { if (owner === me().id && viewing === me().id) session.sendBench(bench.state(), from); });
    session.on("pose", ({ from, pose }) => ghosts.pose(from, pose, performance.now()));
    session.connect();
    publishProgress();
    redraw();
  }

  function leave(quiet = false) {
    if (!session) return;
    const wasMine = viewing === session.me.id;
    session.leave();
    session = null;
    ghosts.clear();
    if (!wasMine && own) apply(own); // back to your own bench
    bench.setLocked(false);
    viewing = null;
    own = null;
    benchOwnerFeeds.clear();
    if (!quiet) redraw(); else panel.render({ session: null });
  }

  function publishProgress() {
    if (!session) return;
    clearTimeout(progressTimer);
    progressTimer = setTimeout(() => {
      if (!session || viewing !== me().id) return;
      const p = progressOf(bench.steps(), bench.warning());
      if (JSON.stringify(p) !== JSON.stringify(me().progress)) session.update({ progress: p });
    }, 400);
  }

  // the bench changed: send it to whoever is viewing it
  function changed() {
    if (!session || applying) return;
    if (viewing !== me().id) {
      // someone else's bench changed here without them: put it back as they have it
      clearTimeout(snapBack);
      snapBack = setTimeout(() => { const known = session && benchOwnerFeeds.get(viewing); if (known && viewing !== me().id) apply(JSON.parse(known)); }, 50);
      return;
    }
    clearTimeout(sendTimer);
    sendTimer = setTimeout(() => session?.sendBench(bench.state()), 120);
    publishProgress();
  }

  function tick(dt, now, viewer) {
    ghosts.update(dt, viewer, now);
    if (!session) return;
    poseClock += dt;
    if (poseClock < 0.1) return;
    poseClock = 0;
    const pose = bench.pose();
    if (!poseMoved(pose, lastPose) && now - lastPoseAt < 1000) return;
    if (session.sendPose(pose)) { lastPose = pose; lastPoseAt = now; }
  }

  ui.handlers.join = join;
  ui.handlers.leave = () => leave();
  panel.on("mode", (mode) => session?.setMode(mode));
  panel.on("copy", () => session?.setCopy(!session.me.copy));
  panel.on("watch", (id) => session?.watch(id));
  panel.on("row", (i) => { const s = panel.students?.[i]; if (s) session?.watch(session.view?.viewing === s.id ? null : s.id); });
  panel.on("peek", () => session?.setPeek(!session.peek));
  panel.render({ session: null });

  return { changed, tick, get session() { return session; }, get locked() { return Boolean(session && viewing !== session.me.id); }, instructorName };
}
