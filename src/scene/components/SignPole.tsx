/**
 * The corner street-sign pole: traffic-light head, crossing street blades,
 * and the five clickable arrow signs that navigate the portfolio. Exposes
 * the hittable `signEntries` up to `SceneContents` for raycasting and the
 * hover-scale animation.
 */
import { forwardRef, useImperativeHandle, useRef } from 'react';
import type { ReactElement } from 'react';
import * as THREE from 'three';
import type { SectionIndex } from '../../types';
import { standardMat as M } from '../helpers';
import { paintArrowSign, paintStreetSign } from '../painters';
import { TwoSidedSign } from './TwoSidedSign';

/** One raycast-hittable sign mesh and the section it navigates to. */
export interface SignEntry {
  readonly mesh: THREE.Object3D;
  readonly section: SectionIndex;
  /** Whole two-sided sign group (scaled on hover). */
  readonly sign: THREE.Group;
}

export interface SignPoleHandle {
  readonly signEntries: readonly SignEntry[];
}

interface ArrowSignSpec {
  readonly text: string;
  readonly section: SectionIndex;
  readonly bg: string;
  readonly fg: string;
  readonly dir: 1 | -1;
  readonly y: number;
  readonly ry: number;
}

const ARROW_SIGNS: readonly ArrowSignSpec[] = [
  { text: 'ABOUT', section: 1, bg: '#f3e6cf', fg: '#2e2320', dir: 1, y: 3.55, ry: 0.45 },
  { text: 'SKILLS', section: 2, bg: '#1c5c3c', fg: '#f3efe4', dir: -1, y: 3.15, ry: 0.75 },
  { text: 'PROJECTS', section: 3, bg: '#a2542f', fg: '#f3e6cf', dir: 1, y: 2.75, ry: 0.3 },
  { text: 'EXPERIENCE', section: 4, bg: '#c8a24a', fg: '#2e2320', dir: -1, y: 2.35, ry: 0.6 },
  { text: 'CONTACT', section: 5, bg: '#2e4a5c', fg: '#f3e6cf', dir: 1, y: 1.95, ry: 0.5 },
];

const BLADES: readonly [text: string, ry: number, y: number][] = [
  ['DEVELOPER LN', 0.35, 5.85],
  ['LONG BLACK ST', 0.35 + Math.PI / 2, 5.52],
];

const LAMPS: readonly [color: number, y: number, opacity: number][] = [
  [0xff4d3a, 0.3, 0.3],
  [0xffc93c, 0, 0.3],
  [0x4dd17a, -0.3, 1],
];

export const SignPole = forwardRef<SignPoleHandle>(function SignPole(_props, ref): ReactElement {
  const poleMat = useRef(M({ color: 0x22302b, roughness: 0.5, metalness: 0.5 })).current;
  const boxMat = useRef(M({ color: 0x1a1512, roughness: 0.6 })).current;
  const hoodMat = useRef(M({ color: 0x1a1512, roughness: 0.6, side: THREE.DoubleSide })).current;
  const entriesRef = useRef<SignEntry[]>([]);

  useImperativeHandle(ref, () => ({
    get signEntries(): readonly SignEntry[] {
      return entriesRef.current;
    },
  }));

  const registerArrowSign =
    (section: SectionIndex) => (group: THREE.Group, meshes: readonly THREE.Mesh[]) => {
      for (const mesh of meshes) {
        entriesRef.current.push({ mesh, section, sign: group });
      }
    };

  return (
    <group position={[-5.4, 0.08, 2.6]}>
      <mesh position={[0, 2.8, 0]} material={poleMat} castShadow>
        <cylinderGeometry args={[0.09, 0.11, 5.6, 12]} />
      </mesh>
      <mesh position={[0, 0.12, 0]} material={poleMat} castShadow>
        <cylinderGeometry args={[0.22, 0.28, 0.25, 12]} />
      </mesh>

      {/* traffic-light head (green lit) */}
      <group position={[0, 4.75, 0.22]} rotation={[0, 0.5, 0]}>
        <mesh material={boxMat} castShadow>
          <boxGeometry args={[0.34, 0.95, 0.26]} />
        </mesh>
        {LAMPS.map(([color, y, opacity]) => (
          <group key={color}>
            <mesh position={[0, y, 0.135]}>
              <circleGeometry args={[0.09, 16]} />
              <meshBasicMaterial color={color} transparent opacity={opacity} />
            </mesh>
            <mesh
              position={[0, y + 0.05, 0.16]}
              rotation={[Math.PI / 2 - 0.3, 0, 0]}
              material={hoodMat}
            >
              <cylinderGeometry args={[0.1, 0.11, 0.08, 12, 1, true]} />
            </mesh>
          </group>
        ))}
      </group>
      <pointLight
        color={0x4dd17a}
        intensity={0.9}
        distance={3}
        decay={2}
        position={[0, 4.4, 0.5]}
      />

      {/* crossing street blades, stacked (not intersecting) */}
      {BLADES.map(([text, ry, y]) => (
        <TwoSidedSign
          key={text}
          width={1.7}
          height={0.3}
          castShadow
          position={[0, y, 0]}
          rotationY={ry}
          paintFront={(c, w, h) => {
            paintStreetSign(c, w, h, text);
          }}
        />
      ))}

      {/* clickable arrow signs (readable from both sides) */}
      {ARROW_SIGNS.map(({ text, section, bg, fg, dir, y, ry }) => (
        <group key={text} position={[0, y, 0]} rotation={[0, ry, 0]}>
          <TwoSidedSign
            width={1.55}
            height={0.34}
            castShadow
            position={[dir * 0.72, 0, 0]}
            paintFront={(c, w, h) => {
              paintArrowSign(c, w, h, text, bg, fg, dir);
            }}
            paintBack={(c, w, h) => {
              paintArrowSign(c, w, h, text, bg, fg, dir === 1 ? -1 : 1);
            }}
            onReady={registerArrowSign(section)}
          />
        </group>
      ))}
    </group>
  );
});
