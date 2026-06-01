/**
 * Scroll parallax
 * Elements with `[data-parallax]` receive a subtle vertical offset on scroll.
 */

export function initParallax(): void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const items = [...document.querySelectorAll<HTMLElement>("[data-parallax]")];
  if (!items.length) return;

  const onScroll = () => {
    const vh = window.innerHeight;
    for (const el of items) {
      const r = el.getBoundingClientRect();
      const speed = Number(el.dataset.parallax) || 0.08;
      const offset = (r.top + r.height / 2 - vh / 2) * -speed;
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}
