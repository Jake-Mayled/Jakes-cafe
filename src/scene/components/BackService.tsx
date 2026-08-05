/** The back service area: door + step, dumpster, power boxes, bin, crates. */
import { useMemo } from 'react';
import type { ReactElement } from 'react';
import { standardMat as M } from '../helpers';
import { paintDumpsterLabel } from '../painters';
import { makeTexture } from '../textures';

const CRATES: readonly [x: number, y: number, z: number, ry: number, color: number][] = [
  [4.0, 0.18, -5.55, 0.2, 0x2e5aa8],
  [4.0, 0.54, -5.55, -0.15, 0x2e5aa8],
  [4.55, 0.18, -5.45, 0.5, 0xa83232],
  [0.3, 0.18, -5.6, -0.3, 0xa83232],
];

export function BackService(): ReactElement {
  const conduitMat = useMemo(() => M({ color: 0x4d4a48, roughness: 0.5, metalness: 0.4 }), []);
  const labelTexture = useMemo(() => makeTexture(256, 142, paintDumpsterLabel), []);

  return (
    <>
      {/* service door + step */}
      <mesh position={[2.6, 1.23, -5.03]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 2.3, 0.08]} />
        <meshStandardMaterial color={0x4a4442} roughness={0.7} />
      </mesh>
      <mesh position={[2.6, 0.06, -5.35]} receiveShadow>
        <boxGeometry args={[1.5, 0.12, 0.7]} />
        <meshStandardMaterial color={0x9a8f7c} roughness={0.9} />
      </mesh>

      {/* industrial dumpster (blue body, red ribbed lid) */}
      <group position={[-1.1, 0, -5.75]} rotation={[0, 0.12, 0]}>
        <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.7, 0.95, 1.0]} />
          <meshStandardMaterial color={0x2e6ab0} roughness={0.55} metalness={0.3} />
        </mesh>
        {[-0.91, 0.91].map((x) => (
          <mesh key={x} position={[x, 0.55, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.12, 0.3, 0.5]} />
            <meshStandardMaterial color={0x24558c} roughness={0.55} metalness={0.3} />
          </mesh>
        ))}
        <group position={[0, 1.12, -0.04]} rotation={[-0.14, 0, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.74, 0.07, 1.06]} />
            <meshStandardMaterial color={0xc03a2e} roughness={0.6} />
          </mesh>
          {[-0.55, 0, 0.55].map((x) => (
            <mesh key={x} position={[x, 0.06, 0]} receiveShadow>
              <boxGeometry args={[0.08, 0.07, 1.06]} />
              <meshStandardMaterial color={0xa32d24} roughness={0.6} />
            </mesh>
          ))}
        </group>
        <mesh position={[0, 0.62, 0.51]} receiveShadow>
          <planeGeometry args={[0.72, 0.4]} />
          <meshStandardMaterial map={labelTexture} roughness={0.6} />
        </mesh>
      </group>

      {/* power boxes + conduit up the back wall */}
      <mesh position={[0.1, 1.5, -5.09]} castShadow receiveShadow>
        <boxGeometry args={[0.55, 0.75, 0.14]} />
        <meshStandardMaterial color={0x8a8a86} roughness={0.6} metalness={0.4} />
      </mesh>
      <mesh position={[0.78, 1.2, -5.08]} castShadow receiveShadow>
        <boxGeometry args={[0.35, 0.45, 0.12]} />
        <meshStandardMaterial color={0x6b6663} roughness={0.6} metalness={0.4} />
      </mesh>
      <mesh position={[0.1, 3.4, -5.06]} material={conduitMat} receiveShadow>
        <cylinderGeometry args={[0.022, 0.022, 3.0, 8]} />
      </mesh>
      <mesh position={[0.28, 3.0, -5.06]} material={conduitMat} receiveShadow>
        <cylinderGeometry args={[0.022, 0.022, 2.4, 8]} />
      </mesh>
      <mesh position={[1.2, 4.55, -5.06]} rotation={[0, 0, Math.PI / 2]} material={conduitMat} receiveShadow>
        <cylinderGeometry args={[0.022, 0.022, 2.2, 8]} />
      </mesh>

      {/* wheelie bin */}
      <group position={[1.2, 0, -5.5]} rotation={[0, 0.25, 0]}>
        <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.5, 0.72, 0.48]} />
          <meshStandardMaterial color={0x2e4a3c} roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.81, 0]} rotation={[-0.08, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.54, 0.07, 0.52]} />
          <meshStandardMaterial color={0x1c3328} roughness={0.6} />
        </mesh>
      </group>

      {/* milk crates out back */}
      {CRATES.map(([x, y, z, ry, color]) => (
        <mesh key={`${x}-${y}-${z}`} position={[x, y, z]} rotation={[0, ry, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.42, 0.36, 0.42]} />
          <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>
      ))}
    </>
  );
}
