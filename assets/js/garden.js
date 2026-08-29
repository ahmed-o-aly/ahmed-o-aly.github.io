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
  document.documentElement?.classList.add("garden-js");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const menuToggle = document.querySelector(".garden-nav__toggle");
  const menu = document.querySelector(".garden-nav__links");
  if (menuToggle && menu) {
    const menuLabel = menuToggle.querySelector(".sr-only");
    const closeMenu = () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menu.classList.remove("is-open");
      if (menuLabel) menuLabel.textContent = "Open navigation";
    };

    menuToggle.addEventListener("click", () => {
      const willOpen = menuToggle.getAttribute("aria-expanded") !== "true";
      menuToggle.setAttribute("aria-expanded", String(willOpen));
      menu.classList.toggle("is-open", willOpen);
      if (menuLabel) menuLabel.textContent = willOpen ? "Close navigation" : "Open navigation";
    });

    menu.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
        menuToggle.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 700) closeMenu();
    });
  }

  const library = document.querySelector(".garden-main--home .folio-library");
  const parallaxLayers = library ? [...library.querySelectorAll("[data-parallax-y]")] : [];
  let parallaxFrame = 0;

  const updateParallax = () => {
    parallaxFrame = 0;
    if (!library || reduceMotion) return;
    const bounds = library.getBoundingClientRect();
    const distance = window.innerHeight + bounds.height;
    const progress = Math.max(0, Math.min(1, (window.innerHeight - bounds.top) / distance));
    parallaxLayers.forEach((layer) => {
      const travel = Number(layer.dataset.parallaxY || 0);
      layer.style.transform = `translateY(${(travel * progress).toFixed(1)}px)`;
    });
  };

  if (library && !reduceMotion) {
    window.addEventListener(
      "scroll",
      () => {
        if (!parallaxFrame) parallaxFrame = requestAnimationFrame(updateParallax);
      },
      { passive: true }
    );
    requestAnimationFrame(updateParallax);
  }

  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (finePointer && !reduceMotion) {
    const glow = document.querySelector(".folio-cursor-glow");
    let pointerFrame = 0;
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let dotX = pointerX;
    let dotY = pointerY;
    const liveDots = new Set();

    const updatePointer = () => {
      pointerFrame = 0;
      glow?.style.setProperty("--cursor-x", `${pointerX}px`);
      glow?.style.setProperty("--cursor-y", `${pointerY}px`);
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

  document.querySelectorAll("[data-reading-carousel]").forEach((carousel) => {
    const slides = [...carousel.querySelectorAll("[data-reading-slide]")];
    const controls = carousel.querySelector("[data-reading-controls]");
    const previous = carousel.querySelector("[data-reading-previous]");
    const next = carousel.querySelector("[data-reading-next]");
    const position = carousel.querySelector("[data-reading-position]");
    if (slides.length < 2 || !controls || !previous || !next || !position) return;

    let activeIndex = 0;
    const showSlide = (index) => {
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        slide.hidden = slideIndex !== activeIndex;
      });
      position.textContent = `${activeIndex + 1} of ${slides.length}`;
    };

    previous.addEventListener("click", () => showSlide(activeIndex - 1));
    next.addEventListener("click", () => showSlide(activeIndex + 1));
    controls.hidden = false;
    showSlide(0);
  });

  const dialog = document.getElementById("folio-book-dialog");
  let dialogTrigger = null;

  const setDialogText = (selector, value) => {
    const element = dialog?.querySelector(selector);
    if (!element) return;
    element.textContent = value || "";
    element.hidden = !value;
  };

  const readRating = (value) => {
    if (typeof value !== "string" || !value.trim()) return null;
    const rating = Number(value);
    return Number.isFinite(rating) && rating > 0 && rating <= 5 ? rating : null;
  };

  const readProgress = (value) => {
    if (typeof value !== "string" || !value.trim()) return null;
    const progress = Number(value);
    return Number.isFinite(progress) && progress >= 0 && progress <= 100 ? progress : null;
  };

  const formatRating = (rating) => Number(rating.toFixed(2)).toString();

  const openBook = (trigger) => {
    if (!dialog) return;
    dialogTrigger = trigger;
    const title = trigger.dataset.bookTitle || "Untitled";
    const author = trigger.dataset.bookAuthor || "";
    const rating = readRating(trigger.dataset.bookRating);
    const progress = readProgress(trigger.dataset.bookProgress);
    const cover = dialog.querySelector("[data-dialog-cover]");
    const jacket = dialog.querySelector("[data-dialog-jacket]");
    const coverUrl = trigger.dataset.bookCover || "";
    if (cover instanceof HTMLImageElement) {
      cover.src = coverUrl;
      cover.alt = coverUrl ? `Cover of ${title}` : "";
      jacket?.classList.toggle("is-missing", !coverUrl);
    }

    setDialogText("[data-dialog-cover-fallback]", title);
    setDialogText("[data-dialog-title]", title);
    setDialogText("[data-dialog-author]", author);
    setDialogText("[data-dialog-status]", trigger.dataset.bookStatus || "");

    const ratingElement = dialog.querySelector("[data-dialog-rating]");
    if (ratingElement) {
      const ratingText = rating === null ? "" : formatRating(rating);
      ratingElement.textContent = ratingText ? `★ ${ratingText} / 5` : "";
      ratingElement.hidden = !ratingText;
      if (ratingText) ratingElement.setAttribute("aria-label", `My rating: ${ratingText} out of 5`);
      else ratingElement.removeAttribute("aria-label");
    }

    const progressElement = dialog.querySelector("[data-dialog-progress]");
    const progressMeter = dialog.querySelector("[data-dialog-progress-meter]");
    const progressFill = dialog.querySelector("[data-dialog-progress-fill]");
    const progressLabel = trigger.dataset.bookProgressLabel || (progress === null ? "" : `${formatRating(progress)}%`);
    setDialogText("[data-dialog-progress-label]", progressLabel);
    if (progressElement) progressElement.hidden = progress === null;
    if (progressFill instanceof HTMLElement) progressFill.style.width = progress === null ? "0" : `${progress}%`;
    if (progressMeter) {
      if (progress === null) progressMeter.removeAttribute("aria-valuenow");
      else progressMeter.setAttribute("aria-valuenow", String(progress));
    }

    const reviewBody = dialog.querySelector("[data-dialog-review-body]");
    const review = dialog.querySelector("[data-dialog-review]");
    const bookReview = (trigger.dataset.bookReview || "").trim();
    if (reviewBody) {
      reviewBody.replaceChildren();
      bookReview
        .split(/(?:\s*<br\s*\/?>\s*)+|\|\|/i)
        .map((paragraphText) => paragraphText.trim())
        .filter(Boolean)
        .forEach((paragraphText) => {
          const paragraph = document.createElement("p");
          paragraph.textContent = paragraphText;
          reviewBody.appendChild(paragraph);
        });
    }
    if (review) review.hidden = !bookReview;

    const source = dialog.querySelector("[data-dialog-source]");
    const bookUrl = trigger.dataset.bookUrl || "";
    if (source instanceof HTMLAnchorElement) {
      source.href = bookUrl || "#";
      source.hidden = !bookUrl;
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
  });

  document.querySelectorAll("[data-book-cover-image]").forEach((cover) => {
    const markMissing = () => cover.closest(".folio-cover-card__jacket, .folio-reading-banner__jacket")?.classList.add("is-missing");
    cover.addEventListener("error", markMissing, { once: true });
    if (cover.complete && !cover.naturalWidth) markMissing();
  });

  if (dialog) {
    dialog.querySelector("[data-dialog-cover]")?.addEventListener("error", () => {
      dialog.querySelector("[data-dialog-jacket]")?.classList.add("is-missing");
    });
    const closeDialog = () => {
      if (typeof dialog.close === "function") dialog.close();
      else {
        dialog.removeAttribute("open");
        document.body.classList.remove("is-dialog-open");
      }
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
