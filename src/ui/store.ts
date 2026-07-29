/** Minimal immutable observable store for the UI layer. */

export type Updater<T> = Partial<T> | ((previous: T) => Partial<T>);
export type Listener<T> = (state: T) => void;

export class Store<T extends object> {
  private state: T;
  private readonly listeners = new Set<Listener<T>>();

  constructor(initial: T) {
    this.state = initial;
  }

  getState(): T {
    return this.state;
  }

  /** Applies a partial patch (or updater) and notifies listeners with a new state object. */
  setState(updater: Updater<T>): void {
    const patch = typeof updater === 'function' ? updater(this.state) : updater;
    this.state = { ...this.state, ...patch };
    for (const listener of this.listeners) listener(this.state);
  }

  /** Returns an unsubscribe function. */
  subscribe(listener: Listener<T>): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export type ExperienceTab = 'work' | 'edu';

export interface AppState {
  /** Simulated load percentage, 0–100. */
  readonly pct: number;
  readonly ready: boolean;
  readonly entered: boolean;
  /** -1 while roaming the street; 0–5 for a camera stop. */
  readonly section: number;
  /** Section whose panel the visitor dismissed (-1 = none). */
  readonly dismissed: number;
  readonly flat: boolean;
  readonly muted: boolean;
  readonly expTab: ExperienceTab;
}

export const INITIAL_STATE: AppState = {
  pct: 0,
  ready: false,
  entered: false,
  section: 0,
  dismissed: -1,
  flat: false,
  muted: false,
  expTab: 'work',
};

/** The right-hand panel shows when a content section is active and not dismissed. */
export function isPanelVisible(state: AppState): boolean {
  return state.entered && !state.flat && state.section >= 1 && state.section !== state.dismissed;
}
