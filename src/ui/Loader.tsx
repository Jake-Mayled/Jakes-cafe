/** Cream loading screen: CSS coffee cup, progress bar, and the enter CTA. */
import type { ReactElement } from 'react';
import { CAFE_NAME } from '../config';
import type { AppState } from './store';

interface LoaderProps {
  readonly state: AppState;
  readonly onEnter: () => void;
}

export function Loader({ state, onEnter }: LoaderProps): ReactElement {
  return (
    <div className="loader" hidden={state.entered}>
      <div className="loader-cup" aria-hidden="true">
        <div className="loader-cup-body" />
        <div className="loader-cup-handle" />
        <div className="loader-steam loader-steam-1" />
        <div className="loader-steam loader-steam-2" />
      </div>
      <div className="loader-title">{CAFE_NAME}</div>
      <div className="loader-tagline">the portfolio of Jake Mayled · full-stack developer</div>
      <div className="loader-track">
        <div className="loader-bar" style={{ width: `${state.pct}%` }} />
      </div>
      <button type="button" className="loader-enter" hidden={!state.ready} onClick={onEnter}>
        STEP INSIDE →
      </button>
      <div className="loader-brewing" hidden={state.ready}>
        BREWING THE SCENE… {state.pct}%
      </div>
    </div>
  );
}
