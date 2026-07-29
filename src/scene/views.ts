import type { ViewIndex } from '../types';

export interface CameraView {
  /** Camera position [x, y, z]. */
  readonly position: readonly [number, number, number];
  /** Orbit target [x, y, z]. */
  readonly target: readonly [number, number, number];
}

/** Camera stops: 0 street, 1 about, 2 skills, 3 projects, 4 experience, 5 contact. */
export const VIEWS: Readonly<Record<ViewIndex, CameraView>> = {
  0: { position: [-6.5, 4.6, 12], target: [1, 2.0, -2.5] },
  1: { position: [0.9, 1.5, 4.4], target: [0.3, 0.85, 0.8] },
  2: { position: [-8.6, 2.1, 1.3], target: [-3.5, 1.75, 0.2] },
  3: { position: [12.6, 2.4, -4.7], target: [5.5, 2.1, -3.95] },
  4: { position: [5.4, 2.2, 6.6], target: [7.3, 2.75, 2.5] },
  5: { position: [-8.4, 2.2, -3.0], target: [-3.5, 2.05, -3.2] },
};

/** Far pull-back the camera starts at before the visitor steps inside. */
export const INTRO_VIEW: CameraView = {
  position: [-13, 9.5, 23],
  target: [1, 2.0, -2.5],
};
