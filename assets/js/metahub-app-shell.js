/** Shared application chrome. Labs supply their existing controls as slots;
 * the shell does not own their scientific state or headset input mapping. */
export function mountLabShell({
  host,
  title,
  heading,
  actions = [],
  context,
  notes,
  catalogue = "/projects/metahub/",
  workspace,
  panelWidth = "314px",
}) {
  if (!host) throw new Error("A MetaHub shell needs a header host");
  document.body.dataset.metahubLab = title.toLowerCase().replaceAll(" ", "-");
  // Opt-in review version; the published default stays available during design review.
  if (new URLSearchParams(location.search).get("theme") === "folio") {
    document.body.classList.add("metahub-folio");
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", labCanvasColor("#f6f0e3"));
  }
  if (workspace) {
    workspace.classList.add("metahub-viewer-layout");
    workspace.style.setProperty("--metahub-panel-width", panelWidth);
  }
  host.classList.add("metahub-app-bar");
  host.setAttribute("aria-label", `${title} workspace`);
  const trail = document.createElement("div");
  trail.className = "metahub-app-trail";
  const back = document.createElement("a");
  back.href = catalogue;
  back.target = "_top";
  back.textContent = "← MetaHub";
  const name = heading || document.createElement("span");
  name.classList.add("metahub-app-name");
  if (!heading) name.textContent = title;
  trail.append(back, name);
  const tools = document.createElement("div");
  tools.className = "metahub-app-actions";
  if (context) {
    context.classList.add("metahub-app-context");
    tools.append(context);
  }
  if (notes) {
    const link = document.createElement("a");
    link.className = "metahub-app-notes";
    link.href = notes;
    link.target = "_top";
    link.textContent = "Project notes";
    tools.append(link);
  }
  tools.append(...actions.filter(Boolean));
  const fullscreen = document.createElement("button");
  fullscreen.type = "button";
  fullscreen.textContent = "Fullscreen";
  fullscreen.hidden = !document.fullscreenEnabled;
  fullscreen.addEventListener("click", async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      fullscreen.textContent = "Fullscreen unavailable";
    }
  });
  const sync = () => {
    fullscreen.textContent = document.fullscreenElement ? "Exit fullscreen" : "Fullscreen";
  };
  document.addEventListener("fullscreenchange", sync);
  tools.append(fullscreen);
  host.replaceChildren(trail, tools);
  return () => document.removeEventListener("fullscreenchange", sync);
}

/** Only the neutral scene backdrop changes; scientific and equipment colours stay intact. */
export function labCanvasColor(fallback) {
  return document.body.classList.contains("metahub-folio") ? getComputedStyle(document.body).getPropertyValue("--garden-canvas").trim() : fallback;
}

/** Skip desktop frame work while a tab is hidden. Immersive sessions keep
 * their own XR visibility handling. The existing app callback/clock is retained. */
export function visibleFrame(renderer, callback, visibility = document) {
  return (...args) => {
    if (visibility.hidden && !renderer.xr?.isPresenting) return;
    callback(...args);
  };
}
