(() => {
  const root = document.querySelector("[data-metahub-catalogue]");
  if (!root) return;
  const cards = [...root.querySelectorAll("[data-metahub-card]")];
  const form = root.querySelector("form");
  const search = root.querySelector("#metahub-search");
  const subject = root.querySelector("#metahub-subject");
  const count = root.querySelector("[data-metahub-count]");
  const empty = root.querySelector("[data-metahub-empty]");
  const dialog = root.querySelector("dialog");
  const details = root.querySelector("[data-metahub-details]");
  const params = new URLSearchParams(location.search);
  search.value = params.get("q") || "";
  subject.value = params.get("subject") || "";
  function filter() {
    const terms = search.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    let visible = 0;
    for (const card of cards) {
      const text = card.querySelector("a").textContent.toLocaleLowerCase();
      card.hidden = !(terms.every((term) => text.includes(term)) && (!subject.value || card.dataset.subject === subject.value));
      if (!card.hidden) visible++;
    }
    count.textContent = `${visible} of ${cards.length} experiences`;
    empty.hidden = visible !== 0;
    const url = new URL(location.href);
    for (const [key, value] of [
      ["q", search.value.trim()],
      ["subject", subject.value],
    ]) {
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    }
    history.replaceState(null, "", url);
  }
  form.hidden = false;
  form.addEventListener("submit", (event) => event.preventDefault());
  search.addEventListener("input", filter);
  subject.addEventListener("change", filter);
  form.addEventListener("reset", () => {
    search.value = "";
    subject.value = "";
    filter();
  });
  filter();
  if (!dialog.showModal) return; // Ordinary project links remain usable.
  let opener;
  function open(id, trigger) {
    const card = cards.find((card) => card.id === id);
    if (!card) return;
    opener = trigger || card.querySelector("a");
    details.replaceChildren(card.querySelector("template").content.cloneNode(true));
    if (!dialog.open) dialog.showModal();
    const url = new URL(location.href);
    url.hash = id;
    history.replaceState(null, "", url);
  }
  root.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-metahub-open]");
    if (!trigger || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    open(trigger.dataset.metahubOpen, trigger);
  });
  root.querySelector("[data-metahub-close]").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    }
  });
  dialog.addEventListener("close", () => {
    const url = new URL(location.href);
    url.hash = "";
    history.replaceState(null, "", url);
    details.replaceChildren();
    if (opener && !opener.closest("li").hidden) opener.focus();
    else search.focus();
  });
  open(location.hash.slice(1));
  window.addEventListener("hashchange", () => {
    if (location.hash) open(location.hash.slice(1));
    else if (dialog.open) dialog.close();
  });
})();
