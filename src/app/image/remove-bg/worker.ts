// ─── Background Removal Worker ───────────────────────────────────────────────
// Uses @imgly/background-removal which bundles its own ONNX models and handles
// CORS, WASM, and model fetching without any huggingface dependency issues.

import { removeBackground, type Config } from "@imgly/background-removal";

// ── Message router ────────────────────────────────────────────────────────────
self.onmessage = async (event: MessageEvent) => {
  const { type, imageDataURL } = event.data;

  if (type === "process") {
    await processImage(imageDataURL as string);
  }
};

// ── Processing ────────────────────────────────────────────────────────────────
async function processImage(imageDataURL: string) {
  try {
    self.postMessage({ type: "status", message: "Loading AI model…" });

    const config: Config = {
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
      // Use the official IMG.LY data CDN for version 1.7.0
      publicPath: "https://staticimgly.com/@imgly/background-removal-data/1.7.0/dist/",
      model: "isnet_quint8", // quint8 is smaller (~17MB) and faster for browser use
      fetchArgs: {
        mode: "cors",
      },
      output: {
        format: "image/png",
        quality: 1.0,
      },
    };

    self.postMessage({ type: "status", message: "Removing background…" });

    const blob = await removeBackground(imageDataURL, config);

    // Send the result blob back as an ArrayBuffer so it can be transferred
    const arrayBuffer = await blob.arrayBuffer();

    self.postMessage(
      { type: "result", buffer: arrayBuffer, mimeType: "image/png" },
      { transfer: [arrayBuffer] }
    );
  } catch (err: any) {
    console.error("[RemoveBg Worker] Error:", err);
    self.postMessage({
      type: "error",
      error: err?.message ?? "Unknown error during background removal.",
    });
  }
}
