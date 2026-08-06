/**
 * Procedural canvas painters — every surface in the scene (bricks, boards,
 * signs, sky) is drawn at runtime; no external image assets are used.
 */
import type { Painter } from './textures';

const F = 'Archivo, Helvetica, sans-serif';
const FH = 'Caveat, cursive';

export function paintFascia(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  name: string,
): void {
  ctx.fillStyle = '#241a17';
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = '#c8a24a';
  ctx.lineWidth = 10;
  ctx.strokeRect(14, 14, w - 28, h - 28);
  ctx.fillStyle = '#f3e6cf';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `700 ${h * 0.4}px ${F}`;
  ctx.shadowColor = '#ffb56b';
  ctx.shadowBlur = 30;
  ctx.fillText(name.toUpperCase(), w / 2, h * 0.42);
  ctx.shadowBlur = 0;
  ctx.font = `500 ${h * 0.14}px ${F}`;
  ctx.fillStyle = '#c8a24a';
  ctx.fillText('COFFEE  ·  CODE  ·  REPEAT', w / 2, h * 0.76);
}

export const paintMenuBoard: Painter = (ctx, w, h) => {
  ctx.fillStyle = '#f3e6cf';
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = '#3a2d26';
  ctx.lineWidth = 14;
  ctx.strokeRect(10, 10, w - 20, h - 20);
  ctx.fillStyle = '#3a2d26';
  ctx.textAlign = 'center';
  ctx.font = `700 ${w * 0.105}px ${F}`;
  ctx.fillText("G'DAY, I'M JAKE", w / 2, h * 0.15);
  ctx.font = `600 ${w * 0.058}px ${F}`;
  ctx.fillStyle = '#a2542f';
  ctx.fillText('JUNIOR FULL-STACK DEV', w / 2, h * 0.235);
  ctx.strokeStyle = '#a2542f';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(w * 0.2, h * 0.29);
  ctx.lineTo(w * 0.8, h * 0.29);
  ctx.stroke();
  const items: readonly [string, string][] = [
    ['Flat White', '4.5'],
    ['Magic', '5.0'],
    ['Long Black', '4.0'],
    ['Lamington', '6.0'],
    ['Vegemite Toastie', '8.5'],
  ];
  ctx.font = `400 ${w * 0.055}px ${F}`;
  ctx.fillStyle = '#3a2d26';
  items.forEach(([itemName, price], i) => {
    const y = h * (0.39 + i * 0.088);
    ctx.textAlign = 'left';
    ctx.fillText(itemName, w * 0.13, y);
    ctx.textAlign = 'right';
    ctx.fillText(price, w * 0.87, y);
  });
  ctx.textAlign = 'center';
  ctx.font = `700 ${w * 0.1}px ${FH}`;
  ctx.fillStyle = '#a2542f';
  ctx.fillText('tap for my story!', w / 2, h * 0.93);
};

export const paintChalkboard: Painter = (ctx, w, h) => {
  ctx.fillStyle = '#22302b';
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = '#5b4632';
  ctx.lineWidth = 18;
  ctx.strokeRect(9, 9, w - 18, h - 18);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#e9e4d6';
  ctx.font = `700 ${w * 0.115}px ${FH}`;
  ctx.fillText("today's stack", w / 2, h * 0.15);
  const rows = [
    'TypeScript · React',
    'Three.js · R3F · Drei',
    'React Native · Expo',
    'Node · Python · SQL',
    'AWS · Vercel · CI/CD',
    'Git · Agentic AI',
  ];
  ctx.font = `400 ${w * 0.062}px ${FH}`;
  rows.forEach((row, i) => {
    ctx.fillText(row, w / 2, h * (0.28 + i * 0.1));
  });
  ctx.fillStyle = '#f0c987';
  ctx.font = `700 ${w * 0.07}px ${FH}`;
  ctx.fillText('~ made fresh daily ~', w / 2, h * 0.93);
};

export const paintDragBoard: Painter = (ctx, w, h) => {
  ctx.fillStyle = '#22302b';
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = '#5b4632';
  ctx.lineWidth = 16;
  ctx.strokeRect(8, 8, w - 16, h - 16);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#e9e4d6';
  ctx.font = `700 ${w * 0.135}px ${FH}`;
  ctx.fillText('click & drag', w / 2, h * 0.28);
  ctx.fillText('to look around', w / 2, h * 0.45);
  ctx.fillStyle = '#f0c987';
  ctx.font = `600 ${w * 0.105}px ${FH}`;
  ctx.fillText('scroll to zoom', w / 2, h * 0.66);
  ctx.fillText('tap a sign above!', w / 2, h * 0.84);
};

export function paintPoster(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  bg: string,
  fg: string,
  title: string,
  sub: string,
): void {
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = fg;
  ctx.lineWidth = 8;
  ctx.strokeRect(16, 16, w - 32, h - 32);
  ctx.fillStyle = fg;
  ctx.textAlign = 'center';
  ctx.font = `700 ${w * 0.125}px ${F}`;
  title.split('\n').forEach((line, i) => {
    ctx.fillText(line, w / 2, h * 0.3 + i * w * 0.15);
  });
  ctx.font = `500 ${w * 0.06}px ${F}`;
  ctx.globalAlpha = 0.85;
  ctx.fillText(sub, w / 2, h * 0.72);
  ctx.globalAlpha = 1;
  ctx.font = `700 ${w * 0.05}px ${F}`;
  ctx.fillText('★  PROJECT  ★', w / 2, h * 0.87);
}

export function paintStreetSign(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  text: string,
): void {
  ctx.fillStyle = '#1c5c3c';
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = '#f3efe4';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, w - 16, h - 16);
  ctx.fillStyle = '#f3efe4';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `700 ${h * 0.36}px ${F}`;
  ctx.fillText(text, w / 2, h / 2 + 2);
}

export function paintNeon(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  text: string,
  color: string,
): void {
  ctx.clearRect(0, 0, w, h);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `700 ${h * 0.5}px ${FH}`;
  ctx.shadowColor = color;
  ctx.shadowBlur = 40;
  ctx.strokeStyle = color;
  ctx.lineWidth = 6;
  ctx.strokeText(text, w / 2, h / 2);
  ctx.shadowBlur = 14;
  ctx.strokeStyle = '#fff8f0';
  ctx.lineWidth = 2.5;
  ctx.strokeText(text, w / 2, h / 2);
}

/** Arrow-shaped direction sign; `dir` +1 points right, −1 points left. */
export function paintArrowSign(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  text: string,
  bg: string,
  fg: string,
  dir: 1 | -1,
): void {
  const tip = w * 0.12;
  ctx.save();
  if (dir < 0) {
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
  }
  ctx.beginPath();
  ctx.moveTo(6, 6);
  ctx.lineTo(w - tip, 6);
  ctx.lineTo(w - 6, h / 2);
  ctx.lineTo(w - tip, h - 6);
  ctx.lineTo(6, h - 6);
  ctx.closePath();
  ctx.fillStyle = bg;
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#241a17';
  ctx.stroke();
  ctx.restore();
  ctx.fillStyle = fg;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `700 ${h * 0.42}px ${F}`;
  ctx.fillText(text, w / 2 + (dir > 0 ? -tip * 0.3 : tip * 0.3), h / 2 + 2);
}

export const paintCorrugation: Painter = (ctx, w, h) => {
  for (let x = 0; x < w; x += 16) {
    const g = ctx.createLinearGradient(x, 0, x + 16, 0);
    g.addColorStop(0, '#8c3b2e');
    g.addColorStop(0.5, '#b0523f');
    g.addColorStop(1, '#7d3327');
    ctx.fillStyle = g;
    ctx.fillRect(x, 0, 16, h);
  }
};

export const paintRoofIron: Painter = (ctx, w, h) => {
  for (let x = 0; x < w; x += 16) {
    const g = ctx.createLinearGradient(x, 0, x + 16, 0);
    g.addColorStop(0, '#4d4a48');
    g.addColorStop(0.5, '#6b6663');
    g.addColorStop(1, '#454240');
    ctx.fillStyle = g;
    ctx.fillRect(x, 0, 16, h);
  }
};

export const paintBrick: Painter = (ctx, w, h) => {
  ctx.fillStyle = '#9c6b52';
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = 'rgba(60,38,28,0.5)';
  ctx.lineWidth = 3;
  for (let y = 0; y < h; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
    const off = (y / 32) % 2 ? 32 : 0;
    for (let x = off; x < w; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + 32);
      ctx.stroke();
    }
  }
  for (let i = 0; i < 260; i++) {
    ctx.fillStyle = `rgba(${120 + Math.random() * 60},${70 + Math.random() * 30},${45 + Math.random() * 20},0.25)`;
    ctx.fillRect(Math.random() * w, Math.random() * h, 30, 14);
  }
};

export const paintMural: Painter = (ctx, w, h) => {
  ctx.fillStyle = '#2e4a5c';
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = '#f3e6cf';
  ctx.lineWidth = 6;
  ctx.strokeRect(12, 12, w - 24, h - 24);
  ctx.fillStyle = '#f3e6cf';
  ctx.textAlign = 'center';
  ctx.font = `700 ${h * 0.3}px ${FH}`;
  ctx.fillText('good coffee', w / 2, h * 0.42);
  ctx.fillText('good code', w / 2, h * 0.78);
};

export const paintGroundDisc: Painter = (ctx, w, h) => {
  const cx = w / 2;
  const cy = h / 2;
  const g = ctx.createRadialGradient(cx, cy, 10, cx, cy, w / 2);
  g.addColorStop(0, '#a08f77');
  g.addColorStop(0.5, '#8c7c69');
  g.addColorStop(0.85, '#d3ab82');
  g.addColorStop(1, '#eec49a');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  const lg = ctx.createLinearGradient(0, 0, w, h);
  lg.addColorStop(0, 'rgba(255,180,120,0.18)');
  lg.addColorStop(0.5, 'rgba(0,0,0,0)');
  lg.addColorStop(1, 'rgba(120,170,190,0.15)');
  ctx.fillStyle = lg;
  ctx.fillRect(0, 0, w, h);
};

export const paintSky: Painter = (ctx, w, h) => {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, '#6f9cc4');
  g.addColorStop(0.45, '#d9a58c');
  g.addColorStop(0.62, '#f2a860');
  g.addColorStop(0.78, '#fbd99a');
  g.addColorStop(1, '#f2a860');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
};

export function paintRoad(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  vertical: boolean,
): void {
  ctx.clearRect(0, 0, w, h);
  const g = vertical ? ctx.createLinearGradient(0, 0, 0, h) : ctx.createLinearGradient(0, 0, w, 0);
  g.addColorStop(0, 'rgba(74,68,66,0)');
  g.addColorStop(0.18, 'rgba(74,68,66,1)');
  g.addColorStop(0.82, 'rgba(74,68,66,1)');
  g.addColorStop(1, 'rgba(74,68,66,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = 'rgba(228,222,206,0.8)';
  if (vertical) {
    for (let y = h * 0.14; y < h * 0.86; y += 70) ctx.fillRect(w / 2 - 4, y, 8, 34);
  } else {
    for (let x = w * 0.14; x < w * 0.86; x += 70) ctx.fillRect(x, h / 2 - 4, 34, 8);
  }
}

export const paintDumpsterLabel: Painter = (ctx, w, h) => {
  ctx.fillStyle = '#f3efe4';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#24558c';
  ctx.textAlign = 'center';
  ctx.font = `700 ${h * 0.34}px ${F}`;
  ctx.fillText('J&M WASTE', w / 2, h * 0.45);
  ctx.font = `500 ${h * 0.17}px ${F}`;
  ctx.fillText('service is our business', w / 2, h * 0.75);
};
