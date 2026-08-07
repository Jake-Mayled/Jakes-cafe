/**
 * The cafe's interior: counter, coffee machine, grinder + cups, back shelf
 * with jars, tables + stools, kitchen, fridge, framed prints, pendant lights.
 */
import { useMemo } from 'react';
import type { ReactElement } from 'react';
import { standardMat as M } from '../helpers';
import { paintPoster } from '../painters';
import { makeTexture } from '../textures';

const TABLES: readonly [x: number, z: number][] = [
  [-1.7, -3.1],
  [0.9, -3.6],
];

const STOOLS: readonly [x: number, z: number][] = [
  [-2.3, -2.7],
  [-1.1, -3.5],
  [0.3, -3.2],
  [1.5, -3.3],
];

const GRINDER_HEADS: readonly number[] = [-0.16, 0.08];

const CUPS: readonly [x: number, liftLast: number][] = [
  [4.0, 0],
  [4.16, 0],
  [4.08, 0.05],
];

const JAR_COLORS: readonly number[] = [0xa2542f, 0xc8a24a, 0x365a4c, 0xe8dcc4, 0x2e4a5c];

const PRINT_SPECS: readonly [color: string, x: number, title: string, sub: string][] = [
  ['#2e4a5c', -2.4, 'GOOD\nCODE', 'ship it'],
  ['#a2542f', -1.5, 'LONG\nBLACK', 'est. 2026'],
];

const KITCHEN_KNOBS_X: readonly number[] = [2.5, 2.9];

const PENDANT_X: readonly number[] = [0.4, 3.4];

export function Interior(): ReactElement {
  const woodMat = useMemo(() => M({ color: 0x6a4a30, roughness: 0.75 }), []);
  const counterTopMat = useMemo(() => M({ color: 0xe8dcc4, roughness: 0.4 }), []);
  const machineDarkMat = useMemo(() => M({ color: 0x2e2320, roughness: 0.4, metalness: 0.3 }), []);
  const brassMat = useMemo(() => M({ color: 0xc8a24a, metalness: 0.7, roughness: 0.3 }), []);
  const shelfMat = useMemo(() => M({ color: 0x8a6a4a, roughness: 0.7 }), []);
  const stoolTopMat = useMemo(() => M({ color: 0xc8a24a, roughness: 0.6 }), []);
  const legMat = useMemo(() => M({ color: 0x2e3a36, metalness: 0.5, roughness: 0.4 }), []);
  const kitchenBaseMat = useMemo(() => M({ color: 0x9a9a96, roughness: 0.45, metalness: 0.5 }), []);
  const kitchenTopMat = useMemo(() => M({ color: 0x2e2320, roughness: 0.6 }), []);
  const knobMat = useMemo(() => M({ color: 0x1a1512, roughness: 0.5 }), []);
  const rangeHoodMat = useMemo(() => M({ color: 0x8a8a86, roughness: 0.5, metalness: 0.5 }), []);
  const tapMat = useMemo(() => M({ color: 0xc8c8c4, metalness: 0.7, roughness: 0.3 }), []);
  const fridgeMat = useMemo(() => M({ color: 0xd8d8d4, roughness: 0.4, metalness: 0.3 }), []);
  const fridgeHandleMat = useMemo(() => M({ color: 0x8a8a86, metalness: 0.6, roughness: 0.3 }), []);
  const pendantWireMat = useMemo(() => M({ color: 0x1f1a17 }), []);

  const prints = useMemo(
    () =>
      PRINT_SPECS.map(([color, x, title, sub]) => ({
        x,
        texture: makeTexture(128, 170, (c, w, h) => {
          paintPoster(c, w, h, color, '#f3e6cf', title, sub);
        }),
      })),
    [],
  );

  return (
    <>
      {/* counter behind servery window */}
      <mesh position={[2.7, 0.63, -0.75]} material={woodMat} castShadow receiveShadow>
        <boxGeometry args={[4.4, 0.86, 0.55]} />
      </mesh>
      <mesh position={[2.7, 1.09, -0.75]} material={counterTopMat} castShadow receiveShadow>
        <boxGeometry args={[4.6, 0.06, 0.7]} />
      </mesh>

      {/* coffee machine */}
      <group position={[1.7, 1.12, -0.78]} rotation={[0, Math.PI, 0]}>
        <mesh position={[0, 0.17, 0]} material={machineDarkMat} castShadow>
          <boxGeometry args={[0.6, 0.34, 0.4]} />
        </mesh>
        <mesh position={[0, 0.375, 0]} material={brassMat} castShadow>
          <boxGeometry args={[0.64, 0.07, 0.44]} />
        </mesh>
        {GRINDER_HEADS.map((px) => (
          <mesh
            key={px}
            position={[px, 0.1, 0.21]}
            rotation={[Math.PI / 2, 0, 0]}
            material={brassMat}
            castShadow
          >
            <cylinderGeometry args={[0.028, 0.028, 0.09, 8]} />
          </mesh>
        ))}
      </group>

      {/* grinder + cups */}
      <mesh position={[3.4, 1.27, -0.8]} castShadow receiveShadow>
        <cylinderGeometry args={[0.07, 0.09, 0.3, 10]} />
        <meshStandardMaterial color={0x4a4442} roughness={0.5} />
      </mesh>
      <mesh position={[3.4, 1.49, -0.8]} castShadow receiveShadow>
        <cylinderGeometry args={[0.09, 0.06, 0.14, 10]} />
        <meshStandardMaterial
          color={0x8a8a86}
          roughness={0.3}
          metalness={0.4}
          transparent
          opacity={0.8}
        />
      </mesh>
      {CUPS.map(([x, lift]) => (
        <mesh key={x} position={[x, 1.15 + lift, -0.78]} castShadow receiveShadow>
          <cylinderGeometry args={[0.04, 0.032, 0.05, 10]} />
          <meshStandardMaterial color={0xf3efe4} roughness={0.4} />
        </mesh>
      ))}

      {/* back shelf with jars */}
      <mesh position={[1.4, 2.3, -4.5]} material={shelfMat} castShadow receiveShadow>
        <boxGeometry args={[2.6, 0.05, 0.32]} />
      </mesh>
      {JAR_COLORS.map((color, i) => (
        <mesh key={color} position={[0.5 + i * 0.45, 2.42, -4.5]} castShadow receiveShadow>
          <cylinderGeometry args={[0.07, 0.07, 0.18, 8]} />
          <meshStandardMaterial color={color} roughness={0.5} />
        </mesh>
      ))}

      {/* inside tables + stools */}
      {TABLES.map(([tx, tz]) => (
        <group key={`${tx}-${tz}`}>
          <mesh position={[tx, 0.95, tz]} material={shelfMat} castShadow receiveShadow>
            <cylinderGeometry args={[0.38, 0.38, 0.035, 18]} />
          </mesh>
          <mesh position={[tx, 0.6, tz]} castShadow receiveShadow>
            <cylinderGeometry args={[0.035, 0.05, 0.7, 10]} />
            <meshStandardMaterial color={0x2e3a36} metalness={0.5} roughness={0.4} />
          </mesh>
        </group>
      ))}
      {STOOLS.map(([x, z]) => (
        <group key={`${x}-${z}`}>
          <mesh position={[x, 0.72, z]} material={stoolTopMat} castShadow receiveShadow>
            <cylinderGeometry args={[0.16, 0.16, 0.06, 12]} />
          </mesh>
          <mesh position={[x, 0.48, z]} material={legMat} castShadow receiveShadow>
            <cylinderGeometry args={[0.025, 0.035, 0.45, 8]} />
          </mesh>
        </group>
      ))}

      {/* kitchen along the back wall */}
      <mesh position={[3.4, 0.62, -4.45]} material={kitchenBaseMat} castShadow receiveShadow>
        <boxGeometry args={[2.6, 0.85, 0.6]} />
      </mesh>
      <mesh position={[2.7, 1.08, -4.45]} material={kitchenTopMat} castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.05, 0.5]} />
      </mesh>
      {KITCHEN_KNOBS_X.map((x) => (
        <mesh key={x} position={[x, 1.11, -4.45]} material={knobMat} receiveShadow>
          <cylinderGeometry args={[0.11, 0.11, 0.02, 12]} />
        </mesh>
      ))}
      <mesh position={[2.7, 3.1, -4.55]} material={rangeHoodMat} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.5, 0.5]} />
      </mesh>
      <mesh position={[2.7, 4.2, -4.55]} material={rangeHoodMat} castShadow receiveShadow>
        <cylinderGeometry args={[0.14, 0.14, 1.7, 10]} />
      </mesh>
      <mesh position={[4.2, 1.17, -4.6]} material={tapMat} castShadow receiveShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.26, 8]} />
      </mesh>

      {/* fridge */}
      <mesh position={[4.7, 1.06, -4.4]} material={fridgeMat} castShadow receiveShadow>
        <boxGeometry args={[0.85, 1.95, 0.7]} />
      </mesh>
      <mesh position={[4.32, 1.3, -4.0]} material={fridgeHandleMat} castShadow receiveShadow>
        <boxGeometry args={[0.05, 0.7, 0.05]} />
      </mesh>

      {/* framed prints on the back wall */}
      {prints.map(({ x, texture }) => (
        <mesh key={x} position={[x, 2.5, -4.68]}>
          <planeGeometry args={[0.62, 0.82]} />
          <meshStandardMaterial map={texture} roughness={0.85} />
        </mesh>
      ))}

      {/* pendant lights */}
      {PENDANT_X.map((x) => (
        <group key={x}>
          <mesh position={[x, 4.4, -1.8]} material={pendantWireMat} receiveShadow>
            <cylinderGeometry args={[0.012, 0.012, 1.2, 6]} />
          </mesh>
          <mesh position={[x, 3.78, -1.8]}>
            <sphereGeometry args={[0.09, 10, 8]} />
            <meshBasicMaterial color={0xffd9a0} />
          </mesh>
        </group>
      ))}
    </>
  );
}
