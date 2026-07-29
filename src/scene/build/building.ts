/**
 * The cafe building: brick shell (x −3.5..5.5, z −5..0), frosted shopfront
 * glazing, hinged open door with neon OPEN sign, roof, and the full interior
 * (counter, coffee machine, tables, kitchen, fridge, prints, pendants).
 */
import * as THREE from 'three';
import { place, standardMat as M } from '../helpers';
import { paintBrick, paintNeon, paintPoster, paintRoofIron } from '../painters';
import { DynamicTexture, makeTexture } from '../textures';

export interface BuildingHandles {
  /** Neon OPEN sign on the door — repainted when the neon colour changes. */
  readonly openTexture: DynamicTexture;
}

export function buildBuilding(scene: THREE.Scene, neonColor: string): BuildingHandles {
  const add = <T extends THREE.Object3D>(
    obj: T,
    x: number,
    y: number,
    z: number,
    o: Parameters<typeof place>[5] = {},
  ): T => place(scene, obj, x, y, z, o);

  const brickTex = makeTexture(512, 512, paintBrick);
  brickTex.wrapS = brickTex.wrapT = THREE.RepeatWrapping;
  brickTex.repeat.set(2.5, 1.6);
  const brick = M({ map: brickTex, roughness: 0.9 });
  const plaster = M({ color: 0xe8dcc4, roughness: 0.9 });

  // floor
  add(
    new THREE.Mesh(new THREE.BoxGeometry(8.8, 0.14, 4.8), M({ color: 0x8a6a4a, roughness: 0.8 })),
    1,
    0.2,
    -2.5,
    { castShadow: false },
  );
  // back wall
  add(new THREE.Mesh(new THREE.BoxGeometry(9, 5, 0.3), brick), 1, 2.5, -4.85);
  // right wall: full-width frosted shopfront glazing
  add(new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.0, 5), brick), 5.35, 0.5, -2.5);
  add(new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.4, 5), brick), 5.35, 4.3, -2.5);
  const frost = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 2.6, 4.6),
    new THREE.MeshPhysicalMaterial({
      color: 0xdfe8e6,
      transparent: true,
      opacity: 0.55,
      roughness: 0.55,
      metalness: 0.05,
    }),
  );
  frost.position.set(5.35, 2.3, -2.5);
  frost.castShadow = false;
  frost.receiveShadow = true;
  scene.add(frost);
  const wallTrim = M({ color: 0x1f1a17, roughness: 0.6 });
  [1.02, 3.58].forEach((y) => {
    add(new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.1, 4.8), wallTrim), 5.35, y, -2.5, {
      castShadow: false,
    });
  });
  [-0.22, -1.75, -3.25, -4.78].forEach((z) => {
    add(new THREE.Mesh(new THREE.BoxGeometry(0.16, 2.66, 0.1), wallTrim), 5.35, 2.3, z, {
      castShadow: false,
    });
  });
  // left wall
  add(new THREE.Mesh(new THREE.BoxGeometry(0.3, 5, 5), brick), -3.35, 2.5, -2.5);
  // front wall pieces (door opening x −2.3..−0.9 h 2.5; window opening x 0.4..5.0, y 0.85..2.85)
  add(new THREE.Mesh(new THREE.BoxGeometry(1.2, 5, 0.3), brick), -2.9, 2.5, -0.15);
  add(new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.5, 0.3), brick), -1.6, 3.75, -0.15);
  add(new THREE.Mesh(new THREE.BoxGeometry(1.3, 5, 0.3), brick), -0.25, 2.5, -0.15);
  add(new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.85, 0.3), brick), 2.7, 0.425, -0.15);
  add(new THREE.Mesh(new THREE.BoxGeometry(4.6, 2.15, 0.3), brick), 2.7, 3.925, -0.15);
  add(new THREE.Mesh(new THREE.BoxGeometry(0.5, 5, 0.3), brick), 5.25, 2.5, -0.15);
  // window + door trim
  const trim = M({ color: 0x1f1a17, roughness: 0.6 });
  add(new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.1, 0.36), trim), 2.7, 0.9, -0.15, {
    castShadow: false,
  });
  add(new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.1, 0.36), trim), 2.7, 2.9, -0.15, {
    castShadow: false,
  });
  [0.4, 5.0].forEach((x) => {
    add(new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.1, 0.36), trim), x, 1.9, -0.15, {
      castShadow: false,
    });
  });

  // open door (hinged at x −2.3, swung inward) with neon OPEN sign
  const doorGroup = new THREE.Group();
  const door = new THREE.Mesh(
    new THREE.BoxGeometry(1.3, 2.45, 0.08),
    M({ color: 0x365a4c, roughness: 0.55 }),
  );
  door.position.x = 0.65;
  door.castShadow = true;
  doorGroup.add(door);
  const knob = new THREE.Mesh(
    new THREE.SphereGeometry(0.045, 12, 12),
    M({ color: 0xc8a24a, metalness: 0.8, roughness: 0.3 }),
  );
  knob.position.set(1.16, 0, 0.08);
  doorGroup.add(knob);
  const openTexture = new DynamicTexture(512, 256, (c, w, h) => {
    paintNeon(c, w, h, 'open', neonColor);
  });
  const openSign = new THREE.Mesh(
    new THREE.PlaneGeometry(0.78, 0.39),
    new THREE.MeshBasicMaterial({
      map: openTexture.texture,
      transparent: true,
      side: THREE.DoubleSide,
    }),
  );
  openSign.position.set(0.65, 0.62, 0.06);
  doorGroup.add(openSign);
  doorGroup.position.set(-2.28, 1.35, -0.05);
  doorGroup.rotation.y = 1.15;
  scene.add(doorGroup);

  // roof
  const roofTex = makeTexture(512, 128, paintRoofIron);
  roofTex.wrapS = THREE.RepeatWrapping;
  roofTex.repeat.set(3, 1);
  add(
    new THREE.Mesh(
      new THREE.BoxGeometry(9.3, 0.12, 5.3),
      M({ map: roofTex, roughness: 0.55, metalness: 0.4 }),
    ),
    1,
    5.08,
    -2.5,
  );
  add(new THREE.Mesh(new THREE.BoxGeometry(9.5, 0.28, 0.24), plaster), 1, 5.25, -0.05);
  add(new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.28, 5.5), plaster), -3.55, 5.25, -2.5);
  add(new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.28, 5.5), plaster), 5.55, 5.25, -2.5);
  add(
    new THREE.Mesh(
      new THREE.BoxGeometry(1.3, 0.75, 1.0),
      M({ color: 0x8a8a86, roughness: 0.6, metalness: 0.5 }),
    ),
    3.6,
    5.5,
    -3.6,
  );
  add(
    new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.14, 0.9, 10),
      M({ color: 0x6b6663, metalness: 0.5, roughness: 0.5 }),
    ),
    -1.4,
    5.55,
    -4.2,
  );

  buildInterior(scene, add);
  return { openTexture };
}

type Adder = <T extends THREE.Object3D>(
  obj: T,
  x: number,
  y: number,
  z: number,
  o?: Parameters<typeof place>[5],
) => T;

function buildInterior(scene: THREE.Scene, add: Adder): void {
  // counter behind servery window
  add(
    new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.86, 0.55), M({ color: 0x6a4a30, roughness: 0.75 })),
    2.7,
    0.63,
    -0.75,
  );
  add(
    new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.06, 0.7), M({ color: 0xe8dcc4, roughness: 0.4 })),
    2.7,
    1.09,
    -0.75,
  );

  // coffee machine
  const machine = new THREE.Group();
  const machineBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.34, 0.4),
    M({ color: 0x2e2320, roughness: 0.4, metalness: 0.3 }),
  );
  machineBody.position.y = 0.17;
  machine.add(machineBody);
  const machineTop = new THREE.Mesh(
    new THREE.BoxGeometry(0.64, 0.07, 0.44),
    M({ color: 0xc8a24a, metalness: 0.7, roughness: 0.3 }),
  );
  machineTop.position.y = 0.375;
  machine.add(machineTop);
  [-0.16, 0.08].forEach((px) => {
    const grouphead = new THREE.Mesh(
      new THREE.CylinderGeometry(0.028, 0.028, 0.09, 8),
      M({ color: 0xc8a24a, metalness: 0.7, roughness: 0.3 }),
    );
    grouphead.position.set(px, 0.1, 0.21);
    grouphead.rotation.x = Math.PI / 2;
    machine.add(grouphead);
  });
  machine.position.set(1.7, 1.12, -0.78);
  machine.rotation.y = Math.PI;
  machine.traverse((m) => {
    m.castShadow = true;
  });
  scene.add(machine);

  // grinder + cups
  add(
    new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.09, 0.3, 10),
      M({ color: 0x4a4442, roughness: 0.5 }),
    ),
    3.4,
    1.27,
    -0.8,
  );
  add(
    new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.06, 0.14, 10),
      M({ color: 0x8a8a86, roughness: 0.3, metalness: 0.4, transparent: true, opacity: 0.8 }),
    ),
    3.4,
    1.49,
    -0.8,
  );
  [4.0, 4.16, 4.08].forEach((x, i) => {
    add(
      new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.032, 0.05, 10),
        M({ color: 0xf3efe4, roughness: 0.4 }),
      ),
      x,
      1.15 + (i === 2 ? 0.05 : 0),
      -0.78,
    );
  });

  // back shelf with jars
  add(
    new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.05, 0.32), M({ color: 0x8a6a4a, roughness: 0.7 })),
    1.4,
    2.3,
    -4.5,
  );
  const jarColors = [0xa2542f, 0xc8a24a, 0x365a4c, 0xe8dcc4, 0x2e4a5c] as const;
  jarColors.forEach((color, i) => {
    add(
      new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.18, 8), M({ color, roughness: 0.5 })),
      0.5 + i * 0.45,
      2.42,
      -4.5,
    );
  });

  // inside tables + stools
  (
    [
      [-1.7, -3.1],
      [0.9, -3.6],
    ] as const
  ).forEach(([tx, tz]) => {
    add(
      new THREE.Mesh(
        new THREE.CylinderGeometry(0.38, 0.38, 0.035, 18),
        M({ color: 0x8a6a4a, roughness: 0.6 }),
      ),
      tx,
      0.95,
      tz,
    );
    add(
      new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.05, 0.7, 10),
        M({ color: 0x2e3a36, metalness: 0.5, roughness: 0.4 }),
      ),
      tx,
      0.6,
      tz,
    );
  });
  (
    [
      [-2.3, -2.7],
      [-1.1, -3.5],
      [0.3, -3.2],
      [1.5, -3.3],
    ] as const
  ).forEach(([x, z]) => {
    add(
      new THREE.Mesh(
        new THREE.CylinderGeometry(0.16, 0.16, 0.06, 12),
        M({ color: 0xc8a24a, roughness: 0.6 }),
      ),
      x,
      0.72,
      z,
    );
    add(
      new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.035, 0.45, 8),
        M({ color: 0x2e3a36, roughness: 0.4, metalness: 0.5 }),
      ),
      x,
      0.48,
      z,
    );
  });

  // kitchen along the back wall
  add(
    new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.85, 0.6),
      M({ color: 0x9a9a96, roughness: 0.45, metalness: 0.5 }),
    ),
    3.4,
    0.62,
    -4.45,
  );
  add(
    new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.05, 0.5), M({ color: 0x2e2320, roughness: 0.6 })),
    2.7,
    1.08,
    -4.45,
  );
  [2.5, 2.9].forEach((x) => {
    add(
      new THREE.Mesh(
        new THREE.CylinderGeometry(0.11, 0.11, 0.02, 12),
        M({ color: 0x1a1512, roughness: 0.5 }),
      ),
      x,
      1.11,
      -4.45,
      { castShadow: false },
    );
  });
  add(
    new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.5, 0.5),
      M({ color: 0x8a8a86, roughness: 0.5, metalness: 0.5 }),
    ),
    2.7,
    3.1,
    -4.55,
  );
  add(
    new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.14, 1.7, 10),
      M({ color: 0x8a8a86, roughness: 0.5, metalness: 0.5 }),
    ),
    2.7,
    4.2,
    -4.55,
  );
  add(
    new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.26, 8),
      M({ color: 0xc8c8c4, metalness: 0.7, roughness: 0.3 }),
    ),
    4.2,
    1.17,
    -4.6,
  );

  // fridge
  add(
    new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 1.95, 0.7),
      M({ color: 0xd8d8d4, roughness: 0.4, metalness: 0.3 }),
    ),
    4.7,
    1.06,
    -4.4,
  );
  add(
    new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.7, 0.05),
      M({ color: 0x8a8a86, metalness: 0.6, roughness: 0.3 }),
    ),
    4.32,
    1.3,
    -4.0,
  );

  // framed prints on the back wall
  (
    [
      ['#2e4a5c', -2.4],
      ['#a2542f', -1.5],
    ] as const
  ).forEach(([color, x], i) => {
    const print = new THREE.Mesh(
      new THREE.PlaneGeometry(0.62, 0.82),
      M({
        map: makeTexture(128, 170, (c, w, h) => {
          paintPoster(
            c,
            w,
            h,
            color,
            '#f3e6cf',
            i ? 'LONG\nBLACK' : 'GOOD\nCODE',
            i ? 'est. 2026' : 'ship it',
          );
        }),
        roughness: 0.85,
      }),
    );
    print.position.set(x, 2.5, -4.68);
    scene.add(print);
  });

  // pendant lights
  [0.4, 3.4].forEach((x) => {
    add(
      new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.2, 6), M({ color: 0x1f1a17 })),
      x,
      4.4,
      -1.8,
      { castShadow: false },
    );
    const bulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 10, 8),
      new THREE.MeshBasicMaterial({ color: 0xffd9a0 }),
    );
    bulb.position.set(x, 3.78, -1.8);
    scene.add(bulb);
  });
}
