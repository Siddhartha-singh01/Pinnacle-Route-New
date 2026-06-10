/**
 * Accordion ("What we do")
 * ------------------------
 * Opens one panel at a time. Targets the #wwd container.
 * Supports scroll-based automatic item activation with scroll-locking on desktop devices.
 */

export function initAccordion(): void {
  const root = document.getElementById("wwd");
  if (!root) return;

  const items = Array.from(root.querySelectorAll<HTMLElement>(".wwd-item"));
  const section = document.querySelector<HTMLElement>(".wwd-scroll-section");
  if (!section) return;

  const openItem = (target: HTMLElement) => {
    items.forEach((it) => {
      const panel = it.querySelector<HTMLElement>(".wwd-panel");
      const head = it.querySelector<HTMLElement>(".wwd-head");
      if (!panel) return;

      const isOpen = it === target;
      it.classList.toggle("is-open", isOpen);
      head?.setAttribute("aria-expanded", String(isOpen));
      panel.style.maxHeight = isOpen ? panel.scrollHeight + "px" : "0px";
    });
  };

  // Open the first item by default
  if (items[0]) openItem(items[0]);

  // Click handler
  items.forEach((it) => {
    const head = it.querySelector(".wwd-head");
    head?.addEventListener("click", () => {
      openItem(it);
    });
  });

  // State variables for scroll-hijacking
  let isLocked = false;
  let activeIndex = 0;
  let lastTransitionTime = 0;
  const transitionCooldown = 450; // ms between item changes
  let isBypassed = false;
  let bypassTimeout: number | null = null;
  let lastRectTop = section.getBoundingClientRect().top;

  const lockScroll = (scrollingDown: boolean) => {
    if (isLocked || isBypassed) return;
    isLocked = true;

    // Pause smooth scrolling library
    const lenis = (window as any).__lenis;
    if (lenis) lenis.stop();

    // Reset index based on scroll direction
    activeIndex = scrollingDown ? 0 : items.length - 1;
    openItem(items[activeIndex]);

    // Align section exactly with the top of the viewport
    const targetScroll = section.offsetTop;
    if (lenis) {
      lenis.scrollTo(targetScroll, { duration: 0.4, immediate: false });
    } else {
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    }

    // Bind event listeners with preventDefault to block native scrolls
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
  };

  const unlockScroll = (scrollingDown: boolean) => {
    if (!isLocked) return;
    isLocked = false;

    const lenis = (window as any).__lenis;
    if (lenis) lenis.start();

    window.removeEventListener("wheel", handleWheel);
    window.removeEventListener("touchmove", handleTouchMove);

    // Bypass locking momentarily so the user can scroll past the trigger
    isBypassed = true;
    if (bypassTimeout) clearTimeout(bypassTimeout);
    bypassTimeout = window.setTimeout(() => {
      isBypassed = false;
    }, 800);

    // Scroll slightly past the lock point to avoid re-triggering
    const scrollOffset = scrollingDown ? 50 : -50;
    if (lenis) {
      lenis.scrollTo(window.scrollY + scrollOffset, { duration: 0.3 });
    } else {
      window.scrollBy({ top: scrollOffset, behavior: "smooth" });
    }
  };

  const handleWheel = (e: WheelEvent) => {
    if (!isLocked) return;
    e.preventDefault(); // Hijack event

    const now = Date.now();
    if (now - lastTransitionTime < transitionCooldown) return;

    if (e.deltaY > 0) {
      // Scroll down
      if (activeIndex < items.length - 1) {
        activeIndex++;
        openItem(items[activeIndex]);
        lastTransitionTime = now;
      } else {
        unlockScroll(true);
      }
    } else if (e.deltaY < 0) {
      // Scroll up
      if (activeIndex > 0) {
        activeIndex--;
        openItem(items[activeIndex]);
        lastTransitionTime = now;
      } else {
        unlockScroll(false);
      }
    }
  };

  let touchStartY = 0;
  const handleTouchStart = (e: TouchEvent) => {
    touchStartY = e.touches[0].clientY;
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isLocked) return;
    e.preventDefault(); // Hijack touch drag

    const now = Date.now();
    if (now - lastTransitionTime < transitionCooldown) return;

    const touchEndY = e.touches[0].clientY;
    const delta = touchStartY - touchEndY; // Positive is drag up (scroll down)

    if (Math.abs(delta) > 40) {
      if (delta > 0) {
        if (activeIndex < items.length - 1) {
          activeIndex++;
          openItem(items[activeIndex]);
          lastTransitionTime = now;
          touchStartY = touchEndY;
        } else {
          unlockScroll(true);
        }
      } else {
        if (activeIndex > 0) {
          activeIndex--;
          openItem(items[activeIndex]);
          lastTransitionTime = now;
          touchStartY = touchEndY;
        } else {
          unlockScroll(false);
        }
      }
    }
  };

  // Scroll listener to detect crossing the threshold
  const handleScroll = () => {
    if (window.innerWidth < 1024) return;
    
    const rect = section.getBoundingClientRect();
    const currentRectTop = rect.top;

    if (!isLocked && !isBypassed) {
      const crossedDown = lastRectTop > 10 && currentRectTop <= 10;
      const crossedUp = lastRectTop < -10 && currentRectTop >= -10;

      if (crossedDown) {
        lockScroll(true);
      } else if (crossedUp) {
        lockScroll(false);
      }
    }

    lastRectTop = currentRectTop;
  };

  // Clean up global references first
  const w = window as any;
  if (w.__wwdScrollHandler) {
    window.removeEventListener("scroll", w.__wwdScrollHandler);
  }
  if (w.__wwdWheelHandler) {
    window.removeEventListener("wheel", w.__wwdWheelHandler);
  }
  if (w.__wwdTouchMoveHandler) {
    window.removeEventListener("touchmove", w.__wwdTouchMoveHandler);
  }

  // Bind new listener
  w.__wwdScrollHandler = handleScroll;
  window.addEventListener("scroll", handleScroll, { passive: true });

  // Store wheel/touch move handlers on window so they can be cleaned up on swap
  w.__wwdWheelHandler = handleWheel;
  w.__wwdTouchMoveHandler = handleTouchMove;

  // Keep open panel sized correctly on resize
  window.addEventListener("resize", () => {
    const open = root.querySelector<HTMLElement>(".wwd-item.is-open .wwd-panel");
    if (open) open.style.maxHeight = open.scrollHeight + "px";
  });
}
