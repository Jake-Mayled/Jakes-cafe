/** The experience blade-sign pole out front-right of the cafe. */
import { useMemo } from 'react';
import type { ReactElement } from 'react';
import { standardMat as M } from '../helpers';
import { paintStreetSign } from '../painters';
import { TwoSidedSign } from './TwoSidedSign';

const JOBS: readonly string[] = ['JUNIOR DEV @ OPTIWEIGH', 'FOUNDER @ JBM WEB'];

export function ExperiencePole(): ReactElement {
  const poleMat = useMemo(() => M({ color: 0x5a6058, roughness: 0.5, metalness: 0.5 }), []);

  return (
    <group position={[6.6, 0.08, 2.5]} rotation={[0, 0.15, 0]}>
      <mesh position={[0, 1.85, 0]} material={poleMat} castShadow>
        <cylinderGeometry args={[0.05, 0.06, 3.7, 10]} />
      </mesh>
      {JOBS.map((text, i) => (
        <TwoSidedSign
          key={text}
          width={2.15}
          height={0.38}
          castShadow
          position={[0, 3.42 - i * 0.46, 0.07]}
          rotationY={i % 2 ? -0.06 : 0.05}
          paintFront={(c, w, h) => {
            paintStreetSign(c, w, h, text);
          }}
        />
      ))}
    </group>
  );
}
