import type { ViewIndex } from '../types';
import type { ExperienceTab } from './store';

/** Actions the UI can trigger; implemented by the app controller. */
export interface AppActions {
  enter: () => void;
  goTo: (view: ViewIndex) => void;
  toggleMute: () => void;
  openFlat: () => void;
  closeFlat: () => void;
  closePanel: () => void;
  nextStop: () => void;
  setExperienceTab: (tab: ExperienceTab) => void;
}
