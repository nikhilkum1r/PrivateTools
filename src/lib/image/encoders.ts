import { ProcessOptions, ProcessingResult } from "./types";

export async function encodeResult(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  options: ProcessOptions,
  originalFile: File,
  onProgress?: (progress: number) => void
): Promise<ProcessingResult> {
  const { format, quality, targetSize } = options;
  let mimeType = `image/${format}`;
  if (format === "jpeg" || format === "jpg") mimeType = "image/jpeg";
  if (format === "avif") mimeType = "image/avif";
  if (format === "tif" || format === "tiff") mimeType = "image/tiff";

  // PDF Encoding
  if (format === "pdf") {
    const { PDFDocument } = await import("pdf-lib");
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([canvas.width, canvas.height]);
    const jpegDataUrl = canvas.toDataURL("image/jpeg", 0.95);
    const jpegBytes = await fetch(jpegDataUrl).then(res => res.arrayBuffer());
    const pdfImage = await pdfDoc.embedJpg(jpegBytes);
    page.drawImage(pdfImage, { x: 0, y: 0, width: canvas.width, height: canvas.height });
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
    onProgress?.(100);
    return { blob, url: URL.createObjectURL(blob) };
  }

  // SVG Encoding
  if (format === "svg") {
    const dataUrl = canvas.toDataURL("image/png");
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvas.width} ${canvas.height}" preserveAspectRatio="xMidYMid meet">
      <image href="${dataUrl}" x="0" y="0" width="100%" height="100%" />
    </svg>`;
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    onProgress?.(100);
    return { blob, url: URL.createObjectURL(blob) };
  }

  // Standard Encoding with Optional Binary Search for Target Size
  const compress = async (q: number): Promise<ProcessingResult> => {
    if (format === "tiff" || format === "tif") {
      const UTIF = (await import("utif")).default;
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const buffer = UTIF.encodeImage(imageData.data, canvas.width, canvas.height);
      const blob = new Blob([buffer as any], { type: "image/tiff" });
      return { blob, url: URL.createObjectURL(blob) };
    }

    return new Promise((res, rej) => {
      canvas.toBlob((blob) => {
        if (blob) res({ blob, url: URL.createObjectURL(blob) });
        else rej(new Error("Encoding failed"));
      }, mimeType, q / 100);
    });
  };

  let result = await compress(quality);
  if (targetSize && result.blob.size > targetSize) {
    let low = 1, high = quality, best = result;
    for (let i = 0; i < 12; i++) {
      const mid = Math.floor((low + high) / 2);
      const current = await compress(mid);
      if (current.blob.size <= targetSize) {
        URL.revokeObjectURL(best.url);
        best = current;
        low = mid + 1;
      } else {
        URL.revokeObjectURL(current.url);
        high = mid - 1;
      }
    }
    result = best;
  }

  // Bloat protection
  if (result.blob.size > originalFile.size && !hasTransformations(options, canvas)) {
    onProgress?.(100);
    return { blob: originalFile, url: URL.createObjectURL(originalFile) };
  }

  onProgress?.(100);
  return result;
}

function hasTransformations(options: ProcessOptions, canvas: HTMLCanvasElement) {
  return !!(options.crop || options.rotate || options.flipX || options.flipY || 
         options.brightness !== 100 || options.contrast !== 100 || options.saturation !== 100 || 
         options.filter !== "none" || options.watermarkText);
}
