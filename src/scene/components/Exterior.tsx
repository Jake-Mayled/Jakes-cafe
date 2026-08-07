/**
 * Everything outside the shell: fascia + awning, menu board, footpath
 * furniture, the "click & drag" A-frame, the left-wall mural / chalkboard /
 * neon, project posters, the back service area, the magpie, and the
 * experience blade-sign pole. Self-manages its reactive textures (fascia
 * name, neon colour) and exposes the magpie parts up for per-frame animation.
 */
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import type { ReactElement } from 'react';
import * as THREE from 'three';
import { standardMat as M } from '../helpers';
import {
  paintChalkboard,
  paintCorrugation,
  paintDragBoard,
  paintFascia,
  paintMenuBoard,
  paintMural,
  paintNeon,
  paintPoster,
} from '../painters';
import { DynamicTexture, makeTexture } from '../textures';
import { BackService } from './BackService';
import { ExperiencePole } from './ExperiencePole';
import { Magpie, type BirdParts, type MagpieHandle } from './Magpie';

export interface ExteriorHandle {
  readonly bird: BirdParts | null;
}

interface ExteriorProps {
  readonly cafeName: string;
  readonly neonColor: string;
}

const POSTS_X: readonly number[] = [-3.3, 5.1];

const CHAIRS: readonly [x: number, z: number, ry: number][] = [
  [3.15, 2.0, 0.6],
  [4.45, 2.5, -2.3],
];

const CHAIR_LEGS: readonly [x: number, z: number][] = [
  [-0.16, -0.16],
  [0.16, -0.16],
  [-0.16, 0.16],
  [0.16, 0.16],
];

const POSTERS: readonly [bg: string, fg: string, title: string, sub: string, z: number][] = [
  ['#2e4a5c', '#f3e6cf', 'AI JAVA\nEVALUATOR', 'automated marking', -0.985],
  ['#a2542f', '#f3e6cf', 'AOCA SMART\nAPP', 'cognitive health', -2.5],
  ['#3c5c3a', '#f3e6cf', 'MORE\nBREWING', 'coming soon', -4.015],
];

export const Exterior = forwardRef<ExteriorHandle, ExteriorProps>(function Exterior(
  { cafeName, neonColor },
  ref,
): ReactElement {
  const fasciaTexture = useMemo(
    () =>
      new DynamicTexture(1024, 256, (c, w, h) => {
        paintFascia(c, w, h, cafeName);
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const neonTexture = useMemo(
    () =>
      new DynamicTexture(1024, 320, (c, w, h) => {
        paintNeon(c, w, h, "say g'day", neonColor);
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    fasciaTexture.repaint((c, w, h) => {
      paintFascia(c, w, h, cafeName);
    });
  }, [fasciaTexture, cafeName]);

  useEffect(() => {
    neonTexture.repaint((c, w, h) => {
      paintNeon(c, w, h, "say g'day", neonColor);
    });
  }, [neonTexture, neonColor]);

  const corTexture = useMemo(() => {
    const tex = makeTexture(512, 128, paintCorrugation);
    tex.wrapS = THREE.RepeatWrapping;
    tex.repeat.set(4, 1);
    return tex;
  }, []);
  const postMat = useMemo(() => M({ color: 0x2e3a36, roughness: 0.5, metalness: 0.4 }), []);
  const menuTexture = useMemo(() => makeTexture(512, 680, paintMenuBoard), []);
  const chairMat = useMemo(() => M({ color: 0xc8a24a, roughness: 0.6 }), []);
  const chairLegMat = useMemo(() => M({ color: 0x2e3a36, metalness: 0.5, roughness: 0.4 }), []);
  const darkMat = useMemo(() => M({ color: 0x2a241e, roughness: 0.9 }), []);
  const dragFaceMat = useMemo(
    () => M({ map: makeTexture(320, 400, paintDragBoard), roughness: 0.9 }),
    [],
  );
  const dragFrontMats = useMemo(
    () => [darkMat, darkMat, darkMat, darkMat, dragFaceMat, darkMat],
    [darkMat, dragFaceMat],
  );
  const muralTexture = useMemo(() => makeTexture(512, 226, paintMural), []);
  const chalkTexture = useMemo(() => makeTexture(512, 480, paintChalkboard), []);
  const posters = useMemo(
    () =>
      POSTERS.map(([bg, fg, title, sub, z]) => ({
        title,
        z,
        texture: makeTexture(256, 340, (c, w, h) => {
          paintPoster(c, w, h, bg, fg, title, sub);
        }),
      })),
    [],
  );

  const birdRef = useRef<MagpieHandle>(null);
  useImperativeHandle(ref, () => ({
    get bird(): BirdParts | null {
      return birdRef.current?.parts ?? null;
    },
  }));

  return (
    <>
      {/* fascia + awning + posts (front) */}
      <mesh position={[0.9, 4.2, 0.02]} receiveShadow>
        <planeGeometry args={[8.2, 2.05]} />
        <meshStandardMaterial
          map={fasciaTexture.texture}
          roughness={0.7}
          emissive={0x332211}
          emissiveIntensity={0.4}
          emissiveMap={fasciaTexture.texture}
        />
      </mesh>
      <mesh position={[0.9, 3.2, 1.0]} rotation={[0.12, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[9.2, 0.08, 2.0]} />
        <meshStandardMaterial map={corTexture} roughness={0.6} metalness={0.35} />
      </mesh>
      <mesh position={[0.9, 3.0, 1.98]} receiveShadow>
        <boxGeometry args={[9.2, 0.28, 0.05]} />
        <meshStandardMaterial color={0xf3e6cf} roughness={0.8} />
      </mesh>
      {POSTS_X.map((x) => (
        <mesh key={x} position={[x, 1.48, 1.9]} material={postMat} castShadow receiveShadow>
          <cylinderGeometry args={[0.06, 0.06, 2.95, 10]} />
        </mesh>
      ))}

      {/* menu board leaning on the wall, right of the door (About) */}
      <mesh position={[-0.45, 0.78, 0.14]} rotation={[-0.14, -0.03, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.95, 1.3, 0.04]} />
        <meshStandardMaterial map={menuTexture} roughness={0.85} />
      </mesh>

      {/* footpath table + cup + chairs */}
      <mesh position={[3.8, 0.8, 2.2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.035, 20]} />
        <meshStandardMaterial color={0xe8e0cf} roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[3.8, 0.44, 2.2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.035, 0.05, 0.72, 10]} />
        <meshStandardMaterial color={0x2e3a36} metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[3.7, 0.85, 2.15]} castShadow receiveShadow>
        <cylinderGeometry args={[0.042, 0.033, 0.055, 14]} />
        <meshStandardMaterial color={0xf3efe4} roughness={0.4} />
      </mesh>
      {CHAIRS.map(([x, z, ry]) => (
        <group key={`${x}-${z}`} position={[x, 0.08, z]} rotation={[0, ry, 0]}>
          <mesh position={[0, 0.45, 0]} material={chairMat} castShadow>
            <boxGeometry args={[0.38, 0.04, 0.38]} />
          </mesh>
          <mesh position={[0, 0.66, -0.17]} material={chairMat} castShadow>
            <boxGeometry args={[0.38, 0.4, 0.04]} />
          </mesh>
          {CHAIR_LEGS.map(([lx, lz]) => (
            <mesh key={`${lx}-${lz}`} position={[lx, 0.22, lz]} material={chairLegMat}>
              <cylinderGeometry args={[0.017, 0.017, 0.45, 8]} />
            </mesh>
          ))}
        </group>
      ))}

      {/* "click & drag" A-frame board (tops joined, feet splayed) */}
      <group position={[-4.35, 0.08, 2.85]} rotation={[0, -0.23, 0]}>
        <mesh
          position={[0, 0.72, 0.19]}
          rotation={[-0.28, 0, 0]}
          material={dragFrontMats}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[1.05, 1.3, 0.05]} />
        </mesh>
        <mesh
          position={[0, 0.72, -0.19]}
          rotation={[0.28, 0, 0]}
          material={darkMat}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[1.05, 1.3, 0.05]} />
        </mesh>
        <mesh position={[0, 1.38, 0]} castShadow>
          <boxGeometry args={[1.05, 0.07, 0.14]} />
          <meshStandardMaterial color={0x5b4632} roughness={0.8} />
        </mesh>
      </group>

      {/* LEFT wall: mural, chalkboard (Skills), neon (Contact) */}
      <mesh position={[-3.52, 4.0, -2.5]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[3.4, 1.5]} />
        <meshStandardMaterial map={muralTexture} roughness={0.85} />
      </mesh>
      <mesh position={[-3.52, 1.75, -0.9]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[1.9, 1.8]} />
        <meshStandardMaterial map={chalkTexture} roughness={0.95} />
      </mesh>
      <mesh position={[-3.52, 2.05, -3.6]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[2.3, 1.05]} />
        <meshStandardMaterial color={0x1c1512} roughness={0.9} />
      </mesh>
      <mesh position={[-3.56, 2.05, -3.6]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[2.0, 0.62]} />
        <meshBasicMaterial map={neonTexture.texture} transparent />
      </mesh>
      <pointLight
        color={neonColor}
        intensity={2.0}
        distance={5}
        decay={2}
        position={[-4.2, 2.05, -3.6]}
      />
      <mesh position={[-3.75, 1.05, -3.6]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.08, 1.6]} />
        <meshStandardMaterial color={0x8a6a4a} roughness={0.7} />
      </mesh>
      <mesh position={[-4.6, 0.34, 0.9]} rotation={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.42, 0.36, 0.42]} />
        <meshStandardMaterial color={0x2e5aa8} roughness={0.8} />
      </mesh>

      {/* RIGHT wall: project posters */}
      {posters.map(({ title, z, texture }) => (
        <mesh key={title} position={[5.45, 2.3, z]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[1.1, 1.5]} />
          <meshStandardMaterial map={texture} roughness={0.85} />
        </mesh>
      ))}

      <BackService />
      <Magpie ref={birdRef} />
      <ExperiencePole />
    </>
  );
});
