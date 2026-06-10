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

// Bind nav auto-hide ONCE (survives across view transitions)
initNavAutoHide();

// Three.js is heavy — load it only on pages that declare a 3D scene canvas,
// and only after the page is interactive. The module handles its own cleanup.
function initThreeScenesLazy() {
  if (!document.querySelector("canvas[data-three-scene]")) return;
  import("./three").then((m) => m.initThreeScenes());
}

// Re-init everything on each page load (handles view transitions)
document.addEventListener("astro:page-load", () => {
  initLenis();
  initReveal();
  initMagnetic();
  initParallax();
  initVideos();
  initMobileMenu();
  initAccordion();
  initThreeScenesLazy();
});

document.addEventListener("astro:before-swap", () => {
  const w = window as any;
  if (w.__lenis) {
    w.__lenis.destroy();
    w.__lenis = null;
  }
});

// Back-to-top button (Footer)
document.addEventListener("astro:page-load", () => {
  document.getElementById("back-to-top")?.addEventListener("click", () => {
    const lenis = (window as any).__lenis;
    if (lenis) lenis.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
