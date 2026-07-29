import type { ReactElement } from 'react';
import { PROJECTS } from '../../data/portfolio';

export function ProjectsPanel(): ReactElement {
  return (
    <div className="projects-list">
      {PROJECTS.map((project) => (
        <div className="project-card" key={project.name}>
          <div className="project-header">
            <div className="project-name">{project.name}</div>
            <div className="project-stack">{project.stack}</div>
          </div>
          <p className="project-blurb">{project.blurb}</p>
          {project.link !== undefined && (
            <a
              className="project-link"
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              VIEW ON GITHUB ↗
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
