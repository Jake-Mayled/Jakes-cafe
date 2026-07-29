/** Catenary string lights between the cafe and the sign pole. */
import * as THREE from 'three';

export type BulbMesh = THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;

/** Bulb meshes whose colour pulses each frame. */
export function buildStringLights(scene: THREE.Scene): BulbMesh[] {
  const bulbs: BulbMesh[] = [];
  const runs: readonly [THREE.Vector3, THREE.Vector3][] = [
    [new THREE.Vector3(-3.4, 5.15, 0.1), new THREE.Vector3(-5.4, 5.3, 2.6)],
    [new THREE.Vector3(-5.4, 5.3, 2.6), new THREE.Vector3(5.4, 5.15, 0.1)],
  ];
  const bulbGeo = new THREE.SphereGeometry(0.035, 8, 8);
  runs.forEach(([p0, p1]) => {
    const points: THREE.Vector3[] = [];
    const segments = 24;
    for (let i = 0; i <= segments; i++) {
      const f = i / segments;
      const p = p0.clone().lerp(p1, f);
      p.y -= Math.sin(f * Math.PI) * 0.6;
      points.push(p);
    }
    scene.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineBasicMaterial({ color: 0x3a2d26 }),
      ),
    );
    for (let i = 1; i < segments; i += 2) {
      const point = points[i];
      if (!point) continue;
      const bulb = new THREE.Mesh(bulbGeo, new THREE.MeshBasicMaterial({ color: 0xffd9a0 }));
      bulb.position.copy(point);
      bulb.position.y -= 0.055;
      scene.add(bulb);
      bulbs.push(bulb);
    }
  });
  return bulbs;
}
