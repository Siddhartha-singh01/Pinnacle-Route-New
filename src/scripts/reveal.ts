/**
 * Scroll-reveal via IntersectionObserver
 * Adds `.is-visible` to elements with `[data-reveal]` when they enter the viewport.
 */

let globalIo: IntersectionObserver | null = null;

export function initReveal(): void {
  if (globalIo) {
    globalIo.disconnect();
  }

  globalIo = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          globalIo?.unobserve(e.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );

  document.querySelectorAll("[data-reveal]").forEach((el) => globalIo?.observe(el));
}

document.addEventListener("astro:before-swap", () => {
  if (globalIo) {
    globalIo.disconnect();
    globalIo = null;
  }
});
