/**
 * Lenis smooth scroll initialization
 */
import Lenis from "lenis";

export function initLenis(): void {
  const w = window as any;
  if (w.__lenis) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
  w.__lenis = lenis;

  const raf = (time: number) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
}
