// src/workers/image.worker.ts
import { ProcessOptions } from "../lib/image/types";

self.onmessage = async (e: MessageEvent<{
  imgBitmap: ImageBitmap;
  options: ProcessOptions;
  dimensions: any;
}>) => {
  const { imgBitmap, options, dimensions } = e.data;
  const { width, height, sourceX, sourceY, sourceWidth, sourceHeight } = dimensions;

  try {
    const rotate = options.rotate || 0;
    const isRotated90 = rotate === 90 || rotate === 270;
    
    const canvasWidth = isRotated90 ? height : width;
    const canvasHeight = isRotated90 ? width : height;
    
    // Use OffscreenCanvas
    const canvas = new OffscreenCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Offscreen context failed");

    // Ported transformations
    ctx.save();
    ctx.translate(canvasWidth / 2, canvasHeight / 2);
    ctx.rotate((rotate * Math.PI) / 180);
    ctx.scale(options.flipX ? -1 : 1, options.flipY ? -1 : 1);

    let filterString = `brightness(${options.brightness ?? 100}%) contrast(${options.contrast ?? 100}%) saturate(${options.saturation ?? 100}%)`;
    if (options.filter === "grayscale") filterString += " grayscale(100%)";
    if (options.filter === "sepia") filterString += " sepia(100%)";
    if (options.filter === "invert") filterString += " invert(100%)";
    if (options.filter === "vivid") filterString += " saturate(150%) contrast(120%)";
    ctx.filter = filterString;

    ctx.drawImage(imgBitmap, sourceX, sourceY, sourceWidth, sourceHeight, -width / 2, -height / 2, width, height);

    // Privacy Blurs
    if (options.blurs && options.blurs.length > 0) {
      options.blurs.forEach(region => {
        ctx.save();
        const rx = region.x - sourceX;
        const ry = region.y - sourceY;
        const rw = region.width;
        const rh = region.height;
        const scaleX = width / sourceWidth;
        const scaleY = height / sourceHeight;
        const targetRx = rx * scaleX - width / 2;
        const targetRy = ry * scaleY - height / 2;
        const targetRw = rw * scaleX;
        const targetRh = rh * scaleY;

        ctx.beginPath();
        ctx.rect(targetRx, targetRy, targetRw, targetRh);
        ctx.clip();
        ctx.filter = "blur(32px)";
        ctx.drawImage(imgBitmap, sourceX, sourceY, sourceWidth, sourceHeight, -width / 2, -height / 2, width, height);
        ctx.restore();
      });
    }
    ctx.restore();

    // Watermark (Simplified for worker - fonts might be limited)
    if (options.watermarkText) {
      ctx.font = `bold ${options.watermarkSize || 20}px sans-serif`;
      ctx.fillStyle = options.watermarkColor || "rgba(255,255,255,0.5)";
      ctx.textBaseline = "bottom";
      ctx.textAlign = "right";
      ctx.fillText(options.watermarkText, canvasWidth - 20, canvasHeight - 20);
    }

    // Encoding in worker
    let mimeType = `image/${options.format}`;
    if (options.format === "jpeg" || options.format === "jpg") mimeType = "image/jpeg";
    
    // Convert to blob
    const blob = await canvas.convertToBlob({
      type: mimeType,
      quality: (options.quality || 90) / 100
    });

    self.postMessage({ blob });
  } catch (err: any) {
    self.postMessage({ error: err.message });
  }
};
