/**
 * Background video controller
 * Ensures videos with `[data-speed]` autoplay muted with correct playback rate.
 */

export function initVideos(): void {
  document.querySelectorAll<HTMLVideoElement>("video[data-speed]").forEach((v) => {
    const speed = Number(v.dataset.speed) || 1;
    const apply = () => {
      v.playbackRate = speed;
    };

    apply();
    v.addEventListener("loadedmetadata", apply);
    v.muted = true;

    const play = () => v.play().catch(() => {});
    if (v.readyState >= 2) play();
    else v.addEventListener("canplay", play, { once: true });
  });
}
