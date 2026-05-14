import { describe, it, expect, vi, beforeEach } from 'vitest';
import { detectMimeType, isImageMime, isVideoMime, isAudioMime, isPdfMime } from '../utils/mimeDetect';

// Helper: create a File with given bytes as content
function makeFile(bytes: number[], name: string, type = ''): File {
  const uint8 = new Uint8Array(bytes);
  return new File([uint8], name, { type });
}

describe('detectMimeType — magic byte detection', () => {
  it('detects JPEG by magic bytes', async () => {
    const file = makeFile([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10], 'test.jpg');
    expect(await detectMimeType(file)).toBe('image/jpeg');
  });

  it('detects PNG by magic bytes', async () => {
    const file = makeFile([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A], 'test.png');
    expect(await detectMimeType(file)).toBe('image/png');
  });

  it('detects GIF by magic bytes', async () => {
    const file = makeFile([0x47, 0x49, 0x46, 0x38, 0x39, 0x61], 'test.gif');
    expect(await detectMimeType(file)).toBe('image/gif');
  });

  it('detects PDF by magic bytes', async () => {
    const file = makeFile([0x25, 0x50, 0x44, 0x46, 0x2D], 'test.pdf');
    expect(await detectMimeType(file)).toBe('application/pdf');
  });

  it('detects WebP from RIFF container', async () => {
    // RIFF....WEBP
    const bytes = [
      0x52, 0x49, 0x46, 0x46, // RIFF
      0x00, 0x00, 0x00, 0x00, // file size placeholder
      0x57, 0x45, 0x42, 0x50, // WEBP
    ];
    const file = makeFile(bytes, 'test.webp');
    expect(await detectMimeType(file)).toBe('image/webp');
  });

  it('detects WAV from RIFF container', async () => {
    const bytes = [
      0x52, 0x49, 0x46, 0x46, // RIFF
      0x00, 0x00, 0x00, 0x00, // file size placeholder
      0x57, 0x41, 0x56, 0x45, // WAVE
    ];
    const file = makeFile(bytes, 'test.wav');
    expect(await detectMimeType(file)).toBe('audio/wav');
  });

  it('detects ZIP by magic bytes', async () => {
    const file = makeFile([0x50, 0x4B, 0x03, 0x04], 'test.zip');
    expect(await detectMimeType(file)).toBe('application/zip');
  });
});

describe('detectMimeType — fallback to file.type', () => {
  it('falls back to file.type when no magic match', async () => {
    // Use bytes that don't match any known signature
    const file = makeFile([0x01, 0x02, 0x03], 'test.txt', 'text/plain');
    const result = await detectMimeType(file);
    expect(result).toBe('text/plain');
  });
});

describe('detectMimeType — extension fallback', () => {
  it('falls back to extension map when file.type is empty', async () => {
    const file = makeFile([0x00], 'test.mp3', '');
    const result = await detectMimeType(file);
    // No magic match for 0x00, file.type is empty, falls back to extension
    expect(result).toBe('audio/mpeg');
  });

  it('returns octet-stream for unknown extension', async () => {
    const file = makeFile([0x00], 'test.xyz', '');
    const result = await detectMimeType(file);
    expect(result).toBe('application/octet-stream');
  });
});

describe('MIME type category helpers', () => {
  it('isImageMime returns true for image types', () => {
    expect(isImageMime('image/jpeg')).toBe(true);
    expect(isImageMime('image/png')).toBe(true);
    expect(isImageMime('video/mp4')).toBe(false);
  });

  it('isVideoMime returns true for video types', () => {
    expect(isVideoMime('video/mp4')).toBe(true);
    expect(isVideoMime('video/webm')).toBe(true);
    expect(isVideoMime('audio/mp3')).toBe(false);
  });

  it('isAudioMime returns true for audio types', () => {
    expect(isAudioMime('audio/mpeg')).toBe(true);
    expect(isAudioMime('audio/wav')).toBe(true);
    expect(isAudioMime('image/png')).toBe(false);
  });

  it('isPdfMime returns true only for PDF', () => {
    expect(isPdfMime('application/pdf')).toBe(true);
    expect(isPdfMime('application/zip')).toBe(false);
    expect(isPdfMime('image/png')).toBe(false);
  });
});
