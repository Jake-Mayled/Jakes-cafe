import type { ReactElement } from 'react';
import { SKILLS } from '../../data/portfolio';

export function SkillsPanel(): ReactElement {
  return (
    <div className="skills-list">
      {SKILLS.map((group) => (
        <div key={group.group}>
          <div className="skills-group">{group.group}</div>
          <div className="skills-chips">
            {group.items.map((item) => (
              <span className="skills-chip" key={item}>
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
