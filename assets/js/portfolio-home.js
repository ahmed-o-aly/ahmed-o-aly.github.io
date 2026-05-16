(function () {
  const app = document.querySelector("[data-portfolio-app]");

  if (!app) return;

  const routes = ["hello", "about", "achievements", "coding", "design", "contact"];
  const sections = Array.from(app.querySelectorAll("[data-route]"));
  const routeLinks = Array.from(app.querySelectorAll("[data-route-link]"));
  const navPanel = app.querySelector("[data-menu-panel]");
  const menuToggle = app.querySelector("[data-menu-toggle]");
  const menuClose = app.querySelector("[data-menu-close]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let activeRoute = "";

  function routeFromHash() {
    const match = window.location.hash.match(/^#\/([^/]+)\/?$/);
    return match && routes.includes(match[1]) ? match[1] : "hello";
  }

  function closeMenu() {
    navPanel.classList.remove("is-open");
    navPanel.setAttribute("aria-hidden", "true");
    navPanel.inert = true;
    menuToggle.classList.remove("is-active");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    document.body.classList.remove("ii-menu-open");
  }

  function openMenu() {
    navPanel.classList.add("is-open");
    navPanel.setAttribute("aria-hidden", "false");
    navPanel.inert = false;
    menuToggle.classList.add("is-active");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation");
    document.body.classList.add("ii-menu-open");
  }

  function toggleMenu() {
    if (navPanel.classList.contains("is-open")) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function scrambleTitle(section) {
    const target = section.querySelector("[data-scramble]");
    if (!target || reduceMotion) return;

    const original = target.getAttribute("data-scramble") || target.textContent;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/._";
    let frame = 0;
    const maxFrames = 14;

    window.clearInterval(target._scrambleTimer);
    target._scrambleTimer = window.setInterval(() => {
      target.textContent = original
        .split("")
        .map((letter, index) => {
          if (letter === " " || letter === "/") return letter;
          return index < frame / 1.5 ? letter : chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");

      frame += 1;

      if (frame > maxFrames) {
        window.clearInterval(target._scrambleTimer);
        target.textContent = original;
      }
    }, 32);
  }

  function setActiveRoute(route) {
    const nextRoute = routes.includes(route) ? route : "hello";
    const isInitialRender = activeRoute === "";
    activeRoute = nextRoute;

    sections.forEach((section) => {
      const isActive = section.dataset.route === nextRoute;
      const keepInitialReveal = isInitialRender && isActive && section.classList.contains("is-revealed");

      section.classList.toggle("is-active", isActive);
      section.hidden = !isActive;

      if (!isActive) {
        section.classList.remove("is-revealed");
        return;
      }

      if (keepInitialReveal) return;

      section.classList.remove("is-revealed");
      window.requestAnimationFrame(() => {
        section.classList.add("is-revealed");
        scrambleTitle(section);
      });
    });

    routeLinks.forEach((link) => {
      const linkRoute = (link.getAttribute("href") || "").match(/^#\/([^/]+)\//);
      const isActive = !!linkRoute && linkRoute[1] === nextRoute;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    document.documentElement.dataset.portfolioRoute = nextRoute;
    closeMenu();
  }

  routeLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const href = link.getAttribute("href");
      const match = href && href.match(/^#\/([^/]+)\//);
      if (match && match[1] === activeRoute) closeMenu();
    });
  });

  menuToggle.addEventListener("click", toggleMenu);
  menuClose.addEventListener("click", closeMenu);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("hashchange", () => {
    setActiveRoute(routeFromHash());
  });

  if (!window.location.hash) {
    window.history.replaceState(null, "", "#/hello/");
  }

  setActiveRoute(routeFromHash());
})();
