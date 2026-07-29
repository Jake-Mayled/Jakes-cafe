/** Clamp `value` into the inclusive range [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Smoothstep easing over t ∈ [0, 1]. */
export function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}
