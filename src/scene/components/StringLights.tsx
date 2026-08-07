/**
 * Catenary string lights between the cafe and the sign pole. Exposes the
 * bulb meshes up to `SceneContents` for the per-frame colour pulse.
 */
import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import type { ReactElement } from 'react';
import * as THREE from 'three';
import { extend } from '@react-three/fiber';

// `line` collides with the SVG intrinsic, so R3F's type-only `threeLine`
// tag needs its constructor registered explicitly at runtime.
extend({ ThreeLine: THREE.Line });

export type BulbMesh = THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;

export interface StringLightsHandle {
  readonly bulbs: readonly BulbMesh[];
}

const RUNS: readonly [THREE.Vector3, THREE.Vector3][] = [
  [new THREE.Vector3(-3.4, 5.15, 0.1), new THREE.Vector3(-5.4, 5.3, 2.6)],
  [new THREE.Vector3(-5.4, 5.3, 2.6), new THREE.Vector3(5.4, 5.15, 0.1)],
];
const SEGMENTS = 24;

function computeRunPoints(p0: THREE.Vector3, p1: THREE.Vector3): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= SEGMENTS; i++) {
    const f = i / SEGMENTS;
    const p = p0.clone().lerp(p1, f);
    p.y -= Math.sin(f * Math.PI) * 0.6;
    points.push(p);
  }
  return points;
}

export const StringLights = forwardRef<StringLightsHandle>(
  function StringLights(_props, ref): ReactElement {
    const runPoints = useMemo(() => RUNS.map(([p0, p1]) => computeRunPoints(p0, p1)), []);
    const lineGeometries = useMemo(
      () => runPoints.map((points) => new THREE.BufferGeometry().setFromPoints(points)),
      [runPoints],
    );
    const bulbGeometry = useMemo(() => new THREE.SphereGeometry(0.035, 8, 8), []);
    const bulbPositions = useMemo(
      () =>
        runPoints.flatMap((points) => {
          const positions: THREE.Vector3[] = [];
          for (let i = 1; i < SEGMENTS; i += 2) {
            const point = points[i];
            if (!point) continue;
            positions.push(new THREE.Vector3(point.x, point.y - 0.055, point.z));
          }
          return positions;
        }),
      [runPoints],
    );

    const bulbsRef = useRef<BulbMesh[]>([]);
    useImperativeHandle(ref, () => ({
      get bulbs(): readonly BulbMesh[] {
        return bulbsRef.current;
      },
    }));

    return (
      <>
        {lineGeometries.map((geometry, i) => (
          <threeLine key={i} geometry={geometry}>
            <lineBasicMaterial color={0x3a2d26} />
          </threeLine>
        ))}
        {bulbPositions.map((pos, i) => (
          <mesh
            key={i}
            ref={(mesh): void => {
              if (mesh) bulbsRef.current[i] = mesh as BulbMesh;
            }}
            position={[pos.x, pos.y, pos.z]}
            geometry={bulbGeometry}
          >
            <meshBasicMaterial color={0xffd9a0} />
          </mesh>
        ))}
      </>
    );
  },
);
