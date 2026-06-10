/**
 * Background video controller
 * Ensures videos with `[data-speed]` autoplay muted with correct playback rate.
 */

export function initVideos(): void {
  document.querySelectorAll<HTMLVideoElement>("video").forEach((v) => {
    // 1. Explicitly set muted & playsinline properties/attributes (critical for iOS/macOS Safari)
    v.muted = true;
    v.setAttribute("muted", "");
    v.playsInline = true;
    v.setAttribute("playsinline", "");

    // 2. Apply custom playback rate if data-speed is present
    if (v.dataset.speed) {
      const speed = Number(v.dataset.speed) || 1;
      const apply = () => {
        v.playbackRate = speed;
      };
      apply();
      v.removeEventListener("loadedmetadata", apply);
      v.addEventListener("loadedmetadata", apply);
    }

    // 3. Programmatic playback trigger to bypass Safari ViewTransition autoplay blocks
    const play = () => {
      v.play().catch((err) => {
        console.warn("Safari autoplay prevented for video:", v.src || v.querySelector("source")?.src, err);
      });
    };

    if (v.readyState >= 2) {
      play();
    } else {
      v.removeEventListener("canplay", play);
      v.addEventListener("canplay", play, { once: true });
    }
  });
}
