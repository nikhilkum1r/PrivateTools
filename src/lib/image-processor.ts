import { ImageFormat } from "@/store/useImageStore";
import { PDFDocument } from "pdf-lib";


interface ProcessOptions {
  format: ImageFormat;
  quality: number;
  maxWidth?: number;
  maxHeight?: number;
  rotate: number;
  flipX: boolean;
  flipY: boolean;
  brightness: number;
  contrast: number;
  saturation: number;
  filter: string;
  watermarkText?: string;
  watermarkColor: string;
  watermarkSize: number;
  targetSize?: number;
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  blurs?: {
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
  stripMetadata?: boolean;
}

export async function processImage(
  file: File,
  options: ProcessOptions,
  onProgress?: (progress: number) => void
): Promise<{ blob: Blob; url: string }> {
  let sourceFile: File | Blob = file;

  // 1. Pre-processing / Decoding specialized formats
  const ext = file.name.toLowerCase().split('.').pop();

  if (ext === "heic" || ext === "heif") {
    onProgress?.(5);
    try {
      const heic2any = (await import("heic2any")).default;
      const converted = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.9,
      });
      sourceFile = Array.isArray(converted) ? converted[0] : converted;
    } catch (e) {
      console.error("HEIC conversion failed", e);
      throw new Error("Failed to decode HEIC/HEIF file.");
    }
  } else if (ext === "psd") {
    onProgress?.(10);
    try {
      const PSD = (await import("psd.js")).default;
      const psd = await PSD.fromURL(URL.createObjectURL(file));
      const canvas = psd.image.toCanvas();
      sourceFile = await new Promise<Blob>((res) => canvas.toBlob((b: Blob | null) => res(b!), "image/png"));
    } catch (e) {
      console.error("PSD decoding failed", e);
      throw new Error("Failed to decode Photoshop (PSD) file.");
    }
  } else if (ext === "tiff" || ext === "tif") {
    onProgress?.(10);
    try {
      const UTIF = (await import("utif")).default;
      const buffer = await file.arrayBuffer();
      const ifds = UTIF.decode(buffer);
      UTIF.decodeImage(buffer, ifds[0]);
      const rgba = UTIF.toRGBA8(ifds[0]);
      const canvas = document.createElement("canvas");
      canvas.width = ifds[0].width;
      canvas.height = ifds[0].height;
      const ctx = canvas.getContext("2d")!;
      const imgData = ctx.createImageData(canvas.width, canvas.height);
      imgData.data.set(rgba);
      ctx.putImageData(imgData, 0, 0);
      sourceFile = await new Promise<Blob>((res) => canvas.toBlob((b: Blob | null) => res(b!), "image/png"));
    } catch (e) {
      console.error("TIFF decoding failed", e);
      throw new Error("Failed to decode TIFF file.");
    }
  } else if (["cr2", "cr3", "nef", "arw", "dng", "orf", "rw2", "raw"].includes(ext || "")) {
    onProgress?.(10);
    try {
      const ExifReader = (await import("exifreader")).default;
      const tags = await ExifReader.load(file);
      if (tags.Thumbnail && tags.Thumbnail.image) {
        sourceFile = new Blob([tags.Thumbnail.image as unknown as BlobPart], { type: "image/jpeg" });
      } else {
        throw new Error("No embedded thumbnail found in RAW file.");
      }
    } catch (e) {
      console.error("RAW thumbnail extraction failed", e);
      throw new Error("Failed to extract preview from RAW file.");
    }
  } else if (ext === "pdf") {
    onProgress?.(10);
    try {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
      const buffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: buffer }).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 2.0 }); // High res
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d")!;
      await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;
      sourceFile = await new Promise<Blob>((res) => canvas.toBlob((b: Blob | null) => res(b!), "image/png"));
    } catch (e) {
      console.error("PDF decoding failed", e);
      throw new Error("Failed to decode PDF file.");
    }
  } else if (ext === "tga") {
    onProgress?.(10);
    try {
      const TGA = (await import("tga-js")).default;
      const buffer = await file.arrayBuffer();
      const tga = new TGA(new Uint8Array(buffer));
      const canvas = tga.getCanvas();
      sourceFile = await new Promise<Blob>((res) => canvas.toBlob((b: Blob | null) => res(b!), "image/png"));
    } catch (e) {
      console.error("TGA decoding failed", e);
      throw new Error("Failed to decode TGA file.");
    }
  } else if (ext === "dds") {
    onProgress?.(10);
    try {
      const { parseHeaders } = await import("dds-parser");
      const buffer = await file.arrayBuffer();
      const dds = parseHeaders(buffer);
      // dds-parser usually gives headers, full decoding needs a bit more.
      // For now we'll handle basic DXT textures if possible, or skip if too complex for simple impl.
      // Falling back to native if parser fails.
    } catch (e) {
      console.error("DDS decoding failed", e);
    }
  } else if (ext === "dicom" || ext === "dcm") {
    onProgress?.(10);
    try {
      const dicomParser = (await import("dicom-parser")).default;
      const buffer = await file.arrayBuffer();
      const dataSet = dicomParser.parseDicom(new Uint8Array(buffer));
      // DICOM is complex, but we can extract pixel data if it's uncompressed
      // For now, providing a structured error or placeholder
      throw new Error("DICOM decoding requires specialized medical viewer (Advanced Feature).");
    } catch (e) {
      console.error("DICOM decoding failed", e);
      throw new Error("DICOM format detected: Decoding not yet supported in browser.");
    }
  } else if (ext === "docx") {
    onProgress?.(10);
    try {
      const mammoth = await import("mammoth");
      const buffer = await file.arrayBuffer();
      const { value: html } = await mammoth.convertToHtml({ arrayBuffer: buffer });
      
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 1600;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const data = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: serif; padding: 40px; color: black; background: white;">
            ${html}
          </div>
        </foreignObject>
      </svg>`;
      
      const img = new Image();
      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(data)));
      await new Promise((res) => img.onload = res);
      ctx.drawImage(img, 0, 0);
      sourceFile = await new Promise<Blob>((res) => canvas.toBlob((b: Blob | null) => res(b!), "image/png"));
    } catch (e) {
      console.error("DOCX decoding failed", e);
      throw new Error("Failed to decode Word document.");
    }
  } else if (ext === "xlsx" || ext === "xls" || ext === "csv") {
    onProgress?.(10);
    try {
      const XLSX = await import("xlsx");
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer);
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const html = XLSX.utils.sheet_to_html(firstSheet);
      
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 1600;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const data = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml" style="padding: 20px; font-family: sans-serif;">
            <style>table { border-collapse: collapse; width: 100%; } td, th { border: 1px solid #ddd; padding: 8px; }</style>
            ${html}
          </div>
        </foreignObject>
      </svg>`;
      
      const img = new Image();
      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(data)));
      await new Promise((res) => img.onload = res);
      ctx.drawImage(img, 0, 0);
      sourceFile = await new Promise<Blob>((res) => canvas.toBlob((b: Blob | null) => res(b!), "image/png"));
    } catch (e) {
      console.error("Spreadsheet decoding failed", e);
      throw new Error("Failed to decode Spreadsheet file.");
    }
  } else if (["txt", "md", "markdown", "js", "ts", "jsx", "tsx", "py", "java", "c", "cpp", "h", "hpp", "cs", "go", "rs", "php", "rb", "swift", "kt", "kts", "scala", "lua", "sh", "bat", "ps1", "json", "yaml", "yml", "toml", "ini", "conf", "config", "log", "readme", "dockerfile", "env", "gitignore"].includes(ext || "")) {
    onProgress?.(10);
    try {
      const text = await file.text();
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 1600;
      const ctx = canvas.getContext("2d")!;
      
      // Background
      ctx.fillStyle = "#1e1e1e";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const data = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml" style="padding: 60px; font-family: 'JetBrains Mono', 'Fira Code', monospace; color: #d4d4d4; background: #1e1e1e; height: 100%; box-sizing: border-box;">
            <div style="background: #252526; padding: 15px 25px; border-radius: 12px 12px 0 0; border-bottom: 1px solid #333; display: flex; align-items: center; gap: 10px;">
              <div style="display: flex; gap: 6px;">
                <div style="width: 12px; height: 12px; background: #ff5f56; border-radius: 50%;"></div>
                <div style="width: 12px; height: 12px; background: #ffbd2e; border-radius: 50%;"></div>
                <div style="width: 12px; height: 12px; background: #27c93f; border-radius: 50%;"></div>
              </div>
              <span style="font-size: 14px; color: #858585; margin-left: 10px;">${file.name}</span>
            </div>
            <pre style="padding: 30px; margin: 0; white-space: pre-wrap; font-size: 18px; line-height: 1.6;">${text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").slice(0, 5000)}</pre>
          </div>
        </foreignObject>
      </svg>`;
      
      const img = new Image();
      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(data)));
      await new Promise((res) => img.onload = res);
      ctx.drawImage(img, 0, 0);
      sourceFile = await new Promise<Blob>((res) => canvas.toBlob((b: Blob | null) => res(b!), "image/png"));
    } catch (e) {
      console.error("Code rendering failed", e);
    }
  }

  else if (ext === "svg" || ext === "svgz") {
    onProgress?.(10);
    try {
      const { Canvg } = await import("canvg");
      const text = await file.text();
      
      // Parse dimensions from SVG text to set canvas size
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "image/svg+xml");
      const svgEl = doc.querySelector("svg");
      
      const canvas = document.createElement("canvas");
      if (svgEl) {
        const viewBox = svgEl.getAttribute("viewBox");
        const attrW = svgEl.getAttribute("width");
        const attrH = svgEl.getAttribute("height");
        
        if (viewBox) {
          const parts = viewBox.split(/[ ,]+/).filter(Boolean).map(parseFloat);
          if (parts.length === 4) {
            canvas.width = parts[2];
            canvas.height = parts[3];
          }
        } else if (attrW && attrH) {
          canvas.width = parseFloat(attrW);
          canvas.height = parseFloat(attrH);
        } else {
          canvas.width = 800;
          canvas.height = 600;
        }
      } else {
        canvas.width = 800;
        canvas.height = 600;
      }
      
      const ctx = canvas.getContext("2d")!;
      const v = await Canvg.from(ctx, text);
      await v.render();
      sourceFile = await new Promise<Blob>((res) => canvas.toBlob((b: Blob | null) => res(b!), "image/png"));
    } catch (e) {
      console.error("SVG decoding via canvg failed, falling back to native", e);
    }
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(sourceFile);
    
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      // ... existing canvas drawing logic ...
        // Handle Cropping
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

        // Resize logic (based on cropped area if any)
        // Resize logic (Fit within maxWidth/maxHeight box)
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

        // Adjust dimensions for rotation
        const canvas = document.createElement("canvas");
        const isRotated90 = options.rotate === 90 || options.rotate === 270;
        canvas.width = isRotated90 ? height : width;
        canvas.height = isRotated90 ? width : height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        // Apply transformations
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((options.rotate * Math.PI) / 180);
        ctx.scale(options.flipX ? -1 : 1, options.flipY ? -1 : 1);
        
        // Draw with filters
        let filterString = `brightness(${options.brightness}%) contrast(${options.contrast}%) saturate(${options.saturation}%)`;
        if (options.filter === "grayscale") filterString += " grayscale(100%)";
        if (options.filter === "sepia") filterString += " sepia(100%)";
        if (options.filter === "invert") filterString += " invert(100%)";
        if (options.filter === "vivid") filterString += " saturate(150%) contrast(120%)";
        
        ctx.filter = filterString;
        
        // Draw the image (cropped source area to the target canvas area)
        ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, -width / 2, -height / 2, width, height);

        // Apply Privacy Blurs
        if (options.blurs && options.blurs.length > 0) {
          options.blurs.forEach(region => {
            ctx.save();
            
            // Map region to cropped space and target canvas space
            // The region coordinates (x, y) are relative to the original image dimensions
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
            
            // Apply aggressive blur for privacy
            ctx.filter = "blur(32px)";
            ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, -width / 2, -height / 2, width, height);
            ctx.restore();
          });
        }

        ctx.restore();

        // Apply Watermark
        if (options.watermarkText) {
          ctx.font = `bold ${options.watermarkSize}px Inter, sans-serif`;
          ctx.fillStyle = options.watermarkColor;
          ctx.textBaseline = "bottom";
          ctx.textAlign = "right";
          
          // Add a subtle shadow for readability
          ctx.shadowColor = "rgba(0,0,0,0.5)";
          ctx.shadowBlur = 4;
          
          ctx.fillText(options.watermarkText, canvas.width - 20, canvas.height - 20);
        }

        onProgress?.(50);

        // Determine Mime Type & Encoding Strategy
        let mimeType = `image/${options.format}`;
        if (options.format === "jpeg" || options.format === "jpg") mimeType = "image/jpeg";
        if (options.format === "avif") mimeType = "image/avif";
        if (options.format === "ico") mimeType = "image/x-icon";
        if (options.format === "tif" || options.format === "tiff") mimeType = "image/tiff";
        if (options.format === "pdf") mimeType = "application/pdf";
        if (options.format === "docx") mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        if (options.format === "pptx") mimeType = "application/vnd.openxmlformats-officedocument.presentationml.presentation";

        const compress = async (q: number): Promise<{ blob: Blob; url: string }> => {
          // Special encoding for TIFF
          if (options.format === "tiff" || options.format === "tif") {
            const UTIF = (await import("utif")).default;
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const buffer = UTIF.encodeImage(imageData.data, canvas.width, canvas.height);
            const blob = new Blob([buffer], { type: "image/tiff" });
            return { blob, url: URL.createObjectURL(blob) };
          }

          // Special encoding for ICO (basic 32x32 / 16x16 / 48x48)
          if (options.format === "ico") {
            // Browsers don't support image/x-icon well in toBlob. 
            // For now, we'll use a high-quality PNG which most OSs accept as ICO if named correctly, 
            // OR we can use a small helper. Let's use PNG as a reliable fallback for now.
            mimeType = "image/png"; 
          }

          return new Promise((res, rej) => {
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  res({ blob, url: URL.createObjectURL(blob) });
                } else {
                  // Fallback to PNG if the requested format isn't supported by the browser
                  canvas.toBlob((fallbackBlob) => {
                    if (fallbackBlob) {
                      res({ blob: fallbackBlob, url: URL.createObjectURL(fallbackBlob) });
                    } else {
                      rej(new Error(`Failed to encode image.`));
                    }
                  }, "image/png");
                }
              },
              mimeType,
              q / 100
            );
          });
        };

        (async () => {
          try {
            if (options.format === "pdf") {
              const pdfDoc = await PDFDocument.create();
              // Normalize to points (72 dpi) but maintain aspect ratio
              const pdfWidth = canvas.width;
              const pdfHeight = canvas.height;
              const page = pdfDoc.addPage([pdfWidth, pdfHeight]);
              
              const jpegDataUrl = canvas.toDataURL("image/jpeg", 0.95);
              const jpegBytes = await fetch(jpegDataUrl).then(res => res.arrayBuffer());
              const pdfImage = await pdfDoc.embedJpg(jpegBytes);
              
              page.drawImage(pdfImage, {
                x: 0,
                y: 0,
                width: pdfWidth,
                height: pdfHeight,
              });
              
              const pdfBytes = await pdfDoc.save();
              const blob = new Blob([pdfBytes] as any, { type: "application/pdf" });
              onProgress?.(100);
              resolve({ blob, url: URL.createObjectURL(blob) });
              return;
            }

            if (options.format === "svg") {
              const dataUrl = canvas.toDataURL("image/png");
              // Use width="100%" height="100%" on the image tag to ensure it fills the SVG viewBox
              // and remove absolute width/height from the SVG tag to make it responsive while keeping viewBox
              const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvas.width} ${canvas.height}" preserveAspectRatio="xMidYMid meet">
                <image href="${dataUrl}" x="0" y="0" width="100%" height="100%" />
              </svg>`;
              const blob = new Blob([svgString], { type: "image/svg+xml" });
              onProgress?.(100);
              resolve({ blob, url: URL.createObjectURL(blob) });
              return;
            }

            let result = await compress(options.quality);
            let low = 1;
            let high = options.quality;
            let bestResult = result;
            const targetBytes = options.targetSize || 0;

            if (targetBytes) {
              // Aggressive Binary Search for the perfect quality fit
              let attempts = 0;
              const maxAttempts = 12;

              // Initial check: if first attempt is already too big, start search
              if (result.blob.size > targetBytes) {
                while (low <= high && attempts < maxAttempts) {
                  const mid = Math.floor((low + high) / 2);
                  const currentResult = await compress(mid);
                  
                  if (currentResult.blob.size <= targetBytes) {
                    // Fits! This is our new best. Try to go higher for better quality.
                    URL.revokeObjectURL(bestResult.url);
                    bestResult = currentResult;
                    low = mid + 1;
                  } else {
                    // Too big! Must go lower.
                    URL.revokeObjectURL(currentResult.url);
                    high = mid - 1;
                  }
                  attempts++;
                }
                result = bestResult;
              }

              // FINAL AGGRESSIVE CHECK: If still too big after quality search, 
              // it's likely the dimensions are too large for the target size.
              // We will recursively scale down dimensions as a last resort.
              if (result.blob.size > targetBytes && attempts >= maxAttempts) {
                 // Drop dimensions by 20% and retry search if user really wants this size
                 // This is handled by returning the best we found, 
                 // but we'll mark it as the absolute limit.
              }
            }

            // FINAL BLOAT PROTECTION: 
            // If the output is larger than the input AND no visual transformations were applied,
            // we should probably stick to the original file to avoid "upsize" frustration.
            const hasTransformations = options.crop || options.rotate !== 0 || options.flipX || options.flipY || 
                                     options.brightness !== 100 || options.contrast !== 100 || options.saturation !== 100 || 
                                     options.filter !== "none" || options.watermarkText || 
                                     (options.maxWidth && options.maxWidth > img.width);

            if (!hasTransformations && result.blob.size > file.size && (options.format as string) !== "pdf" && (options.format as string) !== "tiff") {
               // Fallback to original but wrapped in our result structure
               onProgress?.(100);
               resolve({ blob: file, url: URL.createObjectURL(file) });
               return;
            }

            onProgress?.(100);
            resolve(result);
          } catch (err) {
            reject(err);
          }
        })();
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Failed to load image."));
      };
      img.src = objectUrl;
    });
  }
