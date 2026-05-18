// ─── Background Removal Worker ───────────────────────────────────────────────
// Uses @imgly/background-removal (ONNX) or TensorFlow.js (BodyPix).
// Dual-engine approach for quality vs speed.

import { removeBackground, type Config } from "@imgly/background-removal";
import * as tf from "@tensorflow/tfjs";
import * as bodyPix from "@tensorflow-models/body-pix";

// ── Shared State ─────────────────────────────────────────────────────────────
let bodyPixNet: bodyPix.BodyPix | null = null;

// ── Message router ────────────────────────────────────────────────────────────
self.onmessage = async (event: MessageEvent) => {
  const { type, imageDataURL, loadingLabel, removingLabel, engine = "onnx" } = event.data;

  if (type === "process") {
    if (engine === "onnx") {
      await processImageONNX(
        imageDataURL as string,
        loadingLabel as string,
        removingLabel as string
      );
    } else {
      await processImageTFJS(
        imageDataURL as string,
        loadingLabel as string,
        removingLabel as string
      );
    }
  }
};

// ── ONNX Processing (@imgly/background-removal) ──────────────────────────────
async function processImageONNX(
  imageDataURL: string,
  loadingLabel: string,
  removingLabel: string
) {
  try {
    self.postMessage({ type: "status", message: loadingLabel });

    const config: Config = {
      // Industry Standard: Use CDN for large model assets to keep repository lean
      // while maintaining integrated local-processing capabilities.
      publicPath: "https://cdn.jsdelivr.net/npm/@imgly/background-removal-data@1.4.5/dist/",
      progress: (key: string, current: number, total: number) => {
        // Fallback for CDNs that don't provide content-length (total)
        const pct = (total && total > 0) ? Math.round((current / total) * 100) : 0;
        if (current % 5 === 0) { // Throttle logs
          console.log(`[RemoveBg Worker] Progress (${key}): ${current}/${total} (${pct}%)`);
        }
        self.postMessage({
          type: "progress",
          key,
          current,
          total,
          pct,
        });
      },
      model: "isnet_fp16", 
      output: {
        format: "image/png",
        quality: 1.0,
      },
    };

    console.log("[RemoveBg Worker] Starting ONNX with config:", config);
    // Switch to removing label once model is ready
    self.postMessage({ type: "status", message: removingLabel });
    
    const blob = await removeBackground(imageDataURL, config);
    console.log("[RemoveBg Worker] ONNX Success, blob size:", blob.size);
    const arrayBuffer = await blob.arrayBuffer();

    self.postMessage(
      { type: "result", buffer: arrayBuffer, mimeType: "image/png" },
      { transfer: [arrayBuffer] }
    );
  } catch (err: any) {
    console.error(`[RemoveBg Worker] ONNX Critical Failure:`, err);
    self.postMessage({
      type: "error",
      error: `Neural Engine Failure: ${err?.message || "Check network connectivity for AI assets"}.`,
    });
  }
}

// ── TF.js Processing (BodyPix) ───────────────────────────────────────────────
async function processImageTFJS(
  imageDataURL: string,
  loadingLabel: string,
  removingLabel: string
) {
  try {
    self.postMessage({ type: "status", message: loadingLabel });
    self.postMessage({ type: "progress", pct: 10 });

    // Load BodyPix if not already loaded
    if (!bodyPixNet) {
      // Initialize TF.js
      await tf.ready();
      bodyPixNet = await bodyPix.load({
        architecture: 'MobileNetV1',
        outputStride: 16,
        multiplier: 0.75,
        quantBytes: 2
      });
    }

    self.postMessage({ type: "progress", pct: 40 });
    self.postMessage({ type: "status", message: removingLabel });

    // Load image into a canvas-like object
    const img = await loadImage(imageDataURL);
    
    self.postMessage({ type: "progress", pct: 60 });

    // Industry Standard: Convert ImageBitmap to Tensor for worker compatibility
    const tensor = tf.browser.fromPixels(img);

    // Segment person
    const segmentation = await bodyPixNet.segmentPerson(tensor, {
      internalResolution: 'medium',
      segmentationThreshold: 0.7,
      maxDetections: 1,
      scoreThreshold: 0.3,
      nmsRadius: 20,
    });

    // Cleanup tensor
    tensor.dispose();

    self.postMessage({ type: "progress", pct: 80 });

    // Create result canvas
    const canvas = new OffscreenCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    const pixelData = imageData.data;

    for (let i = 0; i < segmentation.data.length; i++) {
      if (segmentation.data[i] === 0) {
        // If not part of person, set alpha to 0
        pixelData[i * 4 + 3] = 0;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    const blob = await canvas.convertToBlob({ type: "image/png" });
    const arrayBuffer = await blob.arrayBuffer();

    self.postMessage({ type: "progress", pct: 100 });
    self.postMessage(
      { type: "result", buffer: arrayBuffer, mimeType: "image/png" },
      { transfer: [arrayBuffer] }
    );

  } catch (err: any) {
    console.error(`[RemoveBg Worker] TFJS Failed:`, err);
    self.postMessage({
      type: "error",
      error: `TFJS Engine Error: ${err?.message || "Unknown error"}.`,
    });
  }
}

// ── Helper ───────────────────────────────────────────────────────────────────
async function loadImage(url: string): Promise<ImageBitmap> {
  const response = await fetch(url);
  const blob = await response.blob();
  return createImageBitmap(blob);
}

