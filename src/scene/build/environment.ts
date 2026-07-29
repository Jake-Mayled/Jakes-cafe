/** Sky dome, morning light rig, ground disc, roads, and footpaths. */
import * as THREE from 'three';
import { place, standardMat } from '../helpers';
import { paintGroundDisc, paintRoad, paintSky } from '../painters';
import { makeTexture } from '../textures';

export function addSky(scene: THREE.Scene): void {
  scene.add(
    new THREE.Mesh(
      new THREE.SphereGeometry(70, 24, 16),
      new THREE.MeshBasicMaterial({
        map: makeTexture(64, 512, paintSky),
        side: THREE.BackSide,
        fog: false,
      }),
    ),
  );
  const sunGlow = new THREE.Mesh(
    new THREE.CircleGeometry(7, 32),
    new THREE.MeshBasicMaterial({ color: 0xfff0c4, transparent: true, opacity: 0.95, fog: false }),
  );
  sunGlow.position.set(-34, 9, 52);
  sunGlow.lookAt(0, 2, 0);
  scene.add(sunGlow);
}

export function addLights(scene: THREE.Scene): void {
  scene.add(new THREE.HemisphereLight(0xbdd2e2, 0x94826c, 0.75));

  const sun = new THREE.DirectionalLight(0xffa04d, 2.8);
  sun.position.set(-16, 8, 20);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  const shadowCam = sun.shadow.camera;
  shadowCam.left = -16;
  shadowCam.right = 16;
  shadowCam.top = 14;
  shadowCam.bottom = -6;
  shadowCam.near = 1;
  shadowCam.far = 60;
  shadowCam.updateProjectionMatrix();
  scene.add(sun);

  const rim = new THREE.DirectionalLight(0x8fc4d4, 0.5);
  rim.position.set(14, 8, -14);
  scene.add(rim);

  const inside = new THREE.PointLight(0xffc98a, 1.8, 10, 1.6);
  inside.position.set(1, 2.9, -2.4);
  scene.add(inside);
}

export function addGround(scene: THREE.Scene): void {
  const disc = new THREE.Mesh(
    new THREE.CircleGeometry(30, 48),
    new THREE.MeshBasicMaterial({ map: makeTexture(1024, 1024, paintGroundDisc) }),
  );
  disc.rotation.x = -Math.PI / 2;
  disc.position.y = -0.02;
  scene.add(disc);

  const shadowCatcher = new THREE.Mesh(
    new THREE.CircleGeometry(22, 40),
    new THREE.ShadowMaterial({ opacity: 0.28 }),
  );
  shadowCatcher.rotation.x = -Math.PI / 2;
  shadowCatcher.receiveShadow = true;
  scene.add(shadowCatcher);

  const roadFront = new THREE.Mesh(
    new THREE.PlaneGeometry(36, 5),
    new THREE.MeshBasicMaterial({
      map: makeTexture(1024, 160, (c, w, h) => {
        paintRoad(c, w, h, false);
      }),
      transparent: true,
      depthWrite: false,
    }),
  );
  roadFront.rotation.x = -Math.PI / 2;
  roadFront.position.set(0, 0.012, 5.8);
  scene.add(roadFront);

  const roadSide = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 36),
    new THREE.MeshBasicMaterial({
      map: makeTexture(160, 1024, (c, w, h) => {
        paintRoad(c, w, h, true);
      }),
      transparent: true,
      depthWrite: false,
    }),
  );
  roadSide.rotation.x = -Math.PI / 2;
  roadSide.position.set(-9.0, 0.011, -2);
  scene.add(roadSide);

  const pathMat = standardMat({ color: 0xb9ac97, roughness: 0.95 });
  place(scene, new THREE.Mesh(new THREE.BoxGeometry(15, 0.16, 3.3), pathMat), 1.25, 0.08, 1.65, {
    castShadow: false,
  });
  place(scene, new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.16, 8.6), pathMat), -5.1, 0.08, -1.6, {
    castShadow: false,
  });
  const kerbMat = standardMat({ color: 0x9a8f7c });
  place(scene, new THREE.Mesh(new THREE.BoxGeometry(15, 0.2, 0.18), kerbMat), 1.25, 0.1, 3.35, {
    castShadow: false,
  });
  place(scene, new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.2, 8.6), kerbMat), -6.75, 0.1, -1.6, {
    castShadow: false,
  });
}
