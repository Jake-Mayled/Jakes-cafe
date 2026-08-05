/**
 * React Three Fiber host for the cafe streetscape. Owns the `<Canvas>`
 * (renderer/camera/scene/render-loop/resize — all managed by R3F) and
 * exposes the same imperative `CafeSceneApi` the rest of the app already
 * uses (`enter`, `goTo`, `setLock`, `setOptions`), so callers don't change.
 */
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import type { CafeSceneApi, CafeSceneOptions, ViewIndex } from '../types';
import { SceneContents, type SceneController } from './SceneContents';
import { INTRO_VIEW } from './views';

const DEFAULT_OPTIONS: CafeSceneOptions = {
  cafeName: "Jake's Cafe",
  neonColor: '#ff9d5c',
};

export const CafeScene = forwardRef<CafeSceneApi>(function CafeScene(_props, ref): ReactElement {
  const controllerRef = useRef<SceneController>({});
  const [options, setOptions] = useState<CafeSceneOptions>(DEFAULT_OPTIONS);

  useImperativeHandle(
    ref,
    (): CafeSceneApi => ({
      enter: (): void => controllerRef.current.enter?.(),
      goTo: (view: ViewIndex): void => controllerRef.current.goTo?.(view),
      setLock: (locked: boolean): void => controllerRef.current.setLock?.(locked),
      setOptions: (patch: Partial<CafeSceneOptions>): void => {
        setOptions((prev) => ({ ...prev, ...patch }));
      },
    }),
    [],
  );

  return (
    <Canvas
      className="scene-layer"
      style={{ position: 'absolute', inset: 0 }}
      shadows="soft"
      dpr={[1, 2]}
      gl={{ antialias: true, preserveDrawingBuffer: true }}
      camera={{ fov: 45, near: 0.1, far: 160, position: [...INTRO_VIEW.position] }}
      onCreated={({ gl, scene }): void => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.1;
        gl.outputColorSpace = THREE.SRGBColorSpace;
        scene.fog = new THREE.Fog(0xeec49a, 42, 95);
      }}
    >
      <SceneContents options={options} controllerRef={controllerRef} />
    </Canvas>
  );
});
