import type { ReactElement } from 'react';
import { EDUCATION, JOBS } from '../../data/portfolio';
import type { ExperienceTab } from '../store';

interface ExperiencePanelProps {
  readonly expTab: ExperienceTab;
  readonly onSetExperienceTab: (tab: ExperienceTab) => void;
}

export function ExperiencePanel({
  expTab,
  onSetExperienceTab,
}: ExperiencePanelProps): ReactElement {
  return (
    <>
      <div className="exp-tabs">
        <button
          type="button"
          className={`exp-tab${expTab === 'work' ? ' is-active' : ''}`}
          onClick={() => {
            onSetExperienceTab('work');
          }}
        >
          EXPERIENCE
        </button>
        <button
          type="button"
          className={`exp-tab${expTab === 'edu' ? ' is-active' : ''}`}
          onClick={() => {
            onSetExperienceTab('edu');
          }}
        >
          EDUCATION
        </button>
      </div>
      {expTab === 'work' ? (
        <div className="timeline">
          {JOBS.map((job) => (
            <div className="timeline-row" key={`${job.company}-${job.role}`}>
              <div className="timeline-years">{job.years}</div>
              <div>
                <div className="timeline-role">{job.role}</div>
                <div className="timeline-place">{job.company}</div>
                <p className="timeline-blurb">{job.blurb}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="timeline">
          {EDUCATION.map((entry) => (
            <div className="timeline-row timeline-row-edu" key={entry.title}>
              <div className="timeline-years timeline-years-edu">{entry.years}</div>
              <div>
                <div className="timeline-edu-title">{entry.title}</div>
                <div className="timeline-edu-place">{entry.place}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
