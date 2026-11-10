import test from "node:test";
import assert from "node:assert/strict";
import { benchWatched, classOf, ghostsFor, makeCode, normaliseCode, poseMoved, progressOf, releaseAction, shouldSendPose, studentsOf, viewFor } from "../class/rules.js";
import { ClassSession, roomName } from "../class/session.js";

// a relay in memory: presence is shared, broadcasts reach everyone else in the room
function hub() {
  const rooms = new Map();
  return () => {
    let room = null, id = null, hooks = null;
    const peers = () => rooms.get(room);
    const publish = () => { for (const p of peers().values()) p.hooks.onPresence([...peers().values()].filter((q) => q.payload).map((q) => q.payload)); };
    return {
      connect(r, i, h) {
        room = r; id = i; hooks = h;
        if (!rooms.has(room)) rooms.set(room, new Map());
        peers().set(id, { hooks, payload: null });
        hooks.onStatus("joined");
      },
      track(payload) { peers().get(id).payload = payload; publish(); },
      send(event, payload) { for (const [pid, p] of peers()) if (pid !== id) p.hooks.onBroadcast(event, structuredClone(payload)); },
      close() { peers().delete(id); publish(); },
    };
  };
}
const flushTimers = () => new Promise((r) => setTimeout(r, 400)); // a presence change can take two 150 ms hops
function classroom(n = 3) {
  const make = hub();
  let t = 0;
  const join = (id, role) => new ClassSession({ lab: "lab8", code: "K7QD", me: { id, name: id.toUpperCase(), role }, transport: make(), now: () => (t += 1) }).connect();
  const teacher = join("teacher", "instructor");
  const students = Array.from({ length: n }, (_, i) => join(`s${i + 1}`, "student"));
  return { teacher, students };
}

test("codes are four unambiguous characters, typed in any case", () => {
  const code = makeCode();
  assert.match(code, /^[A-HJKMNP-Z2-9]{4}$/);
  assert.equal(normaliseCode(" k7q d "), "K7QD");
  assert.equal(normaliseCode("K7Q"), null);
  assert.equal(normaliseCode("K0QD"), null); // 0 and O are never used
  assert.equal(roomName("lab8", "K7QD"), "circuits-lab:lab8:K7QD");
});

test("demo: students view the instructor's bench, locked, and see only the instructor's hands", () => {
  const members = [
    { id: "t", role: "instructor", mode: "demo", joined: 1, viewing: "t" },
    { id: "a", role: "student", joined: 2, viewing: "t" },
    { id: "b", role: "student", joined: 3, viewing: "t" },
  ];
  assert.deepEqual(viewFor({ id: "a", role: "student" }, members), { viewing: "t", locked: true, mode: "demo" });
  assert.deepEqual(viewFor({ id: "t", role: "instructor" }, members), { viewing: "t", locked: false, mode: "demo" });
  assert.deepEqual(ghostsFor({ id: "a" }, members), ["t"]); // not the other student's hands
  assert.deepEqual(ghostsFor({ id: "t" }, members), []);
  assert.ok(shouldSendPose({ id: "t" }, members));
  assert.ok(!shouldSendPose({ id: "a" }, members));
  assert.ok(benchWatched({ id: "t" }, members));
  assert.deepEqual(studentsOf(members).map((m) => m.id), ["a", "b"]);
});

test("work: each student has their own bench; the instructor visits one and both see each other's hands", () => {
  const members = [
    { id: "t", role: "instructor", mode: "work", watch: "a", joined: 1, viewing: "a" },
    { id: "a", role: "student", joined: 2, viewing: "a" },
    { id: "b", role: "student", joined: 3, viewing: "b" },
  ];
  assert.deepEqual(viewFor({ id: "a", role: "student" }, members), { viewing: "a", locked: false, mode: "work" });
  assert.deepEqual(viewFor({ id: "t", role: "instructor", watch: "a" }, members), { viewing: "a", locked: true, mode: "work" });
  assert.deepEqual(ghostsFor({ id: "a" }, members), ["t"]); // the instructor pointing at a's bench
  assert.deepEqual(ghostsFor({ id: "t" }, members), ["a"]); // a's hands at work
  assert.deepEqual(ghostsFor({ id: "b" }, members), []);
  assert.ok(benchWatched({ id: "a" }, members));
  assert.ok(!benchWatched({ id: "b" }, members));
  assert.ok(!shouldSendPose({ id: "b" }, members)); // nobody is looking: nothing to send
  // a student may peek at the instructor's bench, read-only
  assert.deepEqual(viewFor({ id: "b", role: "student", peek: true }, members), { viewing: "t", locked: true, mode: "work" });
  // watching someone who has left falls back to the instructor's own bench
  assert.deepEqual(viewFor({ id: "t", role: "instructor", watch: "gone" }, members).viewing, "t");
});

test("without an instructor everyone has their own bench", () => {
  const members = [{ id: "a", role: "student", viewing: "a" }];
  assert.equal(classOf(members).mode, "solo");
  assert.deepEqual(viewFor({ id: "a", role: "student" }, members), { viewing: "a", locked: false, mode: "solo" });
});

test("release copies the instructor's bench only when asked and when it is known", () => {
  assert.equal(releaseAction({ copy: true }, true), "copy");
  assert.equal(releaseAction({ copy: true }, false), "own");
  assert.equal(releaseAction({ copy: false }, true), "own");
  assert.deepEqual(progressOf([{ done: true }, { done: false }], "short"), { done: 1, total: 2, warn: "short" });
});

test("small hand movements are not sent", () => {
  const pose = { head: { p: [0, 1.5, 0], q: [0, 0, 0, 1] }, hands: [{ p: [0.1, 1.2, -0.3], q: [0, 0, 0, 1], bead: [0.1, 1.15, -0.4], grab: false }, null] };
  const nudged = structuredClone(pose);
  nudged.hands[0].p[0] += 0.001;
  assert.ok(!poseMoved(pose, nudged));
  nudged.hands[0].p[0] += 0.01;
  assert.ok(poseMoved(pose, nudged));
  const grabbed = structuredClone(pose);
  grabbed.hands[0].grab = true;
  assert.ok(poseMoved(pose, grabbed));
  assert.ok(poseMoved(null, pose));
});

test("a class session: demo, release, a visit and the traffic each needs", async () => {
  const { teacher, students } = classroom(2);
  await flushTimers();
  const [a, b] = students;
  // everyone has arrived and is viewing the instructor's bench
  assert.equal(a.members.length, 3);
  assert.equal(a.view.viewing, "teacher");
  assert.ok(a.view.locked);
  await flushTimers();
  // the instructor's bench goes to the class; a student's bench goes nowhere
  const got = [];
  a.on("bench", (m) => got.push(m.from));
  assert.ok(teacher.sendBench({ wires: [] }));
  assert.deepEqual(got, ["teacher"]);
  assert.ok(!a.sendBench({ wires: [] }));
  // release: students go to their own benches
  teacher.setMode("work");
  await flushTimers();
  assert.equal(a.cls.mode, "work");
  assert.equal(a.cls.release, 1);
  assert.deepEqual(a.view, { viewing: "s1", locked: false, mode: "work" });
  assert.ok(!teacher.sendBench({ wires: [] })); // nobody is viewing it now
  // the instructor visits student a
  teacher.watch("s1");
  await flushTimers();
  assert.deepEqual(teacher.view, { viewing: "s1", locked: true, mode: "work" });
  const seen = [];
  teacher.on("bench", (m) => seen.push(m.from));
  assert.ok(a.sendBench({ wires: [{ a: "b12", b: "vin3" }] }));
  assert.ok(!b.sendBench({ wires: [] }));
  assert.deepEqual(seen, ["s1"]);
  assert.ok(a.sendPose({ head: null, hands: [] }));
  assert.ok(teacher.sendPose({ head: null, hands: [] }));
  assert.ok(!b.sendPose({ head: null, hands: [] }));
  // a newcomer's request reaches the bench's owner, and the answer only the newcomer
  const asked = [];
  a.on("want", (m) => asked.push(m));
  teacher.askBench("s1");
  assert.deepEqual(asked.map((m) => [m.from, m.owner]), [["teacher", "s1"]]);
  const heard = [];
  b.on("bench", (m) => heard.push(m.from));
  a.sendBench({ wires: [] }, "teacher");
  assert.deepEqual(heard, []);
  // back to demo
  teacher.setMode("demo");
  await flushTimers();
  assert.equal(b.view.viewing, "teacher");
  assert.equal(teacher.me.watch, null);
  // the instructor leaves: students keep their own benches
  teacher.leave();
  await flushTimers();
  assert.deepEqual(b.view, { viewing: "s2", locked: false, mode: "solo" });
  a.leave();
  b.leave();
});
