import * as THREE from 'three';

/** Draws onto a 2D canvas context sized w × h. */
export type Painter = (ctx: CanvasRenderingContext2D, w: number, h: number) => void;

function paintCanvas(width: number, height: number, painter: Painter): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('2D canvas context is unavailable — cannot paint scene textures.');
  }
  painter(ctx, width, height);
  return canvas;
}

function toTexture(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/** Paint a one-off canvas texture. */
export function makeTexture(width: number, height: number, painter: Painter): THREE.CanvasTexture {
  return toTexture(paintCanvas(width, height, painter));
}

/** A canvas texture that can be repainted at runtime (fascia name, neon colour). */
export class DynamicTexture {
  readonly texture: THREE.CanvasTexture;
  private readonly canvas: HTMLCanvasElement;

  constructor(width: number, height: number, painter: Painter) {
    this.canvas = paintCanvas(width, height, painter);
    this.texture = toTexture(this.canvas);
  }

  repaint(painter: Painter): void {
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      throw new Error('2D canvas context is unavailable — cannot repaint texture.');
    }
    painter(ctx, this.canvas.width, this.canvas.height);
    this.texture.needsUpdate = true;
  }
}
