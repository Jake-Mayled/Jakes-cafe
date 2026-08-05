/**
 * A flat sign whose text reads correctly from both sides: two planes painted
 * separately, back-to-back with a tiny z offset. JSX counterpart of
 * `helpers.twoSidedSign`.
 */
import { useEffect, useMemo, useRef } from 'react';
import type { ReactElement } from 'react';
import type * as THREE from 'three';
import type { Painter } from '../textures';
import { makeTexture } from '../textures';

interface TwoSidedSignProps {
  readonly width: number;
  readonly height: number;
  readonly paintFront: Painter;
  readonly paintBack?: Painter;
  readonly castShadow?: boolean;
  readonly position?: readonly [number, number, number];
  readonly rotationY?: number;
  /** Fires once both faces have mounted, handing back the group and its two hittable meshes. */
  readonly onReady?: (group: THREE.Group, meshes: readonly THREE.Mesh[]) => void;
}

export function TwoSidedSign({
  width,
  height,
  paintFront,
  paintBack,
  castShadow = false,
  position = [0, 0, 0],
  rotationY = 0,
  onReady,
}: TwoSidedSignProps): ReactElement {
  const texHeight = Math.round((640 * height) / width);
  const frontTexture = useMemo(() => makeTexture(640, texHeight, paintFront), [texHeight, paintFront]);
  const backTexture = useMemo(
    () => makeTexture(640, texHeight, paintBack ?? paintFront),
    [texHeight, paintBack, paintFront],
  );

  const groupRef = useRef<THREE.Group>(null);
  const frontRef = useRef<THREE.Mesh>(null);
  const backRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    const group = groupRef.current;
    const front = frontRef.current;
    const back = backRef.current;
    if (group && front && back) onReady?.(group, [front, back]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <group ref={groupRef} position={position} rotation={[0, rotationY, 0]}>
      <mesh ref={frontRef} position={[0, 0, 0.006]} castShadow={castShadow}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={frontTexture} transparent />
      </mesh>
      <mesh ref={backRef} rotation={[0, Math.PI, 0]} position={[0, 0, -0.006]} castShadow={castShadow}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={backTexture} transparent />
      </mesh>
    </group>
  );
}
