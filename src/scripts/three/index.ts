/**
 * Three.js scene orchestrator
 * ---------------------------
 * Finds every `canvas[data-three-scene]` on the page and boots the matching
 * scene builder. This module is dynamically imported (see scripts/index.ts)
 * so Three.js never lands in the main bundle on pages without 3D.
 */
import { createScene, type SceneHandle, type SceneContext, type SceneUpdate } from "./scene-base";
import { buildHeroScene } from "./hero-scene";
import { buildCtaScene } from "./cta-scene";

const builders: Record<string, (ctx: SceneContext) => SceneUpdate> = {
  hero: buildHeroScene,
  cta: buildCtaScene,
};

let handles: SceneHandle[] = [];

export function initThreeScenes(): void {
  destroyThreeScenes();

  const canvases = document.querySelectorAll<HTMLCanvasElement>("canvas[data-three-scene]");
  for (const canvas of canvases) {
    const builder = builders[canvas.dataset.threeScene ?? ""];
    if (!builder) continue;
    // Scene canvases are display:none on small screens — don't burn a WebGL
    // context (and a NaN camera aspect) on a canvas with no layout size.
    if (canvas.clientWidth === 0 || canvas.clientHeight === 0) continue;
    try {
      handles.push(createScene(canvas, builder));
    } catch {
      // WebGL unavailable (old GPU, headless, blocked) — the canvas simply
      // stays transparent and the page works exactly as before.
    }
  }
}

export function destroyThreeScenes(): void {
  handles.forEach((handle) => handle.destroy());
  handles = [];
}

// Tear down renderers before Astro swaps the page so GPU contexts are freed.
document.addEventListener("astro:before-swap", destroyThreeScenes);
