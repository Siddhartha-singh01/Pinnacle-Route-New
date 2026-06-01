/**
 * Navigation scripts
 * ------------------
 * 1. Auto-hide nav on scroll (bound once, survives view transitions).
 * 2. Mobile menu open/close bindings.
 */

/** Auto-hide: hides nav when scrolling up, reveals when scrolling down. */
export function initNavAutoHide(): void {
  const w = window as any;
  if (w.__navScrollBound) return;
  w.__navScrollBound = true;
  w.__navLastY = window.scrollY;

  const THRESHOLD = 8;

  window.addEventListener(
    "scroll",
    () => {
      const nav = document.getElementById("site-nav");
      if (!nav) return;

      const y = window.scrollY;
      const lastY = w.__navLastY;

      if (y < 80) {
        nav.classList.remove("nav-hidden"); // always visible near the top
      } else {
        const isStrict = document.body.hasAttribute("data-strict-nav");
        if (isStrict) {
          nav.classList.add("nav-hidden");
        } else if (Math.abs(y - lastY) > THRESHOLD) {
          // hide when scrolling up, reveal when scrolling down
          nav.classList.toggle("nav-hidden", y < lastY);
        }
      }

      w.__navLastY = y;
    },
    { passive: true },
  );
}

/** Bind mobile menu open/close. Re-runs on every page load. */
export function initMobileMenu(): void {
  const menu = document.getElementById("mobile-menu");
  if (!menu) return;

  const close = () => menu.classList.add("translate-y-full");

  document.getElementById("menu-open")?.addEventListener("click", () => {
    menu.classList.remove("translate-y-full");
  });

  document.getElementById("menu-close")?.addEventListener("click", close);

  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
}
