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

// Bind the Escape-to-close handler on `document` only once (document persists
// across view transitions, so re-binding each page load would leak listeners).
let escBound = false;

/** Bind mobile menu open/close + submenu accordions. Re-runs on every page load. */
export function initMobileMenu(): void {
  const menu = document.getElementById("mobile-menu");
  if (!menu) return;

  const openBtn = document.getElementById("menu-open");

  const open = (): void => {
    menu.classList.remove("translate-y-full");
    menu.setAttribute("aria-hidden", "false");
    openBtn?.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden"; // lock background scroll
  };

  const close = (): void => {
    menu.classList.add("translate-y-full");
    menu.setAttribute("aria-hidden", "true");
    openBtn?.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    // collapse any expanded submenus so the menu reopens in a clean state
    menu.querySelectorAll(".mobile-acc.is-open").forEach((el) => el.classList.remove("is-open"));
  };

  openBtn?.addEventListener("click", open);
  document.getElementById("menu-close")?.addEventListener("click", close);

  // Submenu accordions (Solutions / Services) — one open at a time.
  menu.querySelectorAll<HTMLButtonElement>(".mobile-acc-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const acc = btn.closest(".mobile-acc");
      if (!acc) return;
      const willOpen = !acc.classList.contains("is-open");
      menu.querySelectorAll(".mobile-acc.is-open").forEach((el) => {
        if (el !== acc) el.classList.remove("is-open");
      });
      acc.classList.toggle("is-open", willOpen);
      btn.setAttribute("aria-expanded", String(willOpen));
    });
  });

  // Close after tapping a real navigation link.
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));

  if (!escBound) {
    escBound = true;
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      const m = document.getElementById("mobile-menu");
      if (!m || m.classList.contains("translate-y-full")) return;
      m.classList.add("translate-y-full");
      m.setAttribute("aria-hidden", "true");
      document.getElementById("menu-open")?.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  }
}
