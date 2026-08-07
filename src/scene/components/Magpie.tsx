/** The magpie perched by the awning. Exposes the parts animated per frame. */
import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import type { ReactElement } from 'react';
import type * as THREE from 'three';
import { standardMat as M } from '../helpers';

export interface BirdParts {
  readonly group: THREE.Group;
  readonly head: THREE.Mesh;
  readonly beak: THREE.Mesh;
}

export interface MagpieHandle {
  readonly parts: BirdParts | null;
}

export const Magpie = forwardRef<MagpieHandle>(function Magpie(_props, ref): ReactElement {
  const black = useMemo(() => M({ color: 0x14151a, roughness: 0.55 }), []);
  const white = useMemo(() => M({ color: 0xe9e9e6, roughness: 0.6 }), []);
  const beakMat = useMemo(() => M({ color: 0x8a8a86, roughness: 0.5 }), []);

  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const beakRef = useRef<THREE.Mesh>(null);

  useImperativeHandle(ref, () => ({
    get parts(): BirdParts | null {
      const group = groupRef.current;
      const head = headRef.current;
      const beak = beakRef.current;
      if (!group || !head || !beak) return null;
      return { group, head, beak };
    },
  }));

  return (
    <group ref={groupRef} position={[2.6, 3.34, 1.9]} rotation={[0, -0.7, 0]}>
      <mesh material={black} scale={[1, 0.85, 1.5]} castShadow>
        <sphereGeometry args={[0.09, 14, 12]} />
      </mesh>
      <mesh material={white} position={[0, 0.05, -0.06]} scale={[0.9, 0.6, 0.9]} castShadow>
        <sphereGeometry args={[0.075, 12, 10]} />
      </mesh>
      <mesh ref={headRef} material={black} position={[0, 0.1, 0.11]} castShadow>
        <sphereGeometry args={[0.055, 12, 10]} />
      </mesh>
      <mesh
        ref={beakRef}
        material={beakMat}
        position={[0, 0.1, 0.18]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      >
        <coneGeometry args={[0.018, 0.06, 8]} />
      </mesh>
      <mesh material={white} position={[0, 0.02, -0.18]} rotation={[-0.25, 0, 0]} castShadow>
        <boxGeometry args={[0.06, 0.02, 0.16]} />
      </mesh>
    </group>
  );
});
