/** Top bar shown once inside: identity on the left, sound + flat toggles on the right. */
import type { ReactElement } from 'react';
import type { AppState } from './store';

interface HudProps {
  readonly state: AppState;
  readonly onToggleMute: () => void;
  readonly onOpenFlat: () => void;
}

export function Hud({ state, onToggleMute, onOpenFlat }: HudProps): ReactElement {
  return (
    <div className="hud" hidden={!state.entered}>
      <div className="hud-identity">
        <div className="hud-name">JAKE MAYLED</div>
        <div className="hud-tagline">junior full-stack dev · coffee enthusiast · Australia</div>
      </div>
      <div className="hud-controls">
        <button type="button" className="hud-button" onClick={onToggleMute}>
          {state.muted ? 'SOUND OFF' : 'SOUND ON'}
        </button>
        <button type="button" className="hud-button" onClick={onOpenFlat}>
          FLAT VERSION
        </button>
      </div>
    </div>
  );
}
