import type { ReactElement } from 'react';
import { ABOUT_PARAGRAPHS } from '../../data/portfolio';

export function AboutPanel(): ReactElement {
  return (
    <>
      {ABOUT_PARAGRAPHS.map((text) => (
        <p className="panel-paragraph" key={text}>
          {text}
        </p>
      ))}
    </>
  );
}
