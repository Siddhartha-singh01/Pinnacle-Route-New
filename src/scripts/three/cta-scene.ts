/**
 * CTA scene — background torus knot
 * ---------------------------------
 * A large, very faint wireframe torus knot behind the closing CTA copy.
 * It slowly churns on idle and accelerates with scroll, sitting at the
 * same visual weight as the existing hairline arcs.
 */
import * as THREE from "three";
import { themeColors, type SceneContext, type SceneUpdate } from "./scene-base";

const KNOT_RADIUS = 1.55;
const KNOT_P = 2;
const KNOT_Q = 3;

/**
 * Point on the centre curve of a (p,q) torus knot — same formula
 * TorusKnotGeometry uses internally, so the traveller hugs the wireframe.
 */
function knotPoint(t: number, target: THREE.Vector3): THREE.Vector3 {
  const u = t * KNOT_P * Math.PI * 2;
  const quOverP = (KNOT_Q / KNOT_P) * u;
  const cs = Math.cos(quOverP);
  return target.set(
    KNOT_RADIUS * (2 + cs) * 0.5 * Math.cos(u),
    KNOT_RADIUS * (2 + cs) * 0.5 * Math.sin(u),
    KNOT_RADIUS * Math.sin(quOverP) * 0.5,
  );
}

export function buildCtaScene({ scene, camera, canvas }: SceneContext): SceneUpdate {
  camera.position.z = 6;
  const { ink, gold } = themeColors(canvas);

  const group = new THREE.Group();
  // Sit slightly right of the centred copy so the headline stays clean
  group.position.x = 1.4;
  scene.add(group);

  const knot = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.TorusKnotGeometry(KNOT_RADIUS, 0.42, 120, 16, KNOT_P, KNOT_Q)),
    new THREE.LineBasicMaterial({ color: ink, transparent: true, opacity: 0.05 }),
  );
  group.add(knot);

  // A single gold node travelling the knot's path keeps the brand accent alive
  const traveller = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 12, 12),
    new THREE.MeshBasicMaterial({ color: gold, transparent: true, opacity: 0.8 }),
  );
  group.add(traveller);
  const travelPoint = new THREE.Vector3();

  let mx = 0;

  return ({ time, scrollY, mouse }) => {
    mx += (mouse.x - mx) * 0.03;

    const scrollTurn = scrollY * 0.0006;
    group.rotation.y = time * 0.08 + scrollTurn + mx * 0.1;
    group.rotation.z = time * 0.04 + scrollTurn * 0.4;

    const t = (((time * 0.02 + scrollY * 0.00004) % 1) + 1) % 1;
    traveller.position.copy(knotPoint(t, travelPoint));
  };
}
