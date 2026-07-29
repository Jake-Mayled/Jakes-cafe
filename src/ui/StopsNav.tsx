/** Bottom pill navigation across the six camera stops. */
import type { ReactElement } from 'react';
import { STOP_LABELS } from '../data/portfolio';
import type { ViewIndex } from '../types';
import type { AppState } from './store';

const VIEW_INDICES: readonly ViewIndex[] = [0, 1, 2, 3, 4, 5];

interface StopsNavProps {
  readonly state: AppState;
  readonly onGoTo: (view: ViewIndex) => void;
}

export function StopsNav({ state, onGoTo }: StopsNavProps): ReactElement {
  return (
    <nav className="stops" aria-label="Portfolio stops" hidden={!state.entered}>
      {VIEW_INDICES.map((view) => (
        <button
          key={view}
          type="button"
          className={`stop-button${state.section === view ? ' is-active' : ''}`}
          onClick={() => {
            onGoTo(view);
          }}
        >
          {STOP_LABELS[view]}
        </button>
      ))}
    </nav>
  );
}
