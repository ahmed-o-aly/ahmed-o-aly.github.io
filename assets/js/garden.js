(() => {
  const routes = new Map([
    ["#/hello/", "/"],
    ["#/hello", "/"],
    ["#/about/", "/about/"],
    ["#/about", "/about/"],
    ["#/projects/", "/projects/"],
    ["#/projects", "/projects/"],
    ["#/achievements/", "/about/#credentials"],
    ["#/achievements", "/about/#credentials"],
    ["#/contact/", "/#contact"],
    ["#/contact", "/#contact"],
  ]);

  const base = document.body.dataset.baseurl || "";
  const target = routes.get(window.location.hash);
  if (target) {
    window.location.replace(`${base}${target}`);
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

  const elements = document.querySelectorAll("[data-reveal]");
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8%", threshold: 0.08 }
  );

  elements.forEach((element) => observer.observe(element));
  document.documentElement.classList.add("garden-reveal-ready");
})();
