import { ProcessOptions } from "./types";

export function applyTransformations(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  options: ProcessOptions,
  canvas: HTMLCanvasElement,
  dimensions: { width: number; height: number; sourceX: number; sourceY: number; sourceWidth: number; sourceHeight: number }
) {
  const { width, height, sourceX, sourceY, sourceWidth, sourceHeight } = dimensions;
  const { rotate = 0, flipX = false, flipY = false, brightness = 100, contrast = 100, saturation = 100, filter = "none" } = options;

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((rotate * Math.PI) / 180);
  ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);

  let filterString = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
  if (filter === "grayscale") filterString += " grayscale(100%)";
  if (filter === "sepia") filterString += " sepia(100%)";
  if (filter === "invert") filterString += " invert(100%)";
  if (filter === "vivid") filterString += " saturate(150%) contrast(120%)";
  ctx.filter = filterString;

  ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, -width / 2, -height / 2, width, height);

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
      ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, -width / 2, -height / 2, width, height);
      ctx.restore();
    });
  }

  ctx.restore();

  // Watermark
  if (options.watermarkText) {
    const watermarkSize = options.watermarkSize || 20;
    const watermarkColor = options.watermarkColor || "rgba(255,255,255,0.5)";
    ctx.font = `bold ${watermarkSize}px Inter, sans-serif`;
    ctx.fillStyle = watermarkColor;
    ctx.textBaseline = "bottom";
    ctx.textAlign = "right";
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 4;
    ctx.fillText(options.watermarkText, canvas.width - 20, canvas.height - 20);
  }
}

export function calculateDimensions(img: HTMLImageElement, options: ProcessOptions) {
  let sourceX = 0;
  let sourceY = 0;
  let sourceWidth = img.width;
  let sourceHeight = img.height;

  if (options.crop) {
    sourceX = options.crop.x || 0;
    sourceY = options.crop.y || 0;
    sourceWidth = options.crop.width || img.width;
    sourceHeight = options.crop.height || img.height;
  }

  let width = sourceWidth;
  let height = sourceHeight;

  if (options.maxWidth && options.maxHeight) {
    const ratio = Math.min(options.maxWidth / width, options.maxHeight / height);
    width *= ratio;
    height *= ratio;
  } else if (options.maxWidth) {
    height = (height * options.maxWidth) / width;
    width = options.maxWidth;
  } else if (options.maxHeight) {
    width = (width * options.maxHeight) / height;
    height = options.maxHeight;
  }

  return { width, height, sourceX, sourceY, sourceWidth, sourceHeight };
}
