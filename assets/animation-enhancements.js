(function () {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const internalLinkSelector = 'a[href], a[data-href], button[data-page-target]';
  const mobileMenuLinks = [
    { label: "Services", href: "/#services" },
    { label: "Solutions", href: "/#solutions" },
    { label: "Techs", href: "/#latest-technologies" },
    { label: "Case Studies", href: "/#case-studies" },
    { label: "About", href: "/#process" },
    { label: "Blog", href: "/blog" },
    { label: "Referral", href: "/referral-collaborations/" },
    { label: "Contact", href: "/#contact" },
    { label: "Book Strategy Call", href: "/strategy-call", cta: true }
  ];

  document.documentElement.classList.add("pr-enhanced-motion");

  const markReady = () => document.body.classList.add("pr-motion-ready");
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", markReady, { once: true });
  } else {
    markReady();
  }

  const setIndexes = (selector) => {
    document.querySelectorAll(selector).forEach((el, index) => {
      el.style.setProperty("--pr-index", index % 12);
    });
  };

  const staggerRevealChildren = () => {
    const groups = [
      ".services-grid",
      ".solutions-grid",
      ".case-grid",
      ".testimonials-grid",
      ".cards-grid",
      ".automate-grid",
      ".outcomes-grid",
      ".use-cases-list",
      ".features",
      ".process",
      ".steps",
      ".steps-visual",
      ".blog-grid",
      ".topics-grid",
      ".client-proof-grid",
      ".tech-grid"
    ];

    groups.forEach((selector) => {
      document.querySelectorAll(selector).forEach((group) => {
        Array.from(group.children).forEach((child, index) => {
          child.style.setProperty("--pr-stagger", `${Math.min(index * 70, 420)}ms`);
        });
      });
    });
  };

  const addPointerGlow = () => {
    const glowTargets = document.querySelectorAll(
      ".service-card, .solution-card, .case-card, .post-card, .featured-card, .automate-card, .feature, .client-proof, .copy-card, .visual-card, .mock-window, .hero-dashboard"
    );

    glowTargets.forEach((target) => {
      target.addEventListener("pointermove", (event) => {
        const rect = target.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        target.style.setProperty("--pr-x", `${x}%`);
        target.style.setProperty("--pr-y", `${y}%`);
      }, { passive: true });
    });
  };

  const buildTechsLink = () => {
    const link = document.createElement("a");
    link.href = "/#latest-technologies";
    link.dataset.href = "/#latest-technologies";
    link.setAttribute("role", "link");
    link.setAttribute("tabindex", "0");
    link.textContent = "Techs";
    return link;
  };

  const hasTechsLink = (root) => Array.from(root.querySelectorAll("a, button"))
    .some((el) => el.textContent.trim().toLowerCase() === "techs");

  const insertAfterText = (root, text, node) => {
    const target = Array.from(root.children).find((child) => child.textContent.trim().toLowerCase() === text);
    if (target) {
      target.insertAdjacentElement("afterend", node);
      return true;
    }
    return false;
  };

  const installTechsLinks = () => {
    document.querySelectorAll(".nav-links").forEach((nav) => {
      if (hasTechsLink(nav)) return;

      const item = document.createElement("li");
      item.appendChild(buildTechsLink());
      const solutionItem = Array.from(nav.children).find((child) =>
        child.textContent.trim().toLowerCase() === "solutions"
      );

      if (solutionItem) solutionItem.insertAdjacentElement("afterend", item);
      else nav.appendChild(item);
    });

    document.querySelectorAll(".footer-links").forEach((footerLinks) => {
      if (hasTechsLink(footerLinks)) return;

      const link = buildTechsLink();
      const blog = Array.from(footerLinks.children).find((child) =>
        child.textContent.trim().toLowerCase() === "blog"
      );

      if (blog) blog.insertAdjacentElement("beforebegin", link);
      else footerLinks.appendChild(link);
    });

    document.querySelectorAll(".footer-col ul").forEach((list) => {
      if (hasTechsLink(list)) return;
      const heading = list.closest(".footer-col")?.querySelector("h4")?.textContent.trim().toLowerCase();
      if (heading !== "company") return;

      const item = document.createElement("li");
      item.appendChild(buildTechsLink());
      if (!insertAfterText(list, "case studies", item)) list.appendChild(item);
    });
  };

  const scrollToHashTarget = () => {
    if (!window.location.hash) return;

    let target;
    try {
      target = document.querySelector(window.location.hash);
    } catch (error) {
      return;
    }
    if (!target) return;

    const header = document.querySelector("#nav, .topbar");
    const offset = header ? Math.ceil(header.getBoundingClientRect().height + 14) : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  };

  const installHashCorrection = () => {
    window.addEventListener("hashchange", () => {
      window.setTimeout(scrollToHashTarget, 80);
      window.setTimeout(scrollToHashTarget, 700);
    });

    window.setTimeout(scrollToHashTarget, 120);
    window.setTimeout(scrollToHashTarget, 900);
  };

  const themeLogoCache = new Map();

  const loadImageElement = (img, src) => new Promise((resolve, reject) => {
    const loadedSource = img.currentSrc || img.src;
    if (img.complete && img.naturalWidth > 0 && loadedSource === src) {
      resolve(img);
      return;
    }

    const loader = new Image();
    loader.decoding = "async";
    loader.onload = () => resolve(loader);
    loader.onerror = reject;
    loader.src = src;
  });

  const transparentizeLogo = async (img) => {
    const originalSrc = img.dataset.prOriginalSrc || img.getAttribute("src") || img.currentSrc || img.src;
    if (!originalSrc || originalSrc.startsWith("data:")) return originalSrc;
    img.dataset.prOriginalSrc = originalSrc;
    if (themeLogoCache.has(originalSrc)) return themeLogoCache.get(originalSrc);

    const job = loadImageElement(img, originalSrc).then((loaded) => {
      const canvas = document.createElement("canvas");
      const width = loaded.naturalWidth;
      const height = loaded.naturalHeight;
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d", { willReadFrequently: true });
      context.drawImage(loaded, 0, 0, width, height);

      const imageData = context.getImageData(0, 0, width, height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const saturation = max - min;
        const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        const nearWhite = luminance > 218 && saturation < 34;
        const softWhite = luminance > 238;

        if (nearWhite || softWhite) {
          data[i + 3] = 0;
          continue;
        }

        const darkNeutral = luminance < 128 && saturation < 42;
        if (darkNeutral) {
          const lift = luminance < 72 ? 245 : 220;
          data[i] = lift;
          data[i + 1] = lift;
          data[i + 2] = Math.max(205, lift - 8);
          data[i + 3] = Math.max(data[i + 3], 230);
          continue;
        }

        const darkColor = luminance < 95;
        if (darkColor) {
          data[i] = Math.min(255, Math.round(r * 1.32 + 14));
          data[i + 1] = Math.min(255, Math.round(g * 1.32 + 14));
          data[i + 2] = Math.min(255, Math.round(b * 1.32 + 14));
        } else {
          data[i] = Math.min(255, Math.round(r * 1.05));
          data[i + 1] = Math.min(255, Math.round(g * 1.05));
          data[i + 2] = Math.min(255, Math.round(b * 1.05));
        }
      }

      context.putImageData(imageData, 0, 0);
      return canvas.toDataURL("image/png");
    });

    themeLogoCache.set(originalSrc, job);
    return job;
  };

  const themeTechLogos = () => {
    const logos = document.querySelectorAll("#latest-technologies .tech-logo-card img");
    logos.forEach(async (img) => {
      try {
        const themedSrc = await transparentizeLogo(img);
        if (themedSrc && img.src !== themedSrc) img.src = themedSrc;
        img.classList.add("pr-logo-processed");
      } catch (error) {
        img.classList.add("pr-logo-fallback");
      }
    });
  };

  const createMobileMenu = () => {
    const existing = document.getElementById("mobileMenu");
    if (existing) return existing;

    const menu = document.createElement("div");
    menu.className = "mobile-menu";
    menu.id = "mobileMenu";
    menu.setAttribute("aria-hidden", "true");

    const close = document.createElement("button");
    close.className = "mobile-close";
    close.id = "menuClose";
    close.type = "button";
    close.setAttribute("aria-label", "Close menu");
    close.textContent = "x";
    menu.appendChild(close);

    const header = document.querySelector("#nav, .topbar");
    if (header) {
      header.insertAdjacentElement("afterend", menu);
    } else {
      document.body.prepend(menu);
    }

    return menu;
  };

  const createStrategyToggle = () => {
    if (document.getElementById("menuToggle")) return;

    const topbarInner = document.querySelector(".topbar-inner");
    if (!topbarInner) return;

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "pr-mobile-toggle";
    toggle.id = "menuToggle";
    toggle.setAttribute("aria-label", "Open menu");
    toggle.setAttribute("aria-controls", "mobileMenu");
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = "<span></span><span></span><span></span>";
    topbarInner.appendChild(toggle);
  };

  const normalizeMobileMenu = () => {
    createStrategyToggle();
    const menu = createMobileMenu();
    const close = menu.querySelector("#menuClose, .mobile-close");

    menu.innerHTML = "";
    if (close) menu.appendChild(close);

    const sectionTitle = document.createElement("div");
    sectionTitle.className = "pr-mobile-section-title";
    sectionTitle.textContent = "Navigate";
    menu.appendChild(sectionTitle);

    mobileMenuLinks.forEach((item) => {
      const link = document.createElement("a");
      link.className = item.cta ? "nav-cta" : "ml mobile-link";
      link.dataset.href = item.href;
      link.setAttribute("role", "link");
      link.setAttribute("tabindex", "0");
      link.textContent = item.label;
      menu.appendChild(link);
    });

    if (!menu.querySelector("#menuClose, .mobile-close")) {
      const newClose = document.createElement("button");
      newClose.className = "mobile-close";
      newClose.id = "menuClose";
      newClose.type = "button";
      newClose.setAttribute("aria-label", "Close menu");
      newClose.textContent = "x";
      menu.prepend(newClose);
    }

    const toggle = document.getElementById("menuToggle");
    if (toggle) {
      toggle.setAttribute("role", toggle.tagName === "BUTTON" ? "button" : "button");
      toggle.setAttribute("tabindex", "0");
      toggle.setAttribute("aria-controls", "mobileMenu");
      toggle.setAttribute("aria-expanded", menu.classList.contains("open") ? "true" : "false");
    }
  };

  const setMenuOpen = (open) => {
    const menu = document.getElementById("mobileMenu");
    const toggle = document.getElementById("menuToggle");
    if (!menu) return;

    menu.classList.toggle("open", open);
    menu.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.classList.toggle("pr-body-menu-locked", open);
    document.documentElement.classList.toggle("pr-mobile-menu-open", open);
    if (toggle) toggle.setAttribute("aria-expanded", open ? "true" : "false");
  };

  const installMobileMenu = () => {
    normalizeMobileMenu();

    document.addEventListener("click", (event) => {
      const toggle = event.target.closest("#menuToggle");
      if (toggle) {
        event.preventDefault();
        event.stopImmediatePropagation();
        const menu = document.getElementById("mobileMenu");
        setMenuOpen(!menu?.classList.contains("open"));
        return;
      }

      if (event.target.closest("#menuClose, .mobile-close")) {
        event.preventDefault();
        event.stopImmediatePropagation();
        setMenuOpen(false);
        return;
      }

      if (event.target.closest("#mobileMenu a, #mobileMenu button:not(.mobile-close)")) {
        setMenuOpen(false);
      }
    }, true);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setMenuOpen(false);

      const toggle = event.target.closest?.("#menuToggle");
      if (toggle && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        event.stopImmediatePropagation();
        const menu = document.getElementById("mobileMenu");
        setMenuOpen(!menu?.classList.contains("open"));
      }
    }, true);
  };

  const shouldTransition = (url, event) => {
    if (prefersReducedMotion || event.defaultPrevented) return false;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
    if (!url || url.startsWith("#") || url.startsWith("mailto:") || url.startsWith("tel:")) return false;

    let next;
    try {
      next = new URL(url, window.location.href);
    } catch (error) {
      return false;
    }

    if (next.origin !== window.location.origin) return false;
    if (next.pathname === window.location.pathname && next.hash) return false;
    return true;
  };

  const installPageTransitions = () => {
    document.addEventListener("click", (event) => {
      const trigger = event.target.closest(internalLinkSelector);
      if (!trigger) return;

      const target = trigger.getAttribute("target");
      if (target && target !== "_self") return;

      const href = trigger.dataset.pageTarget || trigger.dataset.href || trigger.getAttribute("href");
      if (!shouldTransition(href, event)) return;

      event.preventDefault();
      document.body.classList.add("pr-page-leaving");
      window.setTimeout(() => {
        window.location.href = href;
      }, 210);
    }, true);
  };

  const init = () => {
    installTechsLinks();
    installMobileMenu();
    installHashCorrection();
    themeTechLogos();
    setIndexes(".chart-bars .bar, .flow-line, .flow-arrow, .mobile-menu a, .mobile-menu .nav-cta");
    staggerRevealChildren();
    addPointerGlow();
    installPageTransitions();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
