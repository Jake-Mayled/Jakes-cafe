import { describe, expect, test } from 'vitest';
import {
  ABOUT_FLAT,
  ABOUT_PARAGRAPHS,
  CONTACT,
  CONTACT_BLURB,
  EDUCATION,
  JOBS,
  PANEL_KICKERS,
  PANEL_TITLES,
  PROJECTS,
  SKILLS,
  STOP_LABELS,
} from './portfolio';

describe('portfolio data', () => {
  test('has four skill groups whose flat text matches the chip items', () => {
    expect(SKILLS).toHaveLength(4);
    for (const group of SKILLS) {
      expect(group.items.length).toBeGreaterThan(0);
      for (const item of group.items) {
        expect(group.flat.toLowerCase()).toContain(item.toLowerCase());
      }
    }
  });

  test('every project has a name, stack, and blurb; links are https URLs', () => {
    expect(PROJECTS.length).toBeGreaterThanOrEqual(3);
    for (const project of PROJECTS) {
      expect(project.name).not.toHaveLength(0);
      expect(project.stack).not.toHaveLength(0);
      expect(project.blurb).not.toHaveLength(0);
      if (project.link !== undefined) {
        expect(new URL(project.link).protocol).toBe('https:');
      }
    }
  });

  test('jobs and education entries are complete', () => {
    expect(JOBS).toHaveLength(2);
    expect(EDUCATION).toHaveLength(3);
    for (const job of JOBS) {
      expect(job.years).not.toHaveLength(0);
      expect(job.role).not.toHaveLength(0);
      expect(job.company).not.toHaveLength(0);
      expect(job.blurb).not.toHaveLength(0);
    }
    for (const entry of EDUCATION) {
      expect(entry.years).not.toHaveLength(0);
      expect(entry.title).not.toHaveLength(0);
      expect(entry.place).not.toHaveLength(0);
    }
  });

  test('contact details are well formed', () => {
    expect(CONTACT.email).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
    expect(new URL(CONTACT.github).hostname).toBe('github.com');
    expect(new URL(CONTACT.linkedin).hostname).toContain('linkedin.com');
  });

  test('navigation metadata covers all six stops', () => {
    expect(STOP_LABELS).toHaveLength(6);
    expect(PANEL_TITLES).toHaveLength(6);
    expect(PANEL_KICKERS).toHaveLength(6);
    // the street (index 0) has no panel copy
    expect(PANEL_TITLES[0]).toBe('');
    expect(PANEL_KICKERS[0]).toBe('');
  });

  test('about copy is present for both panel and flat versions', () => {
    expect(ABOUT_PARAGRAPHS).toHaveLength(3);
    expect(ABOUT_FLAT.length).toBeGreaterThan(0);
    expect(CONTACT_BLURB.length).toBeGreaterThan(0);
  });
});
