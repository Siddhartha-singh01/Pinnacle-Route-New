/**
 * Scroll-reveal via IntersectionObserver
 * Adds `.is-visible` to elements with `[data-reveal]` when they enter the viewport.
 */

export function initReveal(): void {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );

  document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
}
