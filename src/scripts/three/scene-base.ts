/**
 * Three.js scene plumbing
 * -----------------------
 * Shared renderer/camera/loop wiring for every 3D scene on the site.
 * Scene builders only describe geometry and a per-frame update —
 * resize, mouse tracking, scroll, visibility pausing, reduced-motion
 * and disposal are all handled here.
 */
import * as THREE from "three";

export interface SceneContext {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  canvas: HTMLCanvasElement;
}

export interface FrameState {
  /** Seconds since the scene was created. */
  time: number;
  /** Current window scroll position in px. */
  scrollY: number;
  /** Pointer position normalized to -1..1 (viewport space). */
  mouse: { x: number; y: number };
}

export type SceneUpdate = (state: FrameState) => void;

export interface SceneHandle {
  destroy(): void;
}

/** Reads the design tokens off the canvas or <body> so scenes adapt to light/dark pages. */
export function themeColors(element?: HTMLElement): { ink: string; gold: string } {
  const styles = getComputedStyle(element || document.body);
  return {
    // `--color-white` is the current foreground (flips to near-black on light pages)
    ink: styles.getPropertyValue("--color-white").trim() || "#0a0a0a",
    gold: styles.getPropertyValue("--color-gold").trim() || "#c9a24b",
  };
}

export function createScene(
  canvas: HTMLCanvasElement,
  build: (ctx: SceneContext) => SceneUpdate,
): SceneHandle {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 7;

  const resize = () => {
    const host = canvas.parentElement;
    const width = host?.clientWidth || window.innerWidth;
    const height = host?.clientHeight || window.innerHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  resize();

  const mouse = { x: 0, y: 0 };
  const onMouseMove = (e: MouseEvent) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
  };

  const update = build({ scene, camera, canvas });

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const start = performance.now();
  let visible = true;
  let frameId = 0;

  const renderFrame = () => {
    update({
      time: (performance.now() - start) / 1000,
      scrollY: window.scrollY,
      mouse,
    });
    renderer.render(scene, camera);
  };

  const loop = () => {
    frameId = requestAnimationFrame(loop);
    if (visible) renderFrame();
  };

  // Pause rendering entirely while the canvas is off-screen.
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  });
  observer.observe(canvas);

  window.addEventListener("resize", resize);

  if (reduceMotion) {
    // Single static frame — the sculpture is still visible, just motionless.
    renderFrame();
  } else {
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    loop();
  }

  return {
    destroy() {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(material)) material.forEach((m) => m.dispose());
        else if (material) material.dispose();
      });
      renderer.dispose();
    },
  };
}
