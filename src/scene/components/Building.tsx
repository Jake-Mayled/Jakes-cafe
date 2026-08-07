/**
 * The cafe building: brick shell (x −3.5..5.5, z −5..0), frosted shopfront
 * glazing, hinged open door with neon OPEN sign, roof, and the full interior.
 * Self-manages the OPEN sign's reactive texture repaint.
 */
import { useEffect, useMemo } from 'react';
import type { ReactElement } from 'react';
import * as THREE from 'three';
import { standardMat as M } from '../helpers';
import { paintBrick, paintNeon, paintRoofIron } from '../painters';
import { DynamicTexture, makeTexture } from '../textures';
import { Interior } from './Interior';

interface BuildingProps {
  readonly neonColor: string;
}

const WALL_TRIM_Y: readonly number[] = [1.02, 3.58];
const WALL_TRIM_Z: readonly number[] = [-0.22, -1.75, -3.25, -4.78];
const WINDOW_TRIM_X: readonly number[] = [0.4, 5.0];

export function Building({ neonColor }: BuildingProps): ReactElement {
  const brickTexture = useMemo(() => {
    const tex = makeTexture(512, 512, paintBrick);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2.5, 1.6);
    return tex;
  }, []);
  const brickMat = useMemo(() => M({ map: brickTexture, roughness: 0.9 }), [brickTexture]);
  const plasterMat = useMemo(() => M({ color: 0xe8dcc4, roughness: 0.9 }), []);
  const wallTrimMat = useMemo(() => M({ color: 0x1f1a17, roughness: 0.6 }), []);
  const trimMat = useMemo(() => M({ color: 0x1f1a17, roughness: 0.6 }), []);
  const roofTexture = useMemo(() => {
    const tex = makeTexture(512, 128, paintRoofIron);
    tex.wrapS = THREE.RepeatWrapping;
    tex.repeat.set(3, 1);
    return tex;
  }, []);
  const roofMat = useMemo(
    () => M({ map: roofTexture, roughness: 0.55, metalness: 0.4 }),
    [roofTexture],
  );

  const openTexture = useMemo(
    () =>
      new DynamicTexture(512, 256, (c, w, h) => {
        paintNeon(c, w, h, 'open', neonColor);
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  useEffect(() => {
    openTexture.repaint((c, w, h) => {
      paintNeon(c, w, h, 'open', neonColor);
    });
  }, [openTexture, neonColor]);

  return (
    <>
      {/* floor */}
      <mesh position={[1, 0.2, -2.5]} receiveShadow>
        <boxGeometry args={[8.8, 0.14, 4.8]} />
        <meshStandardMaterial color={0x8a6a4a} roughness={0.8} />
      </mesh>
      {/* back wall */}
      <mesh position={[1, 2.5, -4.85]} material={brickMat} castShadow receiveShadow>
        <boxGeometry args={[9, 5, 0.3]} />
      </mesh>

      {/* right wall: full-width frosted shopfront glazing */}
      <mesh position={[5.35, 0.5, -2.5]} material={brickMat} castShadow receiveShadow>
        <boxGeometry args={[0.3, 1.0, 5]} />
      </mesh>
      <mesh position={[5.35, 4.3, -2.5]} material={brickMat} castShadow receiveShadow>
        <boxGeometry args={[0.3, 1.4, 5]} />
      </mesh>
      <mesh position={[5.35, 2.3, -2.5]} receiveShadow>
        <boxGeometry args={[0.08, 2.6, 4.6]} />
        <meshPhysicalMaterial
          color={0xdfe8e6}
          transparent
          opacity={0.55}
          roughness={0.55}
          metalness={0.05}
        />
      </mesh>
      {WALL_TRIM_Y.map((y) => (
        <mesh key={y} position={[5.35, y, -2.5]} material={wallTrimMat} receiveShadow>
          <boxGeometry args={[0.16, 0.1, 4.8]} />
        </mesh>
      ))}
      {WALL_TRIM_Z.map((z) => (
        <mesh key={z} position={[5.35, 2.3, z]} material={wallTrimMat} receiveShadow>
          <boxGeometry args={[0.16, 2.66, 0.1]} />
        </mesh>
      ))}

      {/* left wall */}
      <mesh position={[-3.35, 2.5, -2.5]} material={brickMat} castShadow receiveShadow>
        <boxGeometry args={[0.3, 5, 5]} />
      </mesh>

      {/* front wall pieces (door opening x −2.3..−0.9 h 2.5; window opening x 0.4..5.0, y 0.85..2.85) */}
      <mesh position={[-2.9, 2.5, -0.15]} material={brickMat} castShadow receiveShadow>
        <boxGeometry args={[1.2, 5, 0.3]} />
      </mesh>
      <mesh position={[-1.6, 3.75, -0.15]} material={brickMat} castShadow receiveShadow>
        <boxGeometry args={[1.4, 2.5, 0.3]} />
      </mesh>
      <mesh position={[-0.25, 2.5, -0.15]} material={brickMat} castShadow receiveShadow>
        <boxGeometry args={[1.3, 5, 0.3]} />
      </mesh>
      <mesh position={[2.7, 0.425, -0.15]} material={brickMat} castShadow receiveShadow>
        <boxGeometry args={[4.6, 0.85, 0.3]} />
      </mesh>
      <mesh position={[2.7, 3.925, -0.15]} material={brickMat} castShadow receiveShadow>
        <boxGeometry args={[4.6, 2.15, 0.3]} />
      </mesh>
      <mesh position={[5.25, 2.5, -0.15]} material={brickMat} castShadow receiveShadow>
        <boxGeometry args={[0.5, 5, 0.3]} />
      </mesh>

      {/* window + door trim */}
      <mesh position={[2.7, 0.9, -0.15]} material={trimMat} receiveShadow>
        <boxGeometry args={[4.8, 0.1, 0.36]} />
      </mesh>
      <mesh position={[2.7, 2.9, -0.15]} material={trimMat} receiveShadow>
        <boxGeometry args={[4.8, 0.1, 0.36]} />
      </mesh>
      {WINDOW_TRIM_X.map((x) => (
        <mesh key={x} position={[x, 1.9, -0.15]} material={trimMat} receiveShadow>
          <boxGeometry args={[0.1, 2.1, 0.36]} />
        </mesh>
      ))}

      {/* open door (hinged at x −2.3, swung inward) with neon OPEN sign */}
      <group position={[-2.28, 1.35, -0.05]} rotation={[0, 1.15, 0]}>
        <mesh position={[0.65, 0, 0]} castShadow>
          <boxGeometry args={[1.3, 2.45, 0.08]} />
          <meshStandardMaterial color={0x365a4c} roughness={0.55} />
        </mesh>
        <mesh position={[1.16, 0, 0.08]}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial color={0xc8a24a} metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0.65, 0.62, 0.06]}>
          <planeGeometry args={[0.78, 0.39]} />
          <meshBasicMaterial map={openTexture.texture} transparent side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* roof */}
      <mesh position={[1, 5.08, -2.5]} material={roofMat} castShadow receiveShadow>
        <boxGeometry args={[9.3, 0.12, 5.3]} />
      </mesh>
      <mesh position={[1, 5.25, -0.05]} material={plasterMat} castShadow receiveShadow>
        <boxGeometry args={[9.5, 0.28, 0.24]} />
      </mesh>
      <mesh position={[-3.55, 5.25, -2.5]} material={plasterMat} castShadow receiveShadow>
        <boxGeometry args={[0.24, 0.28, 5.5]} />
      </mesh>
      <mesh position={[5.55, 5.25, -2.5]} material={plasterMat} castShadow receiveShadow>
        <boxGeometry args={[0.24, 0.28, 5.5]} />
      </mesh>
      <mesh position={[3.6, 5.5, -3.6]} castShadow receiveShadow>
        <boxGeometry args={[1.3, 0.75, 1.0]} />
        <meshStandardMaterial color={0x8a8a86} roughness={0.6} metalness={0.5} />
      </mesh>
      <mesh position={[-1.4, 5.55, -4.2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.14, 0.14, 0.9, 10]} />
        <meshStandardMaterial color={0x6b6663} metalness={0.5} roughness={0.5} />
      </mesh>

      <Interior />
    </>
  );
}
