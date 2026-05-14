import { describe, it, expect } from 'vitest';
import {
  FREE_LIMITS,
  PRO_LIMITS,
  isWithinFreeLimit,
  isWithinProLimit,
  limitUsagePercent,
} from '../utils/limits';

describe('isWithinFreeLimit', () => {
  it('allows file exactly at the limit', () => {
    expect(isWithinFreeLimit('image', FREE_LIMITS.image)).toBe(true);
  });

  it('rejects file one byte over the limit', () => {
    expect(isWithinFreeLimit('image', FREE_LIMITS.image + 1)).toBe(false);
  });

  it('allows zero-byte file', () => {
    expect(isWithinFreeLimit('pdf', 0)).toBe(true);
  });

  it('enforces PDF 50 MB limit', () => {
    expect(isWithinFreeLimit('pdf', 50 * 1024 * 1024)).toBe(true);
    expect(isWithinFreeLimit('pdf', 50 * 1024 * 1024 + 1)).toBe(false);
  });

  it('enforces video 200 MB limit', () => {
    expect(isWithinFreeLimit('video', 200 * 1024 * 1024)).toBe(true);
    expect(isWithinFreeLimit('video', 200 * 1024 * 1024 + 1)).toBe(false);
  });

  it('enforces document 10 MB limit', () => {
    expect(isWithinFreeLimit('document', 10 * 1024 * 1024)).toBe(true);
    expect(isWithinFreeLimit('document', 10 * 1024 * 1024 + 1)).toBe(false);
  });
});

describe('isWithinProLimit', () => {
  it('allows file within Pro limit that exceeds Free limit', () => {
    // 100 MB image — over free (20 MB), under pro (200 MB)
    expect(isWithinFreeLimit('image', 100 * 1024 * 1024)).toBe(false);
    expect(isWithinProLimit('image', 100 * 1024 * 1024)).toBe(true);
  });

  it('rejects file beyond Pro limit', () => {
    expect(isWithinProLimit('image', PRO_LIMITS.image + 1)).toBe(false);
  });
});

describe('limitUsagePercent', () => {
  it('returns 0 for empty file', () => {
    expect(limitUsagePercent('image', 0)).toBe(0);
  });

  it('returns 50 for half the limit', () => {
    expect(limitUsagePercent('image', FREE_LIMITS.image / 2)).toBe(50);
  });

  it('returns 100 for file at the limit', () => {
    expect(limitUsagePercent('image', FREE_LIMITS.image)).toBe(100);
  });

  it('caps at 100 for oversized files', () => {
    expect(limitUsagePercent('image', FREE_LIMITS.image * 5)).toBe(100);
  });
});
