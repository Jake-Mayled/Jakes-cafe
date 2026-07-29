/**
 * `<cafe-scene>` — a Three.js web component that renders the whole cafe
 * streetscape procedurally (no external 3D or image assets) and exposes a
 * small imperative API for the UI layer.
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { emitProgress, emitReady, emitSection } from '../events';
import type { CafeSceneApi, CafeSceneOptions, ViewIndex } from '../types';
import { buildBuilding } from './build/building';
import { buildExterior } from './build/exterior';
import { addGround, addLights, addSky } from './build/environment';
import { buildSignPole, type SignEntry } from './build/signPole';
import { buildStringLights, type BulbMesh } from './build/stringLights';
import { clamp, smoothstep } from './math';
import { paintFascia, paintNeon } from './painters';
import { INTRO_VIEW, VIEWS } from './views';

const DEFAULT_OPTIONS: CafeSceneOptions = {
  cafeName: "Jake's Cafe",
  neonColor: '#ff9d5c',
};

const FLY_DURATION_MS = 1500;
const INTRO_FLY_DURATION_MS = 2200;
/** Pointer travel (px) beyond which a pointerup is a drag, not a tap. */
const TAP_SLOP_PX = 6;

interface CameraTween {
  readonly view: ViewIndex;
  readonly startedAt: number;
  readonly duration: number;
  readonly fromPosition: THREE.Vector3;
  readonly toPosition: THREE.Vector3;
  readonly fromTarget: THREE.Vector3;
  readonly toTarget: THREE.Vector3;
}

export class CafeSceneElement extends HTMLElement implements CafeSceneApi {
  private readonly renderer = new THREE.WebGLRenderer({
    antialias: true,
    preserveDrawingBuffer: true,
  });
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(45, 1, 0.1, 160);
  private readonly controls = new OrbitControls(this.camera, this.renderer.domElement);
  private readonly raycaster = new THREE.Raycaster();
  private readonly pointerNdc = new THREE.Vector2();

  private options: CafeSceneOptions = DEFAULT_OPTIONS;
  private entered = false;
  private tween: CameraTween | null = null;
  private hoveredSign: THREE.Group | null = null;
  private pointerDownAt: readonly [number, number] | null = null;
  private started = false;
  private resizeObserver: ResizeObserver | null = null;

  private signEntries: SignEntry[] = [];
  private bulbs: BulbMesh[] = [];
  private handles: ReturnType<typeof buildScene> | null = null;

  connectedCallback(): void {
    if (this.started) return;
    this.started = true;

    this.style.cssText = 'display:block;width:100%;height:100%;overflow:hidden;';
    this.configureRenderer();
    this.configureControls();
    this.scene.fog = new THREE.Fog(0xeec49a, 42, 95);
    this.camera.position.fromArray(INTRO_VIEW.position);
    this.controls.target.fromArray(INTRO_VIEW.target);

    this.handles = buildScene(this.scene, this.options);
    this.signEntries = buildSignPole(this.scene);
    this.bulbs = buildStringLights(this.scene);

    this.appendChild(this.renderer.domElement);
    this.bindPointerEvents();
    this.resize();
    this.resizeObserver = new ResizeObserver(() => {
      this.resize();
    });
    this.resizeObserver.observe(this);

    this.renderer.setAnimationLoop((time) => {
      this.renderFrame(time);
    });
    requestAnimationFrame(() => {
      this.simulateLoad();
    });
  }

  disconnectedCallback(): void {
    this.renderer.setAnimationLoop(null);
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
  }

  // ---- public API -------------------------------------------------------

  enter(): void {
    this.entered = true;
    this.flyTo(0, true);
  }

  goTo(view: ViewIndex): void {
    this.flyTo(view);
  }

  setLock(locked: boolean): void {
    // The flat version fully covers the canvas, so no scene-side lock is
    // needed; kept as part of the API for parity with the design.
    void locked;
  }

  setOptions(options: Partial<CafeSceneOptions>): void {
    this.options = { ...this.options, ...options };
    const { cafeName, neonColor } = this.options;
    if (!this.handles) return;
    this.handles.exterior.fasciaTexture.repaint((c, w, h) => {
      paintFascia(c, w, h, cafeName);
    });
    this.handles.exterior.neonTexture.repaint((c, w, h) => {
      paintNeon(c, w, h, "say g'day", neonColor);
    });
    this.handles.exterior.neonLight.color.set(neonColor);
    this.handles.building.openTexture.repaint((c, w, h) => {
      paintNeon(c, w, h, 'open', neonColor);
    });
  }

  // ---- internals --------------------------------------------------------

  private configureRenderer(): void {
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
  }

  private configureControls(): void {
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.enablePan = false;
    this.controls.minDistance = 3.5;
    this.controls.maxDistance = 32;
    this.controls.maxPolarAngle = 1.48;
    this.controls.minPolarAngle = 0.15;
    this.controls.autoRotate = false;
    this.controls.autoRotateSpeed = 0.5;
    this.controls.addEventListener('start', () => {
      this.controls.autoRotate = false;
      if (!this.tween) emitSection({ section: -1 });
    });
  }

  /**
   * The scene is built synchronously from procedural textures, so there is
   * nothing to actually load; a short simulated progress ramp gives the
   * loader its brewing moment.
   */
  private simulateLoad(): void {
    let pct = 0;
    const tick = (): void => {
      pct = Math.min(100, pct + 3 + Math.random() * 6);
      emitProgress({ pct: Math.floor(pct) });
      if (pct < 100) {
        setTimeout(tick, 45);
      } else {
        emitReady();
      }
    };
    tick();
  }

  private flyTo(view: ViewIndex, slow = false): void {
    const { position, target } = VIEWS[view];
    this.tween = {
      view,
      startedAt: performance.now(),
      duration: slow ? INTRO_FLY_DURATION_MS : FLY_DURATION_MS,
      fromPosition: this.camera.position.clone(),
      toPosition: new THREE.Vector3().fromArray(position),
      fromTarget: this.controls.target.clone(),
      toTarget: new THREE.Vector3().fromArray(target),
    };
    this.controls.enabled = false;
    this.controls.autoRotate = false;
  }

  private pick(event: PointerEvent): SignEntry | null {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointerNdc.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    );
    this.raycaster.setFromCamera(this.pointerNdc, this.camera);
    const meshes = this.signEntries.map((entry) => entry.mesh);
    const hit = this.raycaster.intersectObjects(meshes)[0];
    if (!hit) return null;
    return this.signEntries.find((entry) => entry.mesh === hit.object) ?? null;
  }

  private bindPointerEvents(): void {
    const el = this.renderer.domElement;
    el.addEventListener('pointerdown', (event) => {
      this.pointerDownAt = [event.clientX, event.clientY];
    });
    el.addEventListener('pointerup', (event) => {
      if (!this.entered || !this.pointerDownAt) return;
      const [downX, downY] = this.pointerDownAt;
      const moved = Math.hypot(event.clientX - downX, event.clientY - downY);
      this.pointerDownAt = null;
      if (moved > TAP_SLOP_PX) return;
      const hit = this.pick(event);
      if (hit) this.flyTo(hit.section);
    });
    el.addEventListener('pointermove', (event) => {
      if (!this.entered) return;
      const hit = this.pick(event);
      el.style.cursor = hit ? 'pointer' : 'grab';
      this.hoveredSign = hit?.sign ?? null;
    });
  }

  private resize(): void {
    const width = this.clientWidth || window.innerWidth;
    const height = this.clientHeight || window.innerHeight;
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  private renderFrame(timeMs: number): void {
    const t = timeMs * 0.001;
    if (this.tween) {
      const tween = this.tween;
      const f = clamp((performance.now() - tween.startedAt) / tween.duration, 0, 1);
      const eased = smoothstep(f);
      this.camera.position.lerpVectors(tween.fromPosition, tween.toPosition, eased);
      this.controls.target.lerpVectors(tween.fromTarget, tween.toTarget, eased);
      if (f >= 1) {
        this.tween = null;
        this.controls.enabled = true;
        emitSection({ section: tween.view === 0 ? -1 : tween.view });
      }
    }
    this.controls.update();

    const seen = new Set<THREE.Group>();
    for (const entry of this.signEntries) {
      if (seen.has(entry.sign)) continue;
      seen.add(entry.sign);
      const target = this.hoveredSign === entry.sign ? 1.12 : 1;
      entry.sign.scale.setScalar(entry.sign.scale.x + (target - entry.sign.scale.x) * 0.2);
    }

    const bird = this.handles?.exterior.bird;
    if (bird) {
      bird.group.position.y = 3.34 + Math.abs(Math.sin(t * 1.3)) * 0.008;
      bird.head.rotation.z = Math.sin(t * 0.9) * 0.35;
      bird.beak.rotation.z = bird.head.rotation.z;
    }
    this.bulbs.forEach((bulb, i) => {
      bulb.material.color.setHSL(0.09, 0.65, 0.6 + Math.sin(t * 2 + i * 1.7) * 0.08);
    });

    this.renderer.render(this.scene, this.camera);
  }
}

function buildScene(
  scene: THREE.Scene,
  options: CafeSceneOptions,
): {
  building: ReturnType<typeof buildBuilding>;
  exterior: ReturnType<typeof buildExterior>;
} {
  addSky(scene);
  addLights(scene);
  addGround(scene);
  const building = buildBuilding(scene, options.neonColor);
  const exterior = buildExterior(scene, options.cafeName, options.neonColor);
  return { building, exterior };
}

customElements.define('cafe-scene', CafeSceneElement);

declare global {
  interface HTMLElementTagNameMap {
    'cafe-scene': CafeSceneElement;
  }
}
