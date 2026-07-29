# Jake's Cafe ☕

**Jake's Cafe** — the interactive 3D portfolio of Jake Mayled, junior full-stack developer.

A procedurally built Three.js streetscape: a corner cafe on Developer Ln & Long Black St, with
clickable street signs that fly the camera between portfolio sections. Every texture — bricks,
chalkboards, neon, the sunrise sky — is painted at runtime on canvas; the site ships **zero
image or 3D model assets**.

## Experience

- **Loader** — a brewing coffee cup with a progress bar, then _STEP INSIDE →_.
- **The street** — orbit, zoom, and explore the cafe. A magpie bobs on the awning, string
  lights pulse, and ambient audio (brown-noise street rumble, a warm chord pad, bird chirps)
  plays via the Web Audio API — no audio files either.
- **Six stops** — STREET · ABOUT · SKILLS · PROJECTS · EXPERIENCE · CONTACT. Navigate via the
  bottom pills or by tapping the arrow signs on the traffic-light pole. Each stop flies the
  camera to a matching scene prop (menu board, chalkboard, window posters, blade signs, neon)
  and slides in a content panel.
- **Flat version** — a fully accessible, scrollable text version of the whole portfolio, one
  click away at all times.

## Tech stack

- **Build** — [Vite](https://vitejs.dev) + TypeScript (strict, `noUncheckedIndexedAccess`,
  `exactOptionalPropertyTypes`)
- **3D** — [Three.js](https://threejs.org) 0.160: WebGL, PCF soft shadows, ACES tone mapping
- **UI** — [React](https://react.dev) 19 overlay components over a tiny immutable store
  (bridged via `useSyncExternalStore`); the 3D scene stays a framework-free web component
- **Audio** — raw Web Audio API
- **Quality** — ESLint (`strictTypeChecked` + `stylisticTypeChecked`), Prettier, Vitest

## Getting started

```bash
npm install
npm run dev       # start the dev server
```

### Scripts

| Script                  | What it does                                 |
| ----------------------- | -------------------------------------------- |
| `npm run dev`           | Vite dev server with HMR                     |
| `npm run build`         | Typecheck + production build to `dist/`      |
| `npm run preview`       | Serve the production build locally           |
| `npm run typecheck`     | TypeScript project check                     |
| `npm run lint`          | ESLint (type-aware, zero warnings tolerated) |
| `npm run format`        | Prettier write                               |
| `npm test`              | Vitest unit tests                            |
| `npm run test:coverage` | Tests with V8 coverage                       |

## Project structure

```text
src/
├── main.tsx                 # entry: mounts <App /> with React
├── App.tsx                  # app shell: owns store, ambience, scene ref, actions
├── config.ts                # cafe name + neon colour options
├── types.ts                 # shared types (views, sections, scene API, events)
├── events.ts                # typed cafe:progress / cafe:ready / cafe:section events
├── data/
│   └── portfolio.ts         # all copy: skills, projects, jobs, education, contact
├── scene/
│   ├── CafeSceneElement.ts  # <cafe-scene> web component: camera tweens, raycasting, loop
│   ├── painters.ts          # procedural canvas painters for every texture
│   ├── textures.ts          # CanvasTexture helpers (incl. repaintable DynamicTexture)
│   ├── helpers.ts           # placement + material + two-sided sign helpers
│   ├── views.ts             # the six camera stops + intro fly-in
│   ├── math.ts              # clamp / smoothstep
│   └── build/               # scene construction, one module per area
│       ├── environment.ts   # sky, sunrise light rig, ground, roads
│       ├── building.ts      # brick shell + full interior
│       ├── exterior.ts      # fascia, awning, furniture, murals, posters, magpie…
│       ├── signPole.ts      # traffic-light pole + clickable arrow signs
│       └── stringLights.ts  # catenary string lights
├── audio/
│   └── ambience.ts          # Web Audio street ambience, chord pad, bird chirps
├── ui/
│   ├── store.ts             # minimal immutable observable store
│   ├── useAppStore.ts       # useSyncExternalStore bridge into React
│   ├── component.ts         # AppActions contract
│   ├── CafeSceneView.tsx    # React wrapper around the <cafe-scene> element
│   ├── Loader.tsx           # loading screen + enter CTA
│   ├── Hud.tsx              # top bar: identity, sound + flat toggles
│   ├── StopsNav.tsx         # bottom pill navigation
│   ├── FlatView.tsx         # accessible flat version
│   └── panel/               # right-hand section panel
│       ├── Panel.tsx        # panel shell + section routing
│       ├── AboutPanel.tsx
│       ├── SkillsPanel.tsx
│       ├── ProjectsPanel.tsx
│       ├── ExperiencePanel.tsx  # experience/education tabs
│       └── ContactPanel.tsx
└── styles/
    └── global.css           # design tokens + all component styles
```

## Design source

Implemented from the ["Jake's Cafe" Claude Design project](https://claude.ai/design/p/a6470357-a316-4671-ace6-34c18a1dd37d)
— camera positions, scene geometry, palette, copy, and behaviour are ported 1:1.

### Configuration

`src/config.ts` exposes the two design options:

- `CAFE_NAME` — the name on the fascia, loader, and flat version (default `Jake's Cafe`)
- `NEON_COLOR` — neon sign colour (`#ff9d5c`, `#ff6fae`, `#3ce0c8`, or `#ffc93c`)

## Contact

Jake Mayled · [jakewmayled@gmail.com](mailto:jakewmayled@gmail.com) ·
[GitHub](https://github.com/Jake-Mayled) ·
[LinkedIn](https://www.linkedin.com/in/jake-mayled-7379351a4)
