/** Accessible, scrollable flat version of the whole portfolio. */
import type { ReactElement } from 'react';
import { CAFE_NAME } from '../config';
import { ABOUT_FLAT, CONTACT, EDUCATION, JOBS, PROJECTS, SKILLS } from '../data/portfolio';
import type { AppState } from './store';

interface FlatViewProps {
  readonly state: AppState;
  readonly onClose: () => void;
}

export function FlatView({ state, onClose }: FlatViewProps): ReactElement {
  return (
    <div className="flat" hidden={!state.flat}>
      <div className="flat-inner">
        <div className="flat-top">
          <div className="flat-brand">{CAFE_NAME} · flat version</div>
          <button type="button" className="flat-back" onClick={onClose}>
            ← BACK TO THE STREET
          </button>
        </div>

        <h1 className="flat-name">Jake Mayled</h1>
        <div className="flat-role">Junior Full-Stack Developer · Australia</div>

        <h2 className="flat-heading">ABOUT</h2>
        <p className="flat-paragraph">{ABOUT_FLAT}</p>

        <h2 className="flat-heading">SKILLS</h2>
        {SKILLS.map((group) => (
          <div className="flat-skill-row" key={group.group}>
            <div className="flat-skill-group">{group.group}</div>
            <div className="flat-skill-items">{group.flat}</div>
          </div>
        ))}

        <h2 className="flat-heading">PROJECTS</h2>
        {PROJECTS.map((project) => (
          <div className="flat-item" key={project.name}>
            <div className="flat-item-title">
              {project.name} <span className="flat-item-meta">· {project.stack}</span>
            </div>
            <p className="flat-blurb">
              {project.blurb}{' '}
              {project.link !== undefined && (
                <a href={project.link} target="_blank" rel="noopener noreferrer">
                  GitHub repo
                </a>
              )}
            </p>
          </div>
        ))}

        <h2 className="flat-heading">EXPERIENCE</h2>
        {JOBS.map((job) => (
          <div className="flat-item" key={`${job.company}-${job.role}`}>
            <div className="flat-item-title">
              {job.role} · {job.company} <span className="flat-item-meta">{job.years}</span>
            </div>
            <p className="flat-blurb">{job.blurb}</p>
          </div>
        ))}

        <h2 className="flat-heading">EDUCATION</h2>
        {EDUCATION.map((entry) => (
          <div className="flat-item flat-item-edu" key={entry.title}>
            <div className="flat-item-title">
              {entry.title} <span className="flat-item-meta">{entry.years}</span>
            </div>
            <div className="flat-edu-place">{entry.place}</div>
          </div>
        ))}

        <h2 className="flat-heading">CONTACT</h2>
        <p className="flat-paragraph">
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> ·{' '}
          <a href={CONTACT.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>{' '}
          ·{' '}
          <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </p>
      </div>
    </div>
  );
}
