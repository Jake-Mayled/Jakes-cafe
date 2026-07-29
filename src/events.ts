import type { CafeProgressDetail, CafeSectionDetail } from './types';

export const CAFE_PROGRESS = 'cafe:progress';
export const CAFE_READY = 'cafe:ready';
export const CAFE_SECTION = 'cafe:section';

export function emitProgress(detail: CafeProgressDetail): void {
  window.dispatchEvent(new CustomEvent(CAFE_PROGRESS, { detail }));
}

export function emitReady(): void {
  window.dispatchEvent(new CustomEvent(CAFE_READY, { detail: {} }));
}

export function emitSection(detail: CafeSectionDetail): void {
  window.dispatchEvent(new CustomEvent(CAFE_SECTION, { detail }));
}
