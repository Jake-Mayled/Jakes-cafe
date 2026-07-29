import { describe, expect, test } from 'vitest';
import { clamp, smoothstep } from './math';

describe('clamp', () => {
  test('returns the value when inside the range', () => {
    expect(clamp(0.5, 0, 1)).toBe(0.5);
  });

  test('clamps below the minimum', () => {
    expect(clamp(-3, 0, 1)).toBe(0);
  });

  test('clamps above the maximum', () => {
    expect(clamp(7, 0, 1)).toBe(1);
  });
});

describe('smoothstep', () => {
  test('is 0 at the start and 1 at the end', () => {
    expect(smoothstep(0)).toBe(0);
    expect(smoothstep(1)).toBe(1);
  });

  test('is 0.5 at the midpoint', () => {
    expect(smoothstep(0.5)).toBe(0.5);
  });

  test('eases in (slower than linear near the start)', () => {
    expect(smoothstep(0.1)).toBeLessThan(0.1);
  });

  test('eases out (faster than linear near the end)', () => {
    expect(smoothstep(0.9)).toBeGreaterThan(0.9);
  });
});
