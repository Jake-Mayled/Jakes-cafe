/** Sky dome, morning light rig, ground disc, roads, and footpaths. */
import { useEffect, useMemo, useRef } from 'react';
import type { ReactElement } from 'react';
import * as THREE from 'three';
import { standardMat } from '../helpers';
import { paintGroundDisc, paintRoad, paintSky } from '../painters';
import { makeTexture } from '../textures';

export function Environment(): ReactElement {
  const sunRef = useRef<THREE.DirectionalLight>(null);

  const skyTexture = useMemo(() => makeTexture(64, 512, paintSky), []);
  const groundTexture = useMemo(() => makeTexture(1024, 1024, paintGroundDisc), []);
  const roadFrontTexture = useMemo(
    () =>
      makeTexture(1024, 160, (c, w, h) => {
        paintRoad(c, w, h, false);
      }),
    [],
  );
  const roadSideTexture = useMemo(
    () =>
      makeTexture(160, 1024, (c, w, h) => {
        paintRoad(c, w, h, true);
      }),
    [],
  );

  const pathMat = useMemo(() => standardMat({ color: 0xb9ac97, roughness: 0.95 }), []);
  const kerbMat = useMemo(() => standardMat({ color: 0x9a8f7c }), []);

  // Shadow-camera frustum props aren't reactive on `DirectionalLightShadow` —
  // set them once and refresh the projection matrix, same as the original.
  useEffect(() => {
    const sun = sunRef.current;
    if (!sun) return;
    const shadowCam = sun.shadow.camera;
    shadowCam.left = -16;
    shadowCam.right = 16;
    shadowCam.top = 14;
    shadowCam.bottom = -6;
    shadowCam.near = 1;
    shadowCam.far = 60;
    shadowCam.updateProjectionMatrix();
  }, []);

  return (
    <>
      {/* sky dome + sun glow */}
      <mesh>
        <sphereGeometry args={[70, 24, 16]} />
        <meshBasicMaterial map={skyTexture} side={THREE.BackSide} fog={false} />
      </mesh>
      <mesh
        position={[-34, 9, 52]}
        onUpdate={(mesh): void => {
          mesh.lookAt(0, 2, 0);
        }}
      >
        <circleGeometry args={[7, 32]} />
        <meshBasicMaterial color={0xfff0c4} transparent opacity={0.95} fog={false} />
      </mesh>

      {/* lights */}
      <hemisphereLight color={0xbdd2e2} groundColor={0x94826c} intensity={0.75} />
      <directionalLight
        ref={sunRef}
        color={0xffa04d}
        intensity={2.8}
        position={[-16, 8, 20]}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight color={0x8fc4d4} intensity={0.5} position={[14, 8, -14]} />
      <pointLight
        color={0xffc98a}
        intensity={1.8}
        distance={10}
        decay={1.6}
        position={[1, 2.9, -2.4]}
      />

      {/* ground disc + shadow catcher */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <circleGeometry args={[30, 48]} />
        <meshBasicMaterial map={groundTexture} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[22, 40]} />
        <shadowMaterial opacity={0.28} />
      </mesh>

      {/* roads */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 5.8]}>
        <planeGeometry args={[36, 5]} />
        <meshBasicMaterial map={roadFrontTexture} transparent depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-9.0, 0.011, -2]}>
        <planeGeometry args={[5, 36]} />
        <meshBasicMaterial map={roadSideTexture} transparent depthWrite={false} />
      </mesh>

      {/* footpaths + kerbs */}
      <mesh position={[1.25, 0.08, 1.65]} material={pathMat} receiveShadow>
        <boxGeometry args={[15, 0.16, 3.3]} />
      </mesh>
      <mesh position={[-5.1, 0.08, -1.6]} material={pathMat} receiveShadow>
        <boxGeometry args={[3.2, 0.16, 8.6]} />
      </mesh>
      <mesh position={[1.25, 0.1, 3.35]} material={kerbMat} receiveShadow>
        <boxGeometry args={[15, 0.2, 0.18]} />
      </mesh>
      <mesh position={[-6.75, 0.1, -1.6]} material={kerbMat} receiveShadow>
        <boxGeometry args={[0.18, 0.2, 8.6]} />
      </mesh>
    </>
  );
}
