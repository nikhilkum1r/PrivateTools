import { ProcessOptions, ProcessingResult } from "./image/types";
import { decodeFile } from "./image/decoders";
import { calculateDimensions, applyTransformations } from "./image/transformers";
import { encodeResult } from "./image/encoders";

/**
 * Main entry point for image processing.
 * Refactored into a strategy pattern for Phase 1 of Production Excellence.
 */
export async function processImage(
  file: File,
  options: ProcessOptions,
  onProgress?: (progress: number) => void
): Promise<ProcessingResult> {
  // 1. Decode specialized formats (HEIC, PSD, PDF, etc.)
  const sourceBlob = await decodeFile(file, onProgress);
  onProgress?.(25);

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(sourceBlob);

    img.onload = async () => {
      try {
        URL.revokeObjectURL(objectUrl);
        
        // 2. Calculate target dimensions based on options
        const dimensions = calculateDimensions(img, options);
        
        // 3. Worker Offloading (Phase 2 - Performance)
        if (typeof Worker !== 'undefined' && typeof OffscreenCanvas !== 'undefined' && typeof createImageBitmap !== 'undefined') {
          const worker = new Worker(new URL('../workers/image.worker.ts', import.meta.url), { type: 'module' });
          
          const imgBitmap = await createImageBitmap(img);
          
          worker.onmessage = (e) => {
            if (e.data.error) {
              reject(new Error(e.data.error));
            } else {
              const blob = e.data.blob;
              onProgress?.(100);
              resolve({ blob, url: URL.createObjectURL(blob) });
            }
            worker.terminate();
          };
          
          worker.postMessage({ imgBitmap, options, dimensions }, [imgBitmap]);
          return;
        }

        // ─── Fallback: Main Thread (Phase 1 Logic) ──────────────────────────
        // 3. Setup canvas
        const canvas = document.createElement("canvas");
        const rotate = options.rotate || 0;
        const isRotated90 = rotate === 90 || rotate === 270;
        canvas.width = isRotated90 ? dimensions.height : dimensions.width;
        canvas.height = isRotated90 ? dimensions.width : dimensions.height;
        
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas context failed");

        // 4. Apply filters, transforms, blurs, watermarks
        applyTransformations(ctx, img, options, canvas, dimensions);
        onProgress?.(50);

        // 5. Encode to target format with quality search
        const result = await encodeResult(canvas, ctx, options, file, onProgress);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image into buffer."));
    };

    img.src = objectUrl;
  });
}
