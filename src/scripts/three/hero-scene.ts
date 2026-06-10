/**
 * Hero scene — "The Route"
 * ------------------------
 * A wireframe icosahedron sculpture with gold vertex nodes and two
 * tilted orbit rings, each carrying a travelling gold node (the brand's
 * "route" idea). Rotates with scroll, tilts toward the pointer, and
 * floats gently on idle.
 */
import * as THREE from "three";
import { themeColors, type SceneContext, type SceneUpdate } from "./scene-base";

/** Icosahedron position buffers repeat shared corners — dedupe for clean node points. */
function uniqueVertices(geometry: THREE.BufferGeometry): Float32Array {
  const pos = geometry.getAttribute("position");
  const seen = new Set<string>();
  const out: number[] = [];
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const key = `${x.toFixed(3)},${y.toFixed(3)},${z.toFixed(3)}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push(x, y, z);
    }
  }
  return new Float32Array(out);
}

export function buildHeroScene({ scene, camera, canvas }: SceneContext): SceneUpdate {
  camera.position.z = 7;
  const { ink, gold } = themeColors(canvas);

  const group = new THREE.Group();
  scene.add(group);

  const lineMaterial = new THREE.LineBasicMaterial({ color: ink, transparent: true, opacity: 0.2 });
  const goldMaterial = new THREE.MeshBasicMaterial({ color: gold });

  // Outer lattice + counter-rotating inner core
  const outerGeometry = new THREE.IcosahedronGeometry(1.85, 1);
  const outer = new THREE.LineSegments(new THREE.WireframeGeometry(outerGeometry), lineMaterial);
  const inner = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(0.9, 0)),
    new THREE.LineBasicMaterial({ color: ink, transparent: true, opacity: 0.32 }),
  );
  group.add(outer, inner);

  // Gold nodes pinned to the lattice corners
  const nodesGeometry = new THREE.BufferGeometry();
  nodesGeometry.setAttribute("position", new THREE.BufferAttribute(uniqueVertices(outerGeometry), 3));
  group.add(
    new THREE.Points(
      nodesGeometry,
      new THREE.PointsMaterial({ color: gold, size: 0.06, sizeAttenuation: true }),
    ),
  );

  // Smoothed pointer state
  let mx = 0;
  let my = 0;

  return ({ time, scrollY, mouse }) => {
    mx += (mouse.x - mx) * 0.04;
    my += (mouse.y - my) * 0.04;

    const scrollTurn = scrollY * 0.0012;
    group.rotation.y = time * 0.14 + scrollTurn + mx * 0.2;
    group.rotation.x = Math.sin(time * 0.18) * 0.1 + scrollTurn * 0.5 + my * 0.14;
    group.position.y = Math.sin(time * 0.6) * 0.08 + scrollY * 0.0006;

    inner.rotation.y = -time * 0.32 - scrollTurn * 1.6;
    inner.rotation.z = time * 0.18;
  };
}
