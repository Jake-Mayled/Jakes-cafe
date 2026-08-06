# Jake's Cafe

G'day, I'm Jake. A junior full-stack developer with a passion for frontend design and a
serious coffee habit. This is my portfolio.

Step inside my corner cafe on Developer Ln and Long Black St. Every brick,
chalkboard, and neon sign is painted at runtime on canvas, the site ships **zero image or 3D
model assets**. Click the street signs to explore, or grab the camera and look around.

## What's inside

**Loader.** A coffee cup brews while the scene builds behind a progress bar. Hit _STEP
INSIDE_ when it's ready.

**The street.** Orbit, zoom, explore. A magpie bobs on the awning, string lights pulse, and
ambient audio fills the air — brown noise street rumble, warm chords, bird chirps — all
generated through the Web Audio API. No audio files either.

**Six stops.** Navigate with the bottom pills or by tapping the arrow signs on the traffic
light pole. Each stop flies the camera to its spot — the menu board, the chalkboard, the
window posters — and slides in a content panel. About, Skills, Projects, Experience, Contact.

**Flat version.** A scrollable, accessible text version of the full portfolio, one click away.

## Tech stack

- **Build** — [Vite](https://vitejs.dev) + TypeScript (strict, `noUncheckedIndexedAccess`,
  `exactOptionalPropertyTypes`)
- **3D** — [React Three Fiber](https://github.com/pmndrs/react-three-fiber) 9.7 + [Drei](https://github.com/pmndrs/drei) 10.7 on [Three.js](https://threejs.org) 0.160 (WebGL, PCF soft shadows, ACES tone mapping)
- **UI** — [React](https://react.dev) 19 overlay components over an immutable store bridged
  via `useSyncExternalStore`
- **Audio** — raw Web Audio API
- **Quality** — ESLint (`strictTypeChecked` + `stylisticTypeChecked`), Prettier, Vitest

## Getting started

```bash
npm install
npm run dev       # start the dev server
```

### Scripts

| Script                  | What it does                            |
| ----------------------- | --------------------------------------- |
| `npm run dev`           | Vite dev server with HMR                |
| `npm run build`         | Typecheck + production build to `dist/` |
| `npm run preview`       | Serve the production build locally      |
| `npm run typecheck`     | TypeScript project check                |
| `npm run lint`          | ESLint (type-aware)                     |
| `npm run format`        | Prettier write                          |
| `npm test`              | Vitest unit tests                       |
| `npm run test:coverage` | Tests with V8 coverage                  |

## Project structure

```text
src/
├── data/           # portfolio copy and tests
├── scene/          # R3F scene: canvas host, view logic, procedural painters
│   ├── components/ # building, exterior, interior, signs, lights, magpie
│   ├── painters.ts # every texture drawn at runtime on canvas
│   └── textures.ts # canvas texture helpers (DynamicTexture with repaint)
├── audio/          # Web Audio ambience, chord pad, bird chirps
├── ui/             # React overlay: loader, HUD, panels, flat view, store
│   └── panel/      # section panels (about, skills, projects, experience, contact)
└── styles/         # CSS design tokens and component styles
```

### Configuration

`src/config.ts` exposes two design options:

- `CAFE_NAME` — the name on the fascia, loader, and flat version (default `Jake's Cafe`)
- `NEON_COLOR` — neon sign colour (`#ff9d5c`, `#ff6fae`, `#3ce0c8`, or `#ffc93c`)

## Contact

Jake Mayled · [jakewmayled@gmail.com](mailto:jakewmayled@gmail.com) ·
[GitHub](https://github.com/Jake-Mayled) ·
[LinkedIn](https://www.linkedin.com/in/jake-mayled-7379351a4)
