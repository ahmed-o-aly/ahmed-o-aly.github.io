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
