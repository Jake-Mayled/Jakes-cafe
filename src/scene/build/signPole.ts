/**
 * The corner street-sign pole: traffic-light head, crossing street blades,
 * and the five clickable arrow signs that navigate the portfolio.
 */
import * as THREE from 'three';
import type { SectionIndex } from '../../types';
import { standardMat as M, twoSidedSign } from '../helpers';
import { paintArrowSign, paintStreetSign } from '../painters';

/** One raycast-hittable sign mesh and the section it navigates to. */
export interface SignEntry {
  readonly mesh: THREE.Object3D;
  readonly section: SectionIndex;
  /** Whole two-sided sign group (scaled on hover). */
  readonly sign: THREE.Group;
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

export function buildSignPole(scene: THREE.Scene): SignEntry[] {
  const group = new THREE.Group();
  const poleMat = M({ color: 0x22302b, roughness: 0.5, metalness: 0.5 });
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 5.6, 12), poleMat);
  pole.position.y = 2.8;
  pole.castShadow = true;
  group.add(pole);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.25, 12), poleMat);
  base.position.y = 0.12;
  base.castShadow = true;
  group.add(base);

  // traffic-light head (green lit)
  const head = new THREE.Group();
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(0.34, 0.95, 0.26),
    M({ color: 0x1a1512, roughness: 0.6 }),
  );
  box.castShadow = true;
  head.add(box);
  const lamps: readonly [number, number, number][] = [
    [0xff4d3a, 0.3, 0.3],
    [0xffc93c, 0, 0.3],
    [0x4dd17a, -0.3, 1],
  ];
  lamps.forEach(([color, y, opacity]) => {
    const lamp = new THREE.Mesh(
      new THREE.CircleGeometry(0.09, 16),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity }),
    );
    lamp.position.set(0, y, 0.135);
    head.add(lamp);
    const hood = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.11, 0.08, 12, 1, true),
      M({ color: 0x1a1512, roughness: 0.6, side: THREE.DoubleSide }),
    );
    hood.rotation.x = Math.PI / 2 - 0.3;
    hood.position.set(0, y + 0.05, 0.16);
    head.add(hood);
  });
  head.position.set(0, 4.75, 0.22);
  head.rotation.y = 0.5;
  group.add(head);
  const greenGlow = new THREE.PointLight(0x4dd17a, 0.9, 3, 2);
  greenGlow.position.set(0, 4.4, 0.5);
  group.add(greenGlow);

  // crossing street blades, stacked (not intersecting)
  const blades: readonly [string, number, number][] = [
    ['DEVELOPER LN', 0.35, 5.85],
    ['LONG BLACK ST', 0.35 + Math.PI / 2, 5.52],
  ];
  blades.forEach(([text, ry, y]) => {
    const sign = twoSidedSign(1.7, 0.3, (c, w, h) => {
      paintStreetSign(c, w, h, text);
    });
    sign.position.y = y;
    sign.rotation.y = ry;
    sign.children.forEach((m) => {
      m.castShadow = true;
    });
    group.add(sign);
  });

  // clickable arrow signs (readable from both sides)
  const entries: SignEntry[] = [];
  ARROW_SIGNS.forEach(({ text, section, bg, fg, dir, y, ry }) => {
    const sign = twoSidedSign(
      1.55,
      0.34,
      (c, w, h) => {
        paintArrowSign(c, w, h, text, bg, fg, dir);
      },
      (c, w, h) => {
        paintArrowSign(c, w, h, text, bg, fg, dir === 1 ? -1 : 1);
      },
    );
    const holder = new THREE.Group();
    holder.rotation.y = ry;
    holder.position.y = y;
    sign.position.set(dir * 0.72, 0, 0);
    sign.children.forEach((child) => {
      child.castShadow = true;
      entries.push({ mesh: child, section, sign });
    });
    holder.add(sign);
    group.add(holder);
  });

  group.position.set(-5.4, 0.08, 2.6);
  scene.add(group);
  return entries;
}
