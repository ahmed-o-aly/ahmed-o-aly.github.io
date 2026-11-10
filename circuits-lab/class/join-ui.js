// The class dialog on a lab's page. Before entering VR the instructor starts a
// class and reads out its code (or shares its link); students type their name
// and the code. A link with ?class=CODE opens the dialog ready to join.
import "./class.css";
import { makeCode, makeId, normaliseCode, studentsOf, instructorOf } from "./rules.js";

const store = (area, key, value) => { try { if (value === undefined) return JSON.parse(area.getItem(key) ?? "null"); if (value === null) area.removeItem(key); else area.setItem(key, JSON.stringify(value)); } catch { return null; } return value; };

/** A tab keeps one member id, so a reload rejoins as the same member. */
export function memberId() {
  return store(sessionStorage, "circuits-class-id") ?? store(sessionStorage, "circuits-class-id", makeId());
}

export function classDialog({ lab }) {
  const handlers = { join: () => {}, leave: () => {} }; // filled in by the bench link
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "Class";
  button.title = "Start or join a class session";
  const dialog = document.createElement("dialog");
  dialog.className = "class-dialog";
  dialog.setAttribute("aria-labelledby", "class-title");
  document.body.append(dialog);
  let joined = null; // { code, role, name }
  let members = [];
  let status = "";

  const el = (tag, props = {}, ...children) => { const n = Object.assign(document.createElement(tag), props); n.append(...children); return n; };
  const close = el("button", { type: "button", className: "class-close", textContent: "Close", onclick: () => dialog.close() });
  const urlFor = (code) => {
    const u = new URL(location.href);
    const relay = u.searchParams.get("relay"); // a development relay stays chosen
    u.search = "";
    u.hash = "";
    u.searchParams.set("class", code);
    if (relay) u.searchParams.set("relay", relay);
    return u.toString();
  };

  function renderJoin(prefill = "", error = "") {
    const name = el("input", { id: "class-name", autocomplete: "name", maxLength: 24, value: store(localStorage, "circuits-lab-name") ?? "", required: true });
    const code = el("input", { id: "class-code", className: "class-code", autocomplete: "off", maxLength: 5, value: prefill, inputMode: "text", spellcheck: false });
    const err = el("p", { className: "class-error", textContent: error, hidden: !error });
    const need = () => {
      const n = name.value.trim();
      if (!n) { err.textContent = "Type your name first."; err.hidden = false; name.focus(); return null; }
      store(localStorage, "circuits-lab-name", n);
      return n;
    };
    const join = el("button", { type: "button", className: "class-primary", textContent: "Join class", onclick: () => {
      const n = need(); if (!n) return;
      const c = normaliseCode(code.value);
      if (!c) { err.textContent = "A class code is four letters and numbers."; err.hidden = false; code.focus(); return; }
      start({ code: c, role: "student", name: n });
    } });
    const host = el("button", { type: "button", textContent: "Start a class as instructor", onclick: () => { const n = need(); if (n) start({ code: makeCode(), role: "instructor", name: n }); } });
    dialog.replaceChildren(close,
      el("h2", { id: "class-title", textContent: "Class session" }),
      el("p", { textContent: "Everyone opens this lab, then the instructor starts a class and students join it with its code, before entering VR." }),
      el("label", { htmlFor: "class-name", textContent: "Your name" }), name,
      el("label", { htmlFor: "class-code", textContent: "Class code" }), code, err,
      el("div", { className: "class-row" }, join),
      el("div", { className: "class-or" }),
      el("div", { className: "class-row" }, host));
    (name.value ? code : name).focus();
  }

  function renderJoined() {
    const link = urlFor(joined.code);
    const students = studentsOf(members);
    const lead = instructorOf(members);
    const copy = el("button", { type: "button", textContent: "Copy link", onclick: async () => { try { await navigator.clipboard.writeText(link); copy.textContent = "Copied"; } catch { copy.textContent = "Copy failed"; } } });
    dialog.replaceChildren(close,
      el("h2", { id: "class-title", textContent: joined.role === "instructor" ? "Your class" : "In class" }),
      el("p", { textContent: joined.role === "instructor"
        ? "Students join with this code. Your bench and the class controls appear in VR on a panel left of the console."
        : `You are in ${lead ? `${lead.name}'s` : "the"} class. Enter VR; the panel left of the console shows what the class is doing.` }),
      el("div", { className: "class-big", textContent: joined.code, ariaLabel: `Class code ${[...joined.code].join(" ")}` }),
      el("p", { className: "class-link", textContent: link }),
      el("p", { textContent: status }),
      el("ul", { className: "class-roster" }, ...[lead ? `${lead.name} · instructor` : "No instructor yet", ...students.map((s) => s.name)].map((t) => el("li", { textContent: t }))),
      el("div", { className: "class-row" }, copy, el("button", { type: "button", textContent: "Leave class", onclick: leave })));
  }

  function start(info) {
    joined = info;
    store(sessionStorage, "circuits-class", { ...info, lab });
    if (info.role === "instructor") history.replaceState(null, "", urlFor(info.code));
    status = "Connecting…";
    renderJoined();
    handlers.join(info);
    label();
  }
  function leave() {
    joined = null;
    store(sessionStorage, "circuits-class", null);
    const u = new URL(location.href); u.searchParams.delete("class"); history.replaceState(null, "", u.toString());
    handlers.leave();
    label();
    dialog.close();
  }
  function label() {
    const n = studentsOf(members).length;
    button.textContent = joined ? `Class ${joined.code}${joined.role === "instructor" ? ` · ${n} student${n === 1 ? "" : "s"}` : ""}` : "Class";
  }
  button.addEventListener("click", () => { if (joined) renderJoined(); else renderJoin(); dialog.showModal(); });

  // a reload rejoins the same class; a shared link opens ready to join
  const resume = store(sessionStorage, "circuits-class");
  const asked = normaliseCode(new URLSearchParams(location.search).get("class"));
  queueMicrotask(() => {
    if (resume && resume.lab === lab && (!asked || asked === resume.code)) start({ code: resume.code, role: resume.role, name: resume.name });
    else if (asked) { renderJoin(asked); dialog.showModal(); }
  });

  return {
    button,
    handlers,
    setMembers(list) { members = list; label(); if (joined && dialog.open) renderJoined(); },
    setStatus(text) { status = text; if (joined && dialog.open) renderJoined(); },
    leave,
  };
}
