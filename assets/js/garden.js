(() => {
  const legacyRoutes = new Map([
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
  const legacyTarget = legacyRoutes.get(window.location.hash);
  if (legacyTarget) {
    window.location.replace(`${base}${legacyTarget}`);
    return;
  }

  if (typeof document.querySelector !== "function") return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const homePath = `${base}/`.replace(/\/{2,}/g, "/");
  const header = document.querySelector(".garden-header");
  const pageTurn = document.querySelector(".folio-page-turn");
  let turning = false;

  const scrollToTarget = (target, behavior = "smooth") => {
    if (!target) return;
    const offset = header ? header.getBoundingClientRect().height : 72;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: reduceMotion ? "auto" : behavior });
  };

  document.querySelectorAll("[data-scroll-target]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.getElementById(link.dataset.scrollTarget);
      if (!target) return;
      event.preventDefault();
      history.replaceState(null, "", `#${target.id}`);
      scrollToTarget(target);
    });
  });

  const monogram = document.querySelector(".garden-nav__monogram");
  if (monogram && window.location.pathname === homePath) {
    monogram.addEventListener("click", (event) => {
      event.preventDefault();
      history.replaceState(null, "", homePath);
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  const shouldTurn = (event, anchor) => {
    if (reduceMotion || turning || !pageTurn || event.defaultPrevented || event.button !== 0) return false;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
    if (anchor.target && anchor.target !== "_self") return false;
    const destination = new URL(anchor.href, window.location.href);
    if (destination.origin !== window.location.origin) return false;
    return destination.href !== window.location.href;
  };

  document.addEventListener("click", (event) => {
    const anchor = event.target.closest("a[data-page-turn], .garden-nav__monogram");
    if (!anchor || !shouldTurn(event, anchor)) return;
    event.preventDefault();
    turning = true;
    const destination = new URL(anchor.href, window.location.href);
    if (window.location.pathname === homePath) sessionStorage.setItem("folioHomeScroll", String(window.scrollY));
    if (destination.pathname === homePath && !destination.hash) sessionStorage.setItem("folioRestoreHome", "true");
    pageTurn.classList.add("is-turning");
    window.setTimeout(() => window.location.assign(destination.href), 380);
    window.setTimeout(() => {
      turning = false;
      pageTurn.classList.remove("is-turning");
    }, 950);
  });

  const restoringHome = window.location.pathname === homePath && sessionStorage.getItem("folioRestoreHome") === "true";
  if (restoringHome) {
    const saved = Number(sessionStorage.getItem("folioHomeScroll") || 0);
    sessionStorage.removeItem("folioRestoreHome");
    requestAnimationFrame(() => window.scrollTo({ top: saved, behavior: "auto" }));
  }

  const revealElements = [...document.querySelectorAll("[data-reveal]")];
  if (restoringHome) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  } else if (!reduceMotion && "IntersectionObserver" in window && revealElements.length) {
    document.documentElement.classList.add("garden-reveal-ready");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const siblings = entry.target.parentElement ? [...entry.target.parentElement.children] : [];
          const index = Math.max(0, siblings.indexOf(entry.target));
          entry.target.style.transitionDelay = `${(index % 4) * 0.12}s`;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );
    revealElements.forEach((element) => observer.observe(element));
  }

  const library = document.getElementById("sec-library");
  const parallaxLayers = [...document.querySelectorAll("[data-parallax]")];
  let scrollFrame = 0;
  const updateParallax = () => {
    scrollFrame = 0;
    if (!library || reduceMotion) return;
    const bounds = library.getBoundingClientRect();
    if (bounds.bottom < -100 || bounds.top > window.innerHeight + 100) return;
    const offset = bounds.top + bounds.height / 2 - window.innerHeight / 2;
    parallaxLayers.forEach((layer) => {
      const factor = Number(layer.dataset.parallax || 0);
      layer.style.transform = `translateY(${(offset * factor).toFixed(1)}px)`;
    });
  };
  if (library && !reduceMotion) {
    window.addEventListener(
      "scroll",
      () => {
        if (!scrollFrame) scrollFrame = requestAnimationFrame(updateParallax);
      },
      { passive: true }
    );
    requestAnimationFrame(updateParallax);
  }

  const pointerFine = window.matchMedia("(pointer: fine)").matches;
  if (pointerFine && !reduceMotion) {
    const glow = document.querySelector(".folio-cursor-glow");
    const driftElements = [...document.querySelectorAll("[data-drift]")];
    let pointerFrame = 0;
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let dotX = pointerX;
    let dotY = pointerY;
    const liveDots = new Set();

    const updatePointer = () => {
      pointerFrame = 0;
      if (glow) {
        glow.style.setProperty("--cursor-x", `${pointerX}px`);
        glow.style.setProperty("--cursor-y", `${pointerY}px`);
      }
      const nx = pointerX / window.innerWidth - 0.5;
      const ny = pointerY / window.innerHeight - 0.5;
      driftElements.forEach((element) => {
        const factor = Number(element.dataset.drift || 0);
        element.style.transform = `translate(${(-nx * factor).toFixed(2)}px, ${(-ny * factor).toFixed(2)}px)`;
      });
    };

    window.addEventListener(
      "mousemove",
      (event) => {
        pointerX = event.clientX;
        pointerY = event.clientY;
        if (!pointerFrame) pointerFrame = requestAnimationFrame(updatePointer);
        if (Math.hypot(pointerX - dotX, pointerY - dotY) < 90 || liveDots.size >= 14) return;
        dotX = pointerX;
        dotY = pointerY;
        const dot = document.createElement("span");
        dot.className = "folio-ink-dot";
        dot.style.left = `${pointerX}px`;
        dot.style.top = `${pointerY}px`;
        document.body.appendChild(dot);
        liveDots.add(dot);
        window.setTimeout(() => {
          liveDots.delete(dot);
          dot.remove();
        }, 1200);
      },
      { passive: true }
    );
  }

  const dialog = document.getElementById("folio-book-dialog");
  let dialogTrigger = null;
  const setDialogText = (selector, value) => {
    const element = dialog ? dialog.querySelector(selector) : null;
    if (element) element.textContent = value || "";
  };

  const openBook = (trigger) => {
    if (!dialog) return;
    dialogTrigger = trigger;
    const title = trigger.dataset.bookTitle || "Untitled";
    const author = trigger.dataset.bookAuthor || "";
    const rating = Math.max(0, Math.min(5, Number(trigger.dataset.bookRating || 0)));
    const cover = dialog.querySelector("[data-dialog-cover]");
    if (cover) cover.style.setProperty("--dialog-book-color", trigger.dataset.bookColor || "#5d4632");
    setDialogText("[data-dialog-cover-title]", title);
    setDialogText("[data-dialog-cover-author]", author);
    setDialogText("[data-dialog-title]", title);
    setDialogText("[data-dialog-author]", author);
    setDialogText("[data-dialog-status]", trigger.dataset.bookStatus || "On the shelf");
    setDialogText("[data-dialog-rating]", rating ? `${"★".repeat(rating)}${"☆".repeat(5 - rating)}` : "●●●○○ in progress");
    const notes = dialog.querySelector("[data-dialog-notes]");
    if (notes) {
      notes.replaceChildren();
      (trigger.dataset.bookNotes || "Notes coming soon.")
        .split("||")
        .map((note) => note.trim())
        .filter(Boolean)
        .forEach((note) => {
          const paragraph = document.createElement("p");
          paragraph.textContent = note;
          notes.appendChild(paragraph);
        });
    }
    document.body.classList.add("is-dialog-open");
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  };

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-book-trigger]");
    if (trigger) {
      event.preventDefault();
      openBook(trigger);
      return;
    }
    if (event.target.closest("[data-book-proxy]")) {
      const featureTrigger = document.querySelector(".folio-reading-feature [data-book-trigger]");
      if (featureTrigger) openBook(featureTrigger);
    }
  });

  if (dialog) {
    const closeDialog = () => {
      if (typeof dialog.close === "function") dialog.close();
      else dialog.removeAttribute("open");
    };
    dialog.querySelector("[data-dialog-close]")?.addEventListener("click", closeDialog);
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) closeDialog();
    });
    dialog.addEventListener("close", () => {
      document.body.classList.remove("is-dialog-open");
      dialogTrigger?.focus();
      dialogTrigger = null;
    });
  }
})();
