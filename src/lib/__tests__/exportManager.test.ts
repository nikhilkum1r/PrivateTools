import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ExportManager } from '../export-manager';

// ── Mocks ─────────────────────────────────────────────────────────────────
const mockAnchorClick = vi.fn();
const mockAppendChild = vi.fn();
const mockRemoveChild = vi.fn();

beforeEach(() => {
  // Mock DOM methods used in ExportManager
  vi.spyOn(document.body, 'appendChild').mockImplementation(mockAppendChild);
  vi.spyOn(document.body, 'removeChild').mockImplementation(mockRemoveChild);
  vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
    if (tag === 'a') {
      return { href: '', download: '', style: { display: '' }, click: mockAnchorClick } as any;
    }
    return document.createElement(tag);
  });

  // Mock URL APIs
  global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
  global.URL.revokeObjectURL = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
  mockAnchorClick.mockClear();
  mockAppendChild.mockClear();
  mockRemoveChild.mockClear();
});

// ── downloadFile ──────────────────────────────────────────────────────────
describe('ExportManager.downloadFile', () => {
  it('creates an object URL and clicks the anchor', async () => {
    const blob = new Blob(['hello world'], { type: 'text/plain' });
    await ExportManager.downloadFile(blob, 'test.txt', { showToast: false });

    expect(URL.createObjectURL).toHaveBeenCalledWith(blob);
    expect(mockAnchorClick).toHaveBeenCalledTimes(1);
  });

  it('uses the provided filename', async () => {
    const blob = new Blob(['data'], { type: 'text/plain' });
    const anchor: any = { href: '', download: '', style: { display: '' }, click: mockAnchorClick };
    vi.spyOn(document, 'createElement').mockReturnValueOnce(anchor);

    await ExportManager.downloadFile(blob, 'my-file.png', { showToast: false });
    expect(anchor.download).toBe('my-file.png');
  });
});

// ── copyText ─────────────────────────────────────────────────────────────
describe('ExportManager.copyText', () => {
  it('calls clipboard.writeText with the correct string', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    await ExportManager.copyText('hello clipboard', { showToast: false });
    expect(writeText).toHaveBeenCalledWith('hello clipboard');
  });
});

// ── shareFile ─────────────────────────────────────────────────────────────
describe('ExportManager.shareFile', () => {
  it('returns false when Web Share API is not available', async () => {
    // Remove share API
    const origShare = navigator.share;
    const origCanShare = navigator.canShare;
    Object.defineProperty(navigator, 'share', { value: undefined, configurable: true });
    Object.defineProperty(navigator, 'canShare', { value: undefined, configurable: true });

    const blob = new Blob(['data'], { type: 'image/png' });
    const result = await ExportManager.shareFile(blob, 'test.png', 'Test', { showToast: false });
    expect(result).toBe(false);

    Object.defineProperty(navigator, 'share', { value: origShare, configurable: true });
    Object.defineProperty(navigator, 'canShare', { value: origCanShare, configurable: true });
  });

  it('returns true when share succeeds', async () => {
    const mockShare = vi.fn().mockResolvedValue(undefined);
    const mockCanShare = vi.fn().mockReturnValue(true);
    Object.defineProperty(navigator, 'share', { value: mockShare, configurable: true });
    Object.defineProperty(navigator, 'canShare', { value: mockCanShare, configurable: true });

    const blob = new Blob(['data'], { type: 'image/png' });
    const result = await ExportManager.shareFile(blob, 'test.png', undefined, { showToast: false });
    expect(result).toBe(true);
    expect(mockShare).toHaveBeenCalledTimes(1);
  });

  it('returns false when user cancels (AbortError)', async () => {
    const abortError = new DOMException('Aborted', 'AbortError');
    const mockShare = vi.fn().mockRejectedValue(abortError);
    const mockCanShare = vi.fn().mockReturnValue(true);
    Object.defineProperty(navigator, 'share', { value: mockShare, configurable: true });
    Object.defineProperty(navigator, 'canShare', { value: mockCanShare, configurable: true });

    const blob = new Blob(['data'], { type: 'image/png' });
    const result = await ExportManager.shareFile(blob, 'test.png', undefined, { showToast: false });
    expect(result).toBe(false);
  });
});
