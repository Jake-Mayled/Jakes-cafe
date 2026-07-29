import * as THREE from 'three';
import { makeTexture, type Painter } from './textures';

export interface PlaceOptions {
  readonly rx?: number;
  readonly ry?: number;
  readonly rz?: number;
  /** Defaults to true. */
  readonly castShadow?: boolean;
}

/** Shorthand for a MeshStandardMaterial. */
export function standardMat(
  params: THREE.MeshStandardMaterialParameters,
): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial(params);
}

/** Position an object, apply rotations/shadow flags, and add it to the scene. */
export function place<T extends THREE.Object3D>(
  scene: THREE.Scene,
  object: T,
  x: number,
  y: number,
  z: number,
  options: PlaceOptions = {},
): T {
  object.position.set(x, y, z);
  if (options.ry !== undefined) object.rotation.y = options.ry;
  if (options.rx !== undefined) object.rotation.x = options.rx;
  if (options.rz !== undefined) object.rotation.z = options.rz;
  object.castShadow = options.castShadow !== false;
  object.receiveShadow = true;
  scene.add(object);
  return object;
}

/**
 * A flat sign whose text reads correctly from both sides: two planes painted
 * separately, back-to-back with a tiny z offset.
 */
export function twoSidedSign(
  width: number,
  height: number,
  paintFront: Painter,
  paintBack?: Painter,
): THREE.Group {
  const group = new THREE.Group();
  const texHeight = Math.round((640 * height) / width);
  [paintFront, paintBack ?? paintFront].forEach((painter, i) => {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      new THREE.MeshBasicMaterial({ map: makeTexture(640, texHeight, painter), transparent: true }),
    );
    if (i) mesh.rotation.y = Math.PI;
    mesh.position.z = i ? -0.006 : 0.006;
    group.add(mesh);
  });
  return group;
}
