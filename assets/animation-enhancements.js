(function () {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const internalLinkSelector = 'a[href], a[data-href], button[data-page-target]';

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
