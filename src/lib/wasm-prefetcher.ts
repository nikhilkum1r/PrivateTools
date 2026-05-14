/**
 * Intelligent WASM prefetcher for SafeTools.
 * Gates prefetching behind Network Information API to avoid
 * burning bandwidth on slow-2g / data-saver connections.
 */

/**
 * Returns false on slow or data-saver connections, true otherwise.
 * Safe to call on server (returns true to be conservative).
 */
export function shouldPrefetch(): boolean {
  if (typeof navigator === 'undefined') return true;
  if (!navigator.onLine) return false;

  const conn = (navigator as any).connection;
  if (!conn) return true; // API not available — optimistic

  if (conn.saveData === true) return false;
  if (['slow-2g', '2g'].includes(conn.effectiveType)) return false;

  return true;
}

export function prefetchWasm(type: 'ffmpeg' | 'pdf' | 'docx' | 'pptx') {
  if (typeof window === 'undefined') return;
  if (!shouldPrefetch()) return; // Don't burn data on slow connections

  const urls: Record<string, string[]> = {
    ffmpeg: ['/lib/ffmpeg/ffmpeg-core.wasm', '/lib/ffmpeg/ffmpeg-core.js'],
    pdf: ['/lib/pdfjs/pdf.worker.min.mjs'],
    docx: [], // Mammoth is pure JS
    pptx: [], // handled by pptx2html-turbo
  };

  const assets = urls[type];
  if (!assets?.length) return;

  assets.forEach(url => {
    // Avoid duplicate prefetch hints
    if (document.querySelector(`link[rel="prefetch"][href="${url}"]`)) return;

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    if (url.endsWith('.wasm')) link.as = 'fetch';
    else if (url.endsWith('.js') || url.endsWith('.mjs')) link.as = 'script';

    document.head.appendChild(link);
  });
}

/**
 * Hook or utility to prefetch on hover.
 * Skips prefetch automatically on slow networks.
 */
export function useWasmPrefetch() {
  return {
    prefetch: (type: 'ffmpeg' | 'pdf' | 'docx' | 'pptx') => {
      // Delay slightly to ensure it's an intentional hover
      setTimeout(() => prefetchWasm(type), 50);
    },
    shouldPrefetch,
  };
}
