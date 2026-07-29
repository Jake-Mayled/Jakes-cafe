/**
 * Everything outside the shell: fascia + awning, menu board, footpath
 * furniture, the "click & drag" A-frame, the left-wall mural / chalkboard /
 * neon, project posters, the back service area, the magpie, and the
 * experience blade-sign pole.
 */
import * as THREE from 'three';
import { place, standardMat as M, twoSidedSign } from '../helpers';
import {
  paintChalkboard,
  paintCorrugation,
  paintDragBoard,
  paintDumpsterLabel,
  paintFascia,
  paintMenuBoard,
  paintMural,
  paintNeon,
  paintPoster,
  paintStreetSign,
} from '../painters';
import { DynamicTexture, makeTexture } from '../textures';

export interface BirdHandles {
  readonly group: THREE.Group;
  readonly head: THREE.Mesh;
  readonly beak: THREE.Mesh;
}

export interface ExteriorHandles {
  readonly fasciaTexture: DynamicTexture;
  readonly neonTexture: DynamicTexture;
  readonly neonLight: THREE.PointLight;
  readonly bird: BirdHandles;
}

export function buildExterior(
  scene: THREE.Scene,
  cafeName: string,
  neonColor: string,
): ExteriorHandles {
  const add = <T extends THREE.Object3D>(
    obj: T,
    x: number,
    y: number,
    z: number,
    o: Parameters<typeof place>[5] = {},
  ): T => place(scene, obj, x, y, z, o);

  // fascia + awning + posts (front)
  const fasciaTexture = new DynamicTexture(1024, 256, (c, w, h) => {
    paintFascia(c, w, h, cafeName);
  });
  add(
    new THREE.Mesh(
      new THREE.PlaneGeometry(8.2, 2.05),
      M({
        map: fasciaTexture.texture,
        roughness: 0.7,
        emissive: 0x332211,
        emissiveIntensity: 0.4,
        emissiveMap: fasciaTexture.texture,
      }),
    ),
    0.9,
    4.2,
    0.02,
    { castShadow: false },
  );
  const corTex = makeTexture(512, 128, paintCorrugation);
  corTex.wrapS = THREE.RepeatWrapping;
  corTex.repeat.set(4, 1);
  add(
    new THREE.Mesh(
      new THREE.BoxGeometry(9.2, 0.08, 2.0),
      M({ map: corTex, roughness: 0.6, metalness: 0.35 }),
    ),
    0.9,
    3.2,
    1.0,
    { rx: 0.12 },
  );
  add(
    new THREE.Mesh(new THREE.BoxGeometry(9.2, 0.28, 0.05), M({ color: 0xf3e6cf, roughness: 0.8 })),
    0.9,
    3.0,
    1.98,
    { castShadow: false },
  );
  [-3.3, 5.1].forEach((x) => {
    add(
      new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 2.95, 10),
        M({ color: 0x2e3a36, roughness: 0.5, metalness: 0.4 }),
      ),
      x,
      1.48,
      1.9,
    );
  });

  // menu board leaning on the wall, right of the door (About)
  const menu = new THREE.Mesh(
    new THREE.BoxGeometry(0.95, 1.3, 0.04),
    M({ map: makeTexture(512, 680, paintMenuBoard), roughness: 0.85 }),
  );
  menu.position.set(-0.45, 0.78, 0.14);
  menu.rotation.x = -0.14;
  menu.rotation.y = -0.03;
  menu.castShadow = true;
  menu.receiveShadow = true;
  scene.add(menu);

  // footpath table + cup + chairs
  add(
    new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.4, 0.035, 20),
      M({ color: 0xe8e0cf, roughness: 0.4, metalness: 0.3 }),
    ),
    3.8,
    0.8,
    2.2,
  );
  add(
    new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.05, 0.72, 10),
      M({ color: 0x2e3a36, metalness: 0.5, roughness: 0.4 }),
    ),
    3.8,
    0.44,
    2.2,
  );
  add(
    new THREE.Mesh(
      new THREE.CylinderGeometry(0.042, 0.033, 0.055, 14),
      M({ color: 0xf3efe4, roughness: 0.4 }),
    ),
    3.7,
    0.85,
    2.15,
  );
  (
    [
      [3.15, 2.0, 0.6],
      [4.45, 2.5, -2.3],
    ] as const
  ).forEach(([x, z, ry]) => {
    const chair = new THREE.Group();
    const seat = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.04, 0.38),
      M({ color: 0xc8a24a, roughness: 0.6 }),
    );
    seat.position.y = 0.45;
    seat.castShadow = true;
    chair.add(seat);
    const backrest = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.4, 0.04),
      M({ color: 0xc8a24a, roughness: 0.6 }),
    );
    backrest.position.set(0, 0.66, -0.17);
    backrest.castShadow = true;
    chair.add(backrest);
    (
      [
        [-0.16, -0.16],
        [0.16, -0.16],
        [-0.16, 0.16],
        [0.16, 0.16],
      ] as const
    ).forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.017, 0.017, 0.45, 8),
        M({ color: 0x2e3a36, metalness: 0.5, roughness: 0.4 }),
      );
      leg.position.set(lx, 0.22, lz);
      chair.add(leg);
    });
    chair.position.set(x, 0.08, z);
    chair.rotation.y = ry;
    scene.add(chair);
  });

  // "click & drag" A-frame board (tops joined, feet splayed)
  const dragGroup = new THREE.Group();
  const darkMat = M({ color: 0x2a241e, roughness: 0.9 });
  const faceMat = M({ map: makeTexture(320, 400, paintDragBoard), roughness: 0.9 });
  // front board: text only on its outward (+z) face; back board fully blank
  const frontMats = [darkMat, darkMat, darkMat, darkMat, faceMat, darkMat];
  const frontBoard = new THREE.Mesh(new THREE.BoxGeometry(1.05, 1.3, 0.05), frontMats);
  frontBoard.position.set(0, 0.72, 0.19);
  frontBoard.rotation.x = -0.28;
  frontBoard.castShadow = true;
  frontBoard.receiveShadow = true;
  dragGroup.add(frontBoard);
  const backBoard = new THREE.Mesh(new THREE.BoxGeometry(1.05, 1.3, 0.05), darkMat);
  backBoard.position.set(0, 0.72, -0.19);
  backBoard.rotation.x = 0.28;
  backBoard.castShadow = true;
  backBoard.receiveShadow = true;
  dragGroup.add(backBoard);
  const hinge = new THREE.Mesh(
    new THREE.BoxGeometry(1.05, 0.07, 0.14),
    M({ color: 0x5b4632, roughness: 0.8 }),
  );
  hinge.position.y = 1.38;
  dragGroup.add(hinge);
  dragGroup.position.set(-4.35, 0.08, 2.85);
  dragGroup.rotation.y = -0.23;
  scene.add(dragGroup);

  // ---- LEFT wall: mural, chalkboard (Skills), neon (Contact) ----
  const mural = new THREE.Mesh(
    new THREE.PlaneGeometry(3.4, 1.5),
    M({ map: makeTexture(512, 226, paintMural), roughness: 0.85 }),
  );
  mural.position.set(-3.52, 4.0, -2.5);
  mural.rotation.y = -Math.PI / 2;
  scene.add(mural);

  const chalk = new THREE.Mesh(
    new THREE.PlaneGeometry(1.9, 1.8),
    M({ map: makeTexture(512, 480, paintChalkboard), roughness: 0.95 }),
  );
  chalk.position.set(-3.52, 1.75, -0.9);
  chalk.rotation.y = -Math.PI / 2;
  scene.add(chalk);

  const neonBack = new THREE.Mesh(
    new THREE.PlaneGeometry(2.3, 1.05),
    M({ color: 0x1c1512, roughness: 0.9 }),
  );
  neonBack.position.set(-3.52, 2.05, -3.6);
  neonBack.rotation.y = -Math.PI / 2;
  scene.add(neonBack);
  const neonTexture = new DynamicTexture(1024, 320, (c, w, h) => {
    paintNeon(c, w, h, "say g'day", neonColor);
  });
  const neon = new THREE.Mesh(
    new THREE.PlaneGeometry(2.0, 0.62),
    new THREE.MeshBasicMaterial({ map: neonTexture.texture, transparent: true }),
  );
  neon.position.set(-3.56, 2.05, -3.6);
  neon.rotation.y = -Math.PI / 2;
  scene.add(neon);
  const neonLight = new THREE.PointLight(neonColor, 2.0, 5, 2);
  neonLight.position.set(-4.2, 2.05, -3.6);
  scene.add(neonLight);
  add(
    new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 1.6), M({ color: 0x8a6a4a, roughness: 0.7 })),
    -3.75,
    1.05,
    -3.6,
  );
  add(
    new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.36, 0.42), M({ color: 0x2e5aa8, roughness: 0.8 })),
    -4.6,
    0.34,
    0.9,
    { ry: 0.3 },
  );

  // ---- RIGHT wall: project posters ----
  const posters: readonly [string, string, string, string][] = [
    ['#2e4a5c', '#f3e6cf', 'AI JAVA\nEVALUATOR', 'automated marking'],
    ['#a2542f', '#f3e6cf', 'DEMENTIA\nTESTER', 'cognitive care app'],
    ['#3c5c3a', '#f3e6cf', 'MORE\nBREWING', 'coming soon'],
  ];
  const posterZ = [-0.985, -2.5, -4.015] as const;
  posters.forEach(([bg, fg, title, sub], i) => {
    const poster = new THREE.Mesh(
      new THREE.PlaneGeometry(1.1, 1.5),
      M({
        map: makeTexture(256, 340, (c, w, h) => {
          paintPoster(c, w, h, bg, fg, title, sub);
        }),
        roughness: 0.85,
      }),
    );
    poster.position.set(5.45, 2.3, posterZ[i] ?? -2.5);
    poster.rotation.y = Math.PI / 2;
    scene.add(poster);
  });

  buildBackService(scene, add);
  const bird = buildMagpie(scene);
  buildExperiencePole(scene);

  return { fasciaTexture, neonTexture, neonLight, bird };
}

type Adder = <T extends THREE.Object3D>(
  obj: T,
  x: number,
  y: number,
  z: number,
  o?: Parameters<typeof place>[5],
) => T;

function buildBackService(scene: THREE.Scene, add: Adder): void {
  // service door + step
  add(
    new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.3, 0.08), M({ color: 0x4a4442, roughness: 0.7 })),
    2.6,
    1.23,
    -5.03,
  );
  add(
    new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.12, 0.7), M({ color: 0x9a8f7c, roughness: 0.9 })),
    2.6,
    0.06,
    -5.35,
    { castShadow: false },
  );

  // industrial dumpster (blue body, red ribbed lid)
  const dumpster = new THREE.Group();
  const dumpBody = new THREE.Mesh(
    new THREE.BoxGeometry(1.7, 0.95, 1.0),
    M({ color: 0x2e6ab0, roughness: 0.55, metalness: 0.3 }),
  );
  dumpBody.position.y = 0.6;
  dumpBody.castShadow = true;
  dumpster.add(dumpBody);
  [-0.91, 0.91].forEach((x) => {
    const pocket = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.3, 0.5),
      M({ color: 0x24558c, roughness: 0.55, metalness: 0.3 }),
    );
    pocket.position.set(x, 0.55, 0);
    pocket.castShadow = true;
    dumpster.add(pocket);
  });
  const lid = new THREE.Group();
  const lidTop = new THREE.Mesh(
    new THREE.BoxGeometry(1.74, 0.07, 1.06),
    M({ color: 0xc03a2e, roughness: 0.6 }),
  );
  lidTop.castShadow = true;
  lid.add(lidTop);
  [-0.55, 0, 0.55].forEach((x) => {
    const rib = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.07, 1.06),
      M({ color: 0xa32d24, roughness: 0.6 }),
    );
    rib.position.set(x, 0.06, 0);
    lid.add(rib);
  });
  lid.position.set(0, 1.12, -0.04);
  lid.rotation.x = -0.14;
  dumpster.add(lid);
  const label = new THREE.Mesh(
    new THREE.PlaneGeometry(0.72, 0.4),
    M({ map: makeTexture(256, 142, paintDumpsterLabel), roughness: 0.6 }),
  );
  label.position.set(0, 0.62, 0.51);
  dumpster.add(label);
  dumpster.position.set(-1.1, 0, -5.75);
  dumpster.rotation.y = 0.12;
  scene.add(dumpster);

  // power boxes + conduit up the back wall
  add(
    new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.75, 0.14),
      M({ color: 0x8a8a86, roughness: 0.6, metalness: 0.4 }),
    ),
    0.1,
    1.5,
    -5.09,
  );
  add(
    new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.45, 0.12),
      M({ color: 0x6b6663, roughness: 0.6, metalness: 0.4 }),
    ),
    0.78,
    1.2,
    -5.08,
  );
  const conduitMat = M({ color: 0x4d4a48, roughness: 0.5, metalness: 0.4 });
  add(
    new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 3.0, 8), conduitMat),
    0.1,
    3.4,
    -5.06,
    {
      castShadow: false,
    },
  );
  add(
    new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 2.4, 8), conduitMat),
    0.28,
    3.0,
    -5.06,
    {
      castShadow: false,
    },
  );
  add(
    new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 2.2, 8), conduitMat),
    1.2,
    4.55,
    -5.06,
    {
      castShadow: false,
      rz: Math.PI / 2,
    },
  );

  // wheelie bin
  const bin = new THREE.Group();
  const binBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.72, 0.48),
    M({ color: 0x2e4a3c, roughness: 0.7 }),
  );
  binBody.position.y = 0.42;
  binBody.castShadow = true;
  bin.add(binBody);
  const binLid = new THREE.Mesh(
    new THREE.BoxGeometry(0.54, 0.07, 0.52),
    M({ color: 0x1c3328, roughness: 0.6 }),
  );
  binLid.position.y = 0.81;
  binLid.rotation.x = -0.08;
  binLid.castShadow = true;
  bin.add(binLid);
  bin.position.set(1.2, 0, -5.5);
  bin.rotation.y = 0.25;
  scene.add(bin);

  // milk crates out back
  const crate = (x: number, y: number, z: number, ry: number, color: number): void => {
    add(
      new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.36, 0.42), M({ color, roughness: 0.8 })),
      x,
      y,
      z,
      { ry },
    );
  };
  crate(4.0, 0.18, -5.55, 0.2, 0x2e5aa8);
  crate(4.0, 0.54, -5.55, -0.15, 0x2e5aa8);
  crate(4.55, 0.18, -5.45, 0.5, 0xa83232);
  crate(0.3, 0.18, -5.6, -0.3, 0xa83232);
}

function buildMagpie(scene: THREE.Scene): BirdHandles {
  const bird = new THREE.Group();
  const black = M({ color: 0x14151a, roughness: 0.55 });
  const white = M({ color: 0xe9e9e6, roughness: 0.6 });
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.09, 14, 12), black);
  body.scale.set(1, 0.85, 1.5);
  bird.add(body);
  const nape = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 10), white);
  nape.scale.set(0.9, 0.6, 0.9);
  nape.position.set(0, 0.05, -0.06);
  bird.add(nape);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 10), black);
  head.position.set(0, 0.1, 0.11);
  bird.add(head);
  const beak = new THREE.Mesh(
    new THREE.ConeGeometry(0.018, 0.06, 8),
    M({ color: 0x8a8a86, roughness: 0.5 }),
  );
  beak.rotation.x = Math.PI / 2;
  beak.position.set(0, 0.1, 0.18);
  bird.add(beak);
  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.02, 0.16), white);
  tail.position.set(0, 0.02, -0.18);
  tail.rotation.x = -0.25;
  bird.add(tail);
  bird.position.set(2.6, 3.34, 1.9);
  bird.rotation.y = -0.7;
  bird.traverse((m) => {
    m.castShadow = true;
  });
  scene.add(bird);
  return { group: bird, head, beak };
}

function buildExperiencePole(scene: THREE.Scene): void {
  const expGroup = new THREE.Group();
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.06, 3.7, 10),
    M({ color: 0x5a6058, roughness: 0.5, metalness: 0.5 }),
  );
  pole.position.y = 1.85;
  pole.castShadow = true;
  expGroup.add(pole);
  const jobs = ['JUNIOR DEV @ OPTIWEIGH', 'FOUNDER @ JBM WEB'];
  jobs.forEach((text, i) => {
    const sign = twoSidedSign(2.15, 0.38, (c, w, h) => {
      paintStreetSign(c, w, h, text);
    });
    sign.position.y = 3.42 - i * 0.46;
    sign.rotation.y = i % 2 ? -0.06 : 0.05;
    sign.children.forEach((m) => {
      m.castShadow = true;
    });
    expGroup.add(sign);
  });
  expGroup.position.set(6.6, 0.08, 2.5);
  expGroup.rotation.y = 0.15;
  scene.add(expGroup);
}
