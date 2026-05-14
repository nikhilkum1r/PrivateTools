import { describe, it, expect } from 'vitest';
import {
  formatBytes,
  bytesToMB,
  bytesToKB,
  mbToBytes,
  formatSavings,
} from '../utils/fileSize';

describe('formatBytes', () => {
  it('returns "0 B" for 0 bytes', () => {
    expect(formatBytes(0)).toBe('0 B');
  });

  it('formats bytes correctly', () => {
    expect(formatBytes(512)).toBe('512 B');
  });

  it('formats kilobytes correctly', () => {
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(2048)).toBe('2 KB');
  });

  it('formats megabytes correctly', () => {
    expect(formatBytes(1024 * 1024)).toBe('1 MB');
    expect(formatBytes(10 * 1024 * 1024)).toBe('10 MB');
  });

  it('formats gigabytes correctly', () => {
    expect(formatBytes(1024 ** 3)).toBe('1 GB');
  });

  it('formats terabytes correctly', () => {
    expect(formatBytes(1024 ** 4)).toBe('1 TB');
  });

  it('respects decimal places', () => {
    // parseFloat strips trailing zeros — '1.50' → '1.5'
    expect(formatBytes(1536, 2)).toBe('1.5 KB');
    expect(formatBytes(1536, 0)).toBe('2 KB');
  });
});

describe('bytesToMB', () => {
  it('converts bytes to MB correctly', () => {
    expect(bytesToMB(1024 * 1024)).toBe(1);
    expect(bytesToMB(5 * 1024 * 1024)).toBe(5);
  });

  it('returns fractional MB', () => {
    expect(bytesToMB(512 * 1024)).toBe(0.5);
  });
});

describe('bytesToKB', () => {
  it('converts bytes to KB correctly', () => {
    expect(bytesToKB(1024)).toBe(1);
    expect(bytesToKB(2048)).toBe(2);
  });
});

describe('mbToBytes', () => {
  it('converts MB to bytes correctly', () => {
    expect(mbToBytes(1)).toBe(1024 * 1024);
    expect(mbToBytes(10)).toBe(10 * 1024 * 1024);
  });
});

describe('formatSavings', () => {
  it('returns empty string when input is 0', () => {
    expect(formatSavings(0, 0)).toBe('');
  });

  it('returns savings with percentage when output is smaller', () => {
    const result = formatSavings(1024 * 1024, 512 * 1024); // 512 KB saved (50%)
    expect(result).toContain('Saved');
    expect(result).toContain('50%');
  });

  it('returns "+X larger" when output is bigger', () => {
    const result = formatSavings(512 * 1024, 1024 * 1024);
    expect(result).toContain('+');
    expect(result).toContain('larger');
  });

  it('handles equal sizes — treated as +0 larger by implementation', () => {
    const result = formatSavings(1024, 1024);
    // saved = 0, which is <= 0, so implementation returns "+0 B larger"
    expect(result).toContain('larger');
    expect(result).toContain('0 B');
  });
});
