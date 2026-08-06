/** All portfolio copy, exactly as authored in the Claude Design source. */

export interface SkillGroup {
  readonly group: string;
  readonly items: readonly string[];
  /** Comma-joined variant used by the flat version. */
  readonly flat: string;
}

export interface Project {
  readonly name: string;
  readonly stack: string;
  readonly blurb: string;
  readonly link?: string;
}

export interface Job {
  readonly years: string;
  readonly role: string;
  readonly company: string;
  readonly blurb: string;
}

export interface Education {
  readonly years: string;
  readonly title: string;
  readonly place: string;
}

export const SKILLS: readonly SkillGroup[] = [
  {
    group: 'LANGUAGES',
    items: ['TypeScript', 'JavaScript', 'Python', 'C++', 'SQL'],
    flat: 'TypeScript, JavaScript, Python, C++, SQL',
  },
  {
    group: 'FRONT-END',
    items: ['React', 'React Router', 'React Native', 'Expo', 'Three.js / R3F', 'Figma'],
    flat: 'React, React Router, React Native, Expo, Three.js / R3F, Figma',
  },
  {
    group: 'BACK-END & CLOUD',
    items: ['Node.js', 'REST APIs', 'AWS', 'Vercel', 'CI/CD pipelines'],
    flat: 'Node.js, REST APIs, AWS, Vercel, CI/CD pipelines',
  },
  {
    group: 'WORKFLOW',
    items: ['Git', 'Agile teams', 'Agentic AI workflows'],
    flat: 'Git, agile teams, agentic AI workflows',
  },
];

export const PROJECTS: readonly Project[] = [
  {
    name: 'AI Java Evaluator',
    stack: 'PYTHON · AI',
    blurb:
      'Automated marking tool built for my university degree. Takes in Java code and evaluates it with AI, grading submissions against sample code and marking criteria.',
    link: 'https://github.com/Jake-Mayled/AI-Java-Evaluator',
  },
  {
    name: 'AoCA Smart App',
    stack: 'KOTLIN · AI · MOBILE',
    blurb:
      'Agent-oriented Cognition-based Smart Assistant (AoCA). Cross-platform mobile app built with a university team to help assess and monitor cognitive ability. Cognitive assessments, activity tracking, appointment scheduling, and communication with healthcare providers, supporting early detection and ongoing care.',
  },
  {
    name: 'More Brewing',
    stack: 'COMING SOON',
    blurb: 'New projects are on the bench. Watch my GitHub to see what pours next.',
    link: 'https://github.com/Jake-Mayled',
  },
];

export const JOBS: readonly Job[] = [
  {
    years: 'Nov 2024 - present',
    role: 'Junior Software Developer',
    company: 'Optiweigh',
    blurb:
      'Working across the full stack in an agile team: a React Router web app, REST APIs, and embedded systems.',
  },
  {
    years: 'Feb 2026 - present',
    role: 'Founder',
    company: 'JBM Web',
    blurb:
      'React landing pages for service businesses. Designing, coding, deploying, and maintaining, all done by me.',
  },
];

export const EDUCATION: readonly Education[] = [
  {
    years: 'Jan 2023 - Oct 2025',
    title: 'Bachelor of Computer Science',
    place: 'University of New England, Armidale',
  },
  {
    years: 'Mar 2022 - Jan 2023',
    title: 'Diploma in Information Technology',
    place: 'University of New England, Armidale',
  },
  {
    years: 'Jul 2021 - Apr 2022',
    title: 'Front-End Developer Course',
    place: 'Codecademy',
  },
];

export const CONTACT = {
  email: 'jakewmayled@gmail.com',
  github: 'https://github.com/Jake-Mayled',
  linkedin: 'https://www.linkedin.com/in/jake-mayled-7379351a4',
} as const;

export const ABOUT_PARAGRAPHS: readonly string[] = [
  "G'day, I'm Jake. A junior full-stack developer with a passion for frontend design and a serious coffee habit.",
  'Two years in the trade, working across the full stack in an agile team at Optiweigh, and running JBM Web on the side, where I build React landing pages for service businesses.',
  'Based in Australia. Usually found at the corner table, headphones on, long black in hand.',
];

export const ABOUT_FLAT =
  "G'day, I'm Jake. A junior full-stack developer with a passion for frontend design and coffee. Two years working across the full stack in an agile team at Optiweigh, plus running JBM Web, where I design, build, and deploy React landing pages for service businesses.";

export const CONTACT_BLURB =
  "The neon's on and the machine's warm. Whether it's a role, a project, or an argument about tabs vs spaces, my inbox is open.";

/** Per-stop labels for the bottom navigation (index 0 = street). */
export const STOP_LABELS = [
  'STREET',
  'ABOUT',
  'SKILLS',
  'PROJECTS',
  'EXPERIENCE',
  'CONTACT',
] as const;

/** Panel titles per stop (index 0 unused — the street has no panel). */
export const PANEL_TITLES = [
  '',
  'About Me',
  'The Stack',
  'Projects',
  'Experience',
  'Get In Touch',
] as const;

/** Handwritten kicker line above each panel title. */
export const PANEL_KICKERS = [
  '',
  'from the specials board',
  'off the chalkboard',
  'fresh in the window',
  'as seen on the street sign',
  'the neon is on',
] as const;
