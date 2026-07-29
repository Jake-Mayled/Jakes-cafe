import type { ReactElement } from 'react';
import { CONTACT, CONTACT_BLURB } from '../../data/portfolio';

export function ContactPanel(): ReactElement {
  return (
    <>
      <p className="panel-paragraph panel-paragraph-contact">{CONTACT_BLURB}</p>
      <div className="contact-links">
        <a className="contact-email" href={`mailto:${CONTACT.email}`}>
          {CONTACT.email}
        </a>
        <div className="contact-socials">
          <a
            className="contact-social"
            href={CONTACT.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            className="contact-social"
            href={CONTACT.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </>
  );
}
