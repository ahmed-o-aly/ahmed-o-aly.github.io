import test from "node:test";
import assert from "node:assert/strict";
import { audienceOf, benchInterval, benchWatched, channelLoad, classOf, ghostsFor, makeCode, normaliseCode, poseInterval, poseMoved, progressOf, releaseAction, shouldSendPose, studentsOf, viewFor } from "../class/rules.js";
import { ClassSession, roomName } from "../class/session.js";

// a relay in memory: presence is shared on the class channel; a bench channel's
// broadcasts reach the others on it. It counts what the real relay would bill:
// each message once when sent and once per member it reaches.
function hub() {
  const rooms = new Map();
  const tally = { sent: 0, delivered: 0, tracks: 0, byRoom: new Map() };
  const make = () => {
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
      openSub(name, h) {
        const key = Symbol(id);
        if (!rooms.has(name)) rooms.set(name, new Map());
        rooms.get(name).set(key, { hooks: h });
        h.onStatus("joined");
        return {
          send(event, payload) {
            tally.sent += 1;
            for (const [k, p] of rooms.get(name)) if (k !== key) { tally.delivered += 1; tally.byRoom.set(name, (tally.byRoom.get(name) ?? 0) + 1); p.hooks.onBroadcast(event, structuredClone(payload)); }
          },
          close() { rooms.get(name)?.delete(key); },
        };
      },
      track(payload) { tally.tracks += 1; peers().get(id).payload = payload; publish(); },
      send(event, payload) { for (const [pid, p] of peers()) if (pid !== id) p.hooks.onBroadcast(event, structuredClone(payload)); },
      close() { if (room && peers()?.has(id)) { peers().delete(id); publish(); } },
      drop() { hooks.onStatus("closed"); }, // the relay cutting this member off
    };
  };
  make.tally = tally;
  return make;
}
const flushTimers = () => new Promise((r) => setTimeout(r, 400)); // a presence change can take two 150 ms hops
function classroom(n = 3) {
  const make = hub();
  let t = 0;
  const join = (id, role) => new ClassSession({ lab: "lab8", code: "K7QD", me: { id, name: id.toUpperCase(), role }, transport: make(), now: () => (t += 1), retry: [20] }).connect();
  const teacher = join("teacher", "instructor");
  const students = Array.from({ length: n }, (_, i) => join(`s${i + 1}`, "student"));
  return { teacher, students, tally: make.tally };
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

test("a full class stays well inside the relay's 100 messages a second", () => {
  // demo: the instructor and every student share the instructor's bench channel
  for (const students of [8, 12, 20]) {
    const audience = students + 1;
    assert.ok(channelLoad(audience) <= 62, `${students} students: ${channelLoad(audience)} a second`);
  }
  // a visit: two people on a student's bench, both sending hands and benches
  assert.ok(channelLoad(2, 2) <= 62);
  // hands slow down as the audience grows, but never below about once a second
  assert.ok(poseInterval(2) < poseInterval(9));
  assert.ok(poseInterval(50) <= 1);
  assert.ok(benchInterval(9) >= 0.25);
  assert.equal(audienceOf("t", [{ id: "t", viewing: "t" }, { id: "a", viewing: "t" }, { id: "b", viewing: "b" }]), 2);
});

test("bench traffic reaches only those viewing that bench", async () => {
  const { teacher, students, tally } = classroom(3);
  await flushTimers();
  teacher.setMode("work");
  await flushTimers();
  teacher.watch("s1");
  await flushTimers();
  const [a, b, c] = students;
  const heard = { b: 0, c: 0, teacher: 0 };
  b.on("pose", () => (heard.b += 1));
  c.on("pose", () => (heard.c += 1));
  teacher.on("pose", () => (heard.teacher += 1));
  const before = tally.delivered;
  for (let i = 0; i < 10; i += 1) a.sendPose({ head: null, hands: [] });
  assert.equal(heard.teacher, 10);
  assert.equal(heard.b + heard.c, 0);
  assert.equal(tally.delivered - before, 10); // one listener, not the whole class
  assert.ok(!b.sendPose({ head: null, hands: [] })); // nobody on b's bench to see it
  for (const s of [teacher, a, b, c]) s.leave();
});

test("a member the relay drops comes back and announces itself again", async () => {
  const make = hub();
  const transport = make();
  let connects = 0;
  const connect = transport.connect.bind(transport);
  transport.connect = (...args) => { connects += 1; connect(...args); };
  const other = new ClassSession({ lab: "lab8", code: "K7QD", me: { id: "s1", name: "S1", role: "student" }, transport: make() }).connect();
  const teacher = new ClassSession({ lab: "lab8", code: "K7QD", me: { id: "t", name: "T", role: "instructor" }, transport, retry: [20] }).connect();
  await flushTimers();
  assert.equal(connects, 1);
  assert.equal(other.cls.instructor, "t");
  transport.drop();
  assert.equal(teacher.status, "closed");
  await flushTimers();
  assert.equal(connects, 2);
  assert.equal(teacher.status, "joined");
  assert.equal(other.cls.instructor, "t"); // back in the class, still its instructor
  assert.equal(teacher.cls.mode, "demo");
  teacher.leave();
  other.leave();
});

test("presence goes out once per join, however busy the class (the relay closes a member sending more)", async () => {
  const { teacher, students, tally } = classroom(3);
  await flushTimers();
  const joins = tally.tracks;
  assert.equal(joins, 4);
  // a busy minute: modes, visits, copies, progress
  for (let i = 0; i < 5; i += 1) {
    teacher.setMode("work");
    teacher.watch("s1");
    teacher.setCopy(i % 2 === 0);
    teacher.watch(null);
    teacher.setMode("demo");
    teacher.update({ progress: { done: i, total: 9, warn: null } });
  }
  await flushTimers();
  assert.equal(tally.tracks, joins);
  // and everyone still knows the class's state
  assert.equal(students[0].cls.mode, "demo");
  assert.equal(students[0].members.find((m) => m.id === "teacher").progress.done, 4);
  for (const s of [teacher, ...students]) s.leave();
});
