document.querySelectorAll("[data-metahub-load]").forEach((button) => {
  button.hidden = false;
  button.addEventListener(
    "click",
    () => {
      const viewport = button.closest(".folio-case-interactive__viewport");
      const frame = viewport.querySelector("[data-metahub-src]");
      frame.src = frame.dataset.metahubSrc;
      frame.hidden = false;
      viewport.querySelector("[data-metahub-preview]").hidden = true;
      frame.focus();
    },
    { once: true }
  );
});
