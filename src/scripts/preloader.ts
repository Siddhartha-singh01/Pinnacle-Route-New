/**
 * Intro preloader
 * ---------------
 * Black overlay with the brand logo. Plays once per real document load
 * (reload / first visit), holds a beat, then slides down to reveal the site.
 * Persisted across view transitions (see BaseLayout) so it never flashes
 * during in-site navigation.
 */
export function initPreloader(): void {
  const el = document.getElementById("preloader");
  if (!el) return;

  // Already played and persisted across a view transition — keep it hidden.
  if (el.classList.contains("is-done")) return;

  const root = document.documentElement;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.classList.add("is-done");
    return;
  }

  root.classList.add("preloading");

  const reveal = (): void => {
    el.classList.add("is-done");
    root.classList.remove("preloading");
  };

  // Hold for a premium beat (logo animates in), then reveal.
  window.setTimeout(reveal, 1200);
}
