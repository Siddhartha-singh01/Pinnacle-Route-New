/**
 * Intro preloader
 * ---------------
 * Black overlay with the brand logo. Plays once per real document load
 * (reload / first visit), holds a beat, then slides down to reveal the site.
 * Persisted across view transitions (see BaseLayout) so it never flashes
 * during in-site navigation.
 */
import gsap from "gsap";

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
    const preloadLogo = el.querySelector("img");
    const navLogo = document.querySelector('header#site-nav a[aria-label="Pinnacle Route home"] img');

    if (preloadLogo && navLogo) {
      // Clear CSS animation to get natural bounding box
      preloadLogo.style.animation = "none";
      preloadLogo.style.transform = "none";

      // Get natural rects
      const pRect = preloadLogo.getBoundingClientRect();
      const nRect = navLogo.getBoundingClientRect();
      
      const scaleX = nRect.width / pRect.width;
      const scaleY = nRect.height / pRect.height;
      
      const x = nRect.left - pRect.left;
      const y = nRect.top - pRect.top;

      // Animate the logo directly to the navbar logo position
      gsap.to(preloadLogo, {
        x: x,
        y: y,
        scaleX: scaleX,
        scaleY: scaleY,
        transformOrigin: "top left",
        opacity: 0,
        duration: 1.2,
        ease: "power3.inOut",
        onComplete: () => {
          el.style.display = "none";
          el.classList.add("is-done");
          root.classList.remove("preloading");
        }
      });

      // Fade out the preloader background perfectly in sync
      gsap.to(el, {
        backgroundColor: "rgba(10,10,10,0)",
        duration: 0.8,
        delay: 0.2, // Fade out as the logo starts shrinking and moving up
        ease: "power2.inOut"
      });

    } else {
      el.style.display = "none";
      el.classList.add("is-done");
      root.classList.remove("preloading");
    }
  };

  // Hold for a premium beat (logo animates in), then reveal.
  window.setTimeout(reveal, 1200);
}
