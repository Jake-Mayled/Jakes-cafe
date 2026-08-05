import * as THREE from 'three';

/** Shorthand for a MeshStandardMaterial. */
export function standardMat(
  params: THREE.MeshStandardMaterialParameters,
): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial(params);
}
