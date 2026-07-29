/** Right-hand slide-in card showing the active section's content. */
import type { ReactElement, ReactNode } from 'react';
import { PANEL_KICKERS, PANEL_TITLES } from '../../data/portfolio';
import { SECTION } from '../../types';
import type { AppState, ExperienceTab } from '../store';
import { isPanelVisible } from '../store';
import { AboutPanel } from './AboutPanel';
import { ContactPanel } from './ContactPanel';
import { ExperiencePanel } from './ExperiencePanel';
import { ProjectsPanel } from './ProjectsPanel';
import { SkillsPanel } from './SkillsPanel';

interface PanelProps {
  readonly state: AppState;
  readonly onClose: () => void;
  readonly onNext: () => void;
  readonly onSetExperienceTab: (tab: ExperienceTab) => void;
}

export function Panel({ state, onClose, onNext, onSetExperienceTab }: PanelProps): ReactElement {
  const visible = isPanelVisible(state);
  const section = Math.max(state.section, 0);

  return (
    <div className="panel" hidden={!visible}>
      {visible && (
        <div className="panel-card" key={`${state.section}:${state.expTab}`}>
          <div className="panel-header">
            <div className="panel-kicker">{PANEL_KICKERS[section]}</div>
            <button
              type="button"
              className="panel-close"
              aria-label="Close panel"
              onClick={onClose}
            >
              ✕
            </button>
          </div>
          <div className="panel-title">{PANEL_TITLES[section]}</div>
          {renderSection(state.section, state.expTab, onSetExperienceTab)}
          <button type="button" className="panel-next" onClick={onNext}>
            {state.section >= 5 ? '↺ BACK TO THE STREET' : 'NEXT STOP →'}
          </button>
        </div>
      )}
    </div>
  );
}

function renderSection(
  section: number,
  expTab: ExperienceTab,
  onSetExperienceTab: (tab: ExperienceTab) => void,
): ReactNode {
  switch (section) {
    case SECTION.about:
      return <AboutPanel />;
    case SECTION.skills:
      return <SkillsPanel />;
    case SECTION.projects:
      return <ProjectsPanel />;
    case SECTION.experience:
      return <ExperiencePanel expTab={expTab} onSetExperienceTab={onSetExperienceTab} />;
    case SECTION.contact:
      return <ContactPanel />;
    default:
      return null;
  }
}
