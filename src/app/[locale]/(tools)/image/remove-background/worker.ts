// ─── Background Removal Worker ───────────────────────────────────────────────
// Uses @imgly/background-removal which bundles ONNX models via CDN.
// Falls back through multiple CDN endpoints for reliability.

import { removeBackground, type Config } from "@imgly/background-removal";

// ── Message router ────────────────────────────────────────────────────────────
self.onmessage = async (event: MessageEvent) => {
  const { type, imageDataURL, loadingLabel, removingLabel } = event.data;

  if (type === "process") {
    await processImage(
      imageDataURL as string,
      loadingLabel as string,
      removingLabel as string
    );
  }
};

// ── Processing ────────────────────────────────────────────────────────────────
async function processImage(
  imageDataURL: string,
  loadingLabel: string,
  removingLabel: string
) {
  // CDN paths in order of preference (no local path since ONNX stubs are incomplete)
  const publicPaths = [
    "https://staticimgly.com/@imgly/background-removal-data/1.7.0/dist/",
    "https://unpkg.com/@imgly/background-removal-data@1.7.0/dist/",
    "https://cdn.jsdelivr.net/npm/@imgly/background-removal-data@1.7.0/dist/",
  ];

  let lastError: any = null;

  for (const publicPath of publicPaths) {
    try {
      self.postMessage({ type: "status", message: loadingLabel });

      const config: Config = {
        publicPath,
        progress: (key: string, current: number, total: number) => {
          const pct = total > 0 ? Math.round((current / total) * 100) : 0;
          self.postMessage({
            type: "progress",
            key,
            current,
            total,
            pct,
          });
        },
        model: "isnet_quint8",
        output: {
          format: "image/png",
          quality: 1.0,
        },
      };

      self.postMessage({ type: "status", message: removingLabel });

      const blob = await removeBackground(imageDataURL, config);

      // Send the result blob back as an ArrayBuffer so it can be transferred
      const arrayBuffer = await blob.arrayBuffer();

      self.postMessage(
        { type: "result", buffer: arrayBuffer, mimeType: "image/png" },
        { transfer: [arrayBuffer] }
      );

      // If successful, return early
      return;
    } catch (err: any) {
      console.error(`[RemoveBg Worker] Failed with path ${publicPath}:`, err);
      lastError = err;
      // Continue to next CDN path
    }
  }

  // If all paths fail, send error
  self.postMessage({
    type: "error",
    error: `AI model fetch failed after trying all CDN sources. ${
      lastError?.message || "Unknown error"
    }. Check your internet connection and try again.`,
  });
}
