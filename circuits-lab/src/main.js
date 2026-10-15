// Lab 7 has one manual experiment; neighboring labs retain their established workspace.
const lab = new URLSearchParams(location.search).get("lab");
if (lab === "7" || lab === "opamp") {
  import("./amplifier-app.js");
} else {
  import("./legacy-main.js");
  document.addEventListener(
    "click",
    (event) => {
      const target = event.target.closest('[data-action="module:opamp"]');
      if (!target) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      const url = new URL(location.href);
      url.searchParams.set("lab", "7");
      location.assign(url);
    },
    true
  );
}
