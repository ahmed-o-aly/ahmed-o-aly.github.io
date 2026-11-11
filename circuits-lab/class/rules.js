// Classroom rules, kept free of three.js and the network so they can be tested
// in Node. A class is one instructor and their students, each with a bench of
// their own. Every member says in their presence which bench they are viewing;
// the instructor's presence also carries the class's mode.
//
//  demo  every student views the instructor's bench, read-only, and sees the
//        instructor's hands on it
//  work  each student works on their own bench; the instructor may view any
//        student's bench (read-only, with their pointer showing there), and a
//        student may peek at the instructor's bench
//
// A bench is sent only while someone else is viewing it, and hands only while
// they would be drawn for someone, so a quiet class sends almost nothing.
//
// The relay counts every message once when sent and once per member it reaches,
// and the free plan disconnects a sender beyond 100 a second across the project.
// So each bench has its own channel, joined only by those viewing it, and hands
// and benches are paced by how many share that channel (see the budget below).

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no I, L, O, 0 or 1 to misread
export const CODE_LENGTH = 4;

export function makeCode(random = Math.random) {
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i += 1) code += ALPHABET[Math.floor(random() * ALPHABET.length)];
  return code;
}

/** A typed code, tidied to upper case without spaces, or null if it cannot be one. */
export function normaliseCode(input) {
  const code = String(input ?? "").toUpperCase().replace(/[\s-]/g, "");
  return code.length === CODE_LENGTH && [...code].every((c) => ALPHABET.includes(c)) ? code : null;
}

export function makeId(random = Math.random) {
  return Array.from({ length: 10 }, () => ALPHABET[Math.floor(random() * ALPHABET.length)]).join("").toLowerCase();
}

/** The instructor present in the class, if any (the earliest to join, should two claim it). */
export function instructorOf(members) {
  return members.filter((m) => m.role === "instructor").sort((a, b) => (a.joined ?? 0) - (b.joined ?? 0) || a.id.localeCompare(b.id))[0] ?? null;
}

/** Students in a stable order: the order they joined. */
export function studentsOf(members) {
  return members.filter((m) => m.role !== "instructor").sort((a, b) => (a.joined ?? 0) - (b.joined ?? 0) || a.id.localeCompare(b.id));
}

/** The class's state as the instructor publishes it. */
export function classOf(members) {
  const lead = instructorOf(members);
  if (!lead) return { mode: "solo", instructor: null, watch: null, release: 0, copy: false };
  return { mode: lead.mode === "work" ? "work" : "demo", instructor: lead.id, watch: lead.watch ?? null, release: lead.release ?? 0, copy: Boolean(lead.copy) };
}

/**
 * Which bench `me` should be viewing and whether it is theirs to change.
 * `me` is { id, role, watch?, peek? }: an instructor's own choice of student, or a student's peek.
 */
export function viewFor(me, members) {
  const cls = classOf(members);
  if (me.role === "instructor") {
    const watched = me.watch && members.some((m) => m.id === me.watch) ? me.watch : null;
    return { viewing: watched ?? me.id, locked: Boolean(watched), mode: cls.mode };
  }
  if (!cls.instructor) return { viewing: me.id, locked: false, mode: "solo" };
  if (cls.mode === "demo") return { viewing: cls.instructor, locked: true, mode: "demo" };
  return me.peek ? { viewing: cls.instructor, locked: true, mode: "work" } : { viewing: me.id, locked: false, mode: "work" };
}

/** Whose hands `me` sees: on the bench being viewed, its owner's and the instructor's. */
export function ghostsFor(me, members) {
  const mine = members.find((m) => m.id === me.id)?.viewing ?? me.id;
  return members.filter((m) => m.id !== me.id && m.viewing === mine && (m.id === mine || m.role === "instructor")).map((m) => m.id);
}

/** Whether anyone would see `me`'s hands, so whether to send them. */
export function shouldSendPose(me, members) {
  return members.some((m) => m.id !== me.id && ghostsFor(m, members).includes(me.id));
}

/** Whether anyone else is viewing `me`'s bench, so whether to send it. */
export function benchWatched(me, members) {
  return members.some((m) => m.id !== me.id && m.viewing === me.id);
}

/** What a student's own bench should become when the instructor releases the class. */
export function releaseAction({ copy }, hasInstructorBench) {
  return copy && hasInstructorBench ? "copy" : "own";
}

/** A short summary of a bench for the roster. */
export function progressOf(steps, warning = null) {
  return { done: steps.filter((s) => s.done).length, total: steps.length, warn: warning || null };
}

/** Whether two hand poses differ enough to be worth sending (3 mm, or about 3°). */
export function poseMoved(a, b) {
  if (!a || !b) return true;
  const far = (p, q, limit) => !p !== !q || (p && q && Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]) > limit);
  const turned = (p, q) => !p !== !q || (p && q && 1 - Math.abs(p[0] * q[0] + p[1] * q[1] + p[2] * q[2] + p[3] * q[3]) > 3e-4);
  if (far(a.head?.p, b.head?.p, 0.003) || turned(a.head?.q, b.head?.q)) return true;
  for (let i = 0; i < 2; i += 1) {
    const [p, q] = [a.hands?.[i], b.hands?.[i]];
    if (!p !== !q) return true;
    if (p && (far(p.p, q.p, 0.003) || turned(p.q, q.q) || far(p.bead, q.bead, 0.003) || p.grab !== q.grab)) return true;
  }
  return false;
}

// ---- the message budget ----
// Hands are the steady traffic; a bench goes only on a change. Keeping hands to
// about 40 messages a second (sent plus delivered), and benches to about 20,
// leaves room under the free plan's 100 for presence and a second sender.
export const HANDS_BUDGET = 40;
export const BENCH_BUDGET = 20;
export const PROGRESS_GAP = 1; // seconds between progress updates, which ride on `state`
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/** How many members share a bench's channel: everyone viewing it, its owner included. */
export function audienceOf(benchId, members) {
  return Math.max(1, members.filter((m) => m.viewing === benchId).length);
}
/** Seconds between hand updates on a channel of `audience` members. */
export function poseInterval(audience) {
  return clamp(audience / HANDS_BUDGET, 0.15, 1);
}
/** Seconds between bench updates on a channel of `audience` members. */
export function benchInterval(audience) {
  return clamp(audience / BENCH_BUDGET, 0.25, 2);
}
/** Messages a second a channel costs at full pace: each message is sent once and delivered to the rest. */
export function channelLoad(audience, senders = 1) {
  return senders * (audience / poseInterval(audience) + audience / benchInterval(audience));
}
