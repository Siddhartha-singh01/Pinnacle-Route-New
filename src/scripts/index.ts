/**
 * Master script orchestrator
 * --------------------------
 * Imports all interaction modules and binds them to Astro's page-load event.
 * BaseLayout imports this single file instead of inline scripts.
 */

import { initLenis } from "./lenis";
import { initReveal } from "./reveal";
import { initMagnetic } from "./magnetic";
import { initParallax } from "./parallax";
import { initVideos } from "./videos";
import { initNavAutoHide, initMobileMenu } from "./nav";
import { initAccordion } from "./accordion";
import { initPreloader } from "./preloader";

// Run ONCE per real document load (reload / first visit), not on view transitions
initPreloader();

// Bind nav auto-hide ONCE (survives across view transitions)
initNavAutoHide();

// Re-init everything on each page load (handles view transitions)
document.addEventListener("astro:page-load", () => {
  initLenis();
  initReveal();
  initMagnetic();
  initParallax();
  initVideos();
  initMobileMenu();
  initAccordion();
});

// Back-to-top button (Footer)
document.addEventListener("astro:page-load", () => {
  document.getElementById("back-to-top")?.addEventListener("click", () => {
    const lenis = (window as any).__lenis;
    if (lenis) lenis.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
