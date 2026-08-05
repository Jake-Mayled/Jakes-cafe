/**
 * Mounted inside the R3F `<Canvas>`. Builds the procedural cafe streetscape
 * once (unchanged builder modules), drives the per-frame camera tween / sign
 * hover / bird / bulb animation, and registers the imperative controls
 * (`enter`, `goTo`, `setLock`) that `CafeScene` exposes to the rest of the
 * app via its ref.
 */
import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { RefObject } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { ReactElement } from 'react';
import { emitProgress, emitReady, emitSection } from '../events';
import type { CafeSceneOptions, ViewIndex } from '../types';
import { Building } from './components/Building';
import { Environment } from './components/Environment';
import { Exterior, type ExteriorHandle } from './components/Exterior';
import { SignPole, type SignEntry, type SignPoleHandle } from './components/SignPole';
import { StringLights, type StringLightsHandle } from './components/StringLights';
import { clamp, smoothstep } from './math';
import { INTRO_VIEW, VIEWS } from './views';

const FLY_DURATION_MS = 1500;
const INTRO_FLY_DURATION_MS = 2200;
/** Pointer travel (px) beyond which a pointerup is a drag, not a tap. */
const TAP_SLOP_PX = 6;

/** Imperative actions `CafeScene` forwards down to this component's ref. */
export interface SceneController {
  enter?: () => void;
  goTo?: (view: ViewIndex) => void;
  setLock?: (locked: boolean) => void;
}

interface CameraTween {
  readonly view: ViewIndex;
  readonly startedAt: number;
  readonly duration: number;
  readonly fromPosition: THREE.Vector3;
  readonly toPosition: THREE.Vector3;
  readonly fromTarget: THREE.Vector3;
  readonly toTarget: THREE.Vector3;
}

interface SceneContentsProps {
  readonly options: CafeSceneOptions;
  readonly controllerRef: RefObject<SceneController>;
}

export function SceneContents({ options, controllerRef }: SceneContentsProps): ReactElement {
  const { camera, gl } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const tweenRef = useRef<CameraTween | null>(null);
  const enteredRef = useRef(false);
  const hoveredSignRef = useRef<THREE.Group | null>(null);
  const pointerDownAtRef = useRef<readonly [number, number] | null>(null);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const pointerNdc = useMemo(() => new THREE.Vector2(), []);

  const signPoleRef = useRef<SignPoleHandle>(null);
  const stringLightsRef = useRef<StringLightsHandle>(null);
  const exteriorRef = useRef<ExteriorHandle>(null);

  // Building, Exterior, SignPole, and StringLights all build themselves
  // declaratively below and self-manage their reactive textures; this
  // effect only drives the simulated brewing progress, mirroring the
  // original custom element's `connectedCallback`.
  useEffect(() => {
    let pct = 0;
    const tick = (): void => {
      pct = Math.min(100, pct + 3 + Math.random() * 6);
      emitProgress({ pct: Math.floor(pct) });
      if (pct < 100) {
        setTimeout(tick, 45);
      } else {
        emitReady();
      }
    };
    requestAnimationFrame(tick);
  }, []);

  const flyTo = useCallback(
    (view: ViewIndex, slow = false): void => {
      const { position, target } = VIEWS[view];
      tweenRef.current = {
        view,
        startedAt: performance.now(),
        duration: slow ? INTRO_FLY_DURATION_MS : FLY_DURATION_MS,
        fromPosition: camera.position.clone(),
        toPosition: new THREE.Vector3().fromArray(position),
        fromTarget: controlsRef.current?.target.clone() ?? new THREE.Vector3(),
        toTarget: new THREE.Vector3().fromArray(target),
      };
      const controls = controlsRef.current;
      if (controls) {
        controls.enabled = false;
        controls.autoRotate = false;
      }
    },
    [camera],
  );

  const pick = useCallback(
    (event: PointerEvent): SignEntry | null => {
      const rect = gl.domElement.getBoundingClientRect();
      pointerNdc.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(pointerNdc, camera);
      const signEntries = signPoleRef.current?.signEntries ?? [];
      const meshes = signEntries.map((entry) => entry.mesh);
      const hit = raycaster.intersectObjects(meshes)[0];
      if (!hit) return null;
      return signEntries.find((entry) => entry.mesh === hit.object) ?? null;
    },
    [gl, camera, raycaster, pointerNdc],
  );

  // Keep the ref-exposed imperative API in sync with the latest closures.
  useEffect(() => {
    controllerRef.current.enter = (): void => {
      enteredRef.current = true;
      flyTo(0, true);
    };
    controllerRef.current.goTo = (view: ViewIndex): void => {
      flyTo(view);
    };
    controllerRef.current.setLock = (locked: boolean): void => {
      // The flat version fully covers the canvas, so no scene-side lock is
      // needed; kept as part of the API for parity with the design.
      void locked;
    };
  }, [controllerRef, flyTo]);

  useEffect(() => {
    const el = gl.domElement;
    const onPointerDown = (event: PointerEvent): void => {
      pointerDownAtRef.current = [event.clientX, event.clientY];
    };
    const onPointerUp = (event: PointerEvent): void => {
      if (!enteredRef.current || !pointerDownAtRef.current) return;
      const [downX, downY] = pointerDownAtRef.current;
      const moved = Math.hypot(event.clientX - downX, event.clientY - downY);
      pointerDownAtRef.current = null;
      if (moved > TAP_SLOP_PX) return;
      const hit = pick(event);
      if (hit) flyTo(hit.section);
    };
    const onPointerMove = (event: PointerEvent): void => {
      if (!enteredRef.current) return;
      const hit = pick(event);
      el.style.cursor = hit ? 'pointer' : 'grab';
      hoveredSignRef.current = hit?.sign ?? null;
    };
    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointerup', onPointerUp);
    el.addEventListener('pointermove', onPointerMove);
    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointerup', onPointerUp);
      el.removeEventListener('pointermove', onPointerMove);
    };
  }, [gl, pick, flyTo]);

  useFrame((state) => {
    const tween = tweenRef.current;
    if (tween) {
      const f = clamp((performance.now() - tween.startedAt) / tween.duration, 0, 1);
      const eased = smoothstep(f);
      camera.position.lerpVectors(tween.fromPosition, tween.toPosition, eased);
      controlsRef.current?.target.lerpVectors(tween.fromTarget, tween.toTarget, eased);
      if (f >= 1) {
        tweenRef.current = null;
        const controls = controlsRef.current;
        if (controls) controls.enabled = true;
        emitSection({ section: tween.view === 0 ? -1 : tween.view });
      }
    }
    controlsRef.current?.update();

    const seen = new Set<THREE.Group>();
    for (const entry of signPoleRef.current?.signEntries ?? []) {
      if (seen.has(entry.sign)) continue;
      seen.add(entry.sign);
      const target = hoveredSignRef.current === entry.sign ? 1.12 : 1;
      entry.sign.scale.setScalar(entry.sign.scale.x + (target - entry.sign.scale.x) * 0.2);
    }

    const t = state.clock.elapsedTime;
    const bird = exteriorRef.current?.bird;
    if (bird) {
      bird.group.position.y = 3.34 + Math.abs(Math.sin(t * 1.3)) * 0.008;
      bird.head.rotation.z = Math.sin(t * 0.9) * 0.35;
      bird.beak.rotation.z = bird.head.rotation.z;
    }
    (stringLightsRef.current?.bulbs ?? []).forEach((bulb, i) => {
      bulb.material.color.setHSL(0.09, 0.65, 0.6 + Math.sin(t * 2 + i * 1.7) * 0.08);
    });
  });

  return (
    <>
      <Environment />
      <Building neonColor={options.neonColor} />
      <Exterior ref={exteriorRef} cafeName={options.cafeName} neonColor={options.neonColor} />
      <SignPole ref={signPoleRef} />
      <StringLights ref={stringLightsRef} />
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.06}
        enablePan={false}
        autoRotate={false}
        minDistance={3.5}
        maxDistance={32}
        maxPolarAngle={1.48}
        minPolarAngle={0.15}
        target={[...INTRO_VIEW.target]}
        onStart={() => {
          const controls = controlsRef.current;
          if (controls) controls.autoRotate = false;
          if (!tweenRef.current) emitSection({ section: -1 });
        }}
      />
    </>
  );
}
