/** Camera stops in the scene. 0 is the street overview; 1–5 are content sections. */
export type ViewIndex = 0 | 1 | 2 | 3 | 4 | 5;

/** Content sections (the street itself carries no panel). */
export type SectionIndex = 1 | 2 | 3 | 4 | 5;

export const SECTION = {
  street: 0,
  about: 1,
  skills: 2,
  projects: 3,
  experience: 4,
  contact: 5,
} as const satisfies Record<string, ViewIndex>;

/** Options the scene accepts at runtime. */
export interface CafeSceneOptions {
  readonly cafeName: string;
  readonly neonColor: string;
}

/** Public API of the `<cafe-scene>` element. */
export interface CafeSceneApi {
  /** Fly from the intro position into the street view. */
  enter(): void;
  /** Fly the camera to a stop. */
  goTo(view: ViewIndex): void;
  /** Lock/unlock scene input (used while the flat version covers it). */
  setLock(locked: boolean): void;
  /** Repaint the configurable textures (fascia name, neon colour). */
  setOptions(options: Partial<CafeSceneOptions>): void;
}

export interface CafeProgressDetail {
  readonly pct: number;
}

export interface CafeSectionDetail {
  /** -1 for the free-roaming street, otherwise the active section. */
  readonly section: -1 | ViewIndex;
}

declare global {
  interface WindowEventMap {
    'cafe:progress': CustomEvent<CafeProgressDetail>;
    'cafe:ready': CustomEvent<Record<string, never>>;
    'cafe:section': CustomEvent<CafeSectionDetail>;
  }
}
