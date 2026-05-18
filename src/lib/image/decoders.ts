import { ProcessOptions } from "./types";

export async function decodeFile(
  file: File,
  onProgress?: (progress: number) => void
): Promise<File | Blob> {
  const ext = file.name.toLowerCase().split('.').pop();

  if (ext === "heic" || ext === "heif") {
    onProgress?.(5);
    const heic2any = (await import("heic2any")).default;
    const converted = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.9,
    });
    return Array.isArray(converted) ? converted[0] : converted;
  }

  if (ext === "psd") {
    onProgress?.(10);
    const PSD = (await import("psd.js")).default;
    const psd = await PSD.fromURL(URL.createObjectURL(file));
    const canvas = psd.image.toCanvas();
    return new Promise<Blob>((res) => canvas.toBlob((b: Blob | null) => res(b!), "image/png"));
  }

  if (ext === "tiff" || ext === "tif") {
    onProgress?.(10);
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
    return new Promise<Blob>((res) => canvas.toBlob((b: Blob | null) => res(b!), "image/png"));
  }

  if (["cr2", "cr3", "nef", "arw", "dng", "orf", "rw2", "raw"].includes(ext || "")) {
    onProgress?.(10);
    const ExifReader = (await import("exifreader")).default;
    const tags = await ExifReader.load(file);
    if (tags.Thumbnail && tags.Thumbnail.image) {
      return new Blob([tags.Thumbnail.image as unknown as BlobPart], { type: "image/jpeg" });
    }
    throw new Error("No embedded thumbnail found in RAW file.");
  }

  if (ext === "pdf") {
    onProgress?.(10);
    const pdfjs = await import("pdfjs-dist");
    pdfjs.GlobalWorkerOptions.workerSrc = window.location.origin + `/lib/pdfjs/pdf.worker.min.mjs`;
    const buffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: buffer }).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 2.0 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d")!;
    await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;
    return new Promise<Blob>((res) => canvas.toBlob((b: Blob | null) => res(b!), "image/png"));
  }

  if (ext === "tga") {
    onProgress?.(10);
    const TGA = (await import("tga-js")).default;
    const buffer = await file.arrayBuffer();
    const tga = new TGA(new Uint8Array(buffer));
    const canvas = tga.getCanvas();
    return new Promise<Blob>((res) => canvas.toBlob((b: Blob | null) => res(b!), "image/png"));
  }

  if (ext === "svg" || ext === "svgz") {
    onProgress?.(10);
    const { Canvg } = await import("canvg");
    const text = await file.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "image/svg+xml");
    const svgEl = doc.querySelector("svg");
    const canvas = document.createElement("canvas");
    
    if (svgEl) {
      const viewBox = svgEl.getAttribute("viewBox");
      const parts = viewBox?.split(/[ ,]+/).filter(Boolean).map(parseFloat);
      if (parts?.length === 4) {
        canvas.width = parts[2];
        canvas.height = parts[3];
      } else {
        canvas.width = parseFloat(svgEl.getAttribute("width") || "800");
        canvas.height = parseFloat(svgEl.getAttribute("height") || "600");
      }
    }
    
    const ctx = canvas.getContext("2d")!;
    const v = await Canvg.from(ctx, text);
    await v.render();
    return new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), "image/png"));
  }

  if (ext === "docx") {
    onProgress?.(10);
    const mammoth = await import("mammoth");
    const buffer = await file.arrayBuffer();
    const { value: html } = await mammoth.convertToHtml({ arrayBuffer: buffer });
    const canvas = document.createElement("canvas");
    canvas.width = 1200; canvas.height = 1600;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "white"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const data = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml" style="font-family: serif; padding: 40px; color: black; background: white;">${html}</div></foreignObject></svg>`;
    const img = new Image();
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(data)));
    await new Promise((res) => img.onload = res);
    ctx.drawImage(img, 0, 0);
    return new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), "image/png"));
  }

  if (ext === "xlsx" || ext === "xls" || ext === "csv") {
    onProgress?.(10);
    const XLSX = await import("xlsx");
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer);
    const html = XLSX.utils.sheet_to_html(workbook.Sheets[workbook.SheetNames[0]]);
    const canvas = document.createElement("canvas");
    canvas.width = 1200; canvas.height = 1600;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "white"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const data = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml" style="padding: 20px; font-family: sans-serif;"><style>table { border-collapse: collapse; width: 100%; } td, th { border: 1px solid #ddd; padding: 8px; }</style>${html}</div></foreignObject></svg>`;
    const img = new Image();
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(data)));
    await new Promise((res) => img.onload = res);
    ctx.drawImage(img, 0, 0);
    return new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), "image/png"));
  }

  if (["txt", "md", "json", "js", "ts", "py"].includes(ext || "")) {
    onProgress?.(10);
    const text = await file.text();
    const canvas = document.createElement("canvas");
    canvas.width = 1200; canvas.height = 1600;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#1e1e1e"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const data = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml" style="padding: 60px; font-family: monospace; color: #d4d4d4; background: #1e1e1e; height: 100%; box-sizing: border-box;"><pre style="white-space: pre-wrap; font-size: 18px;">${text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").slice(0, 5000)}</pre></div></foreignObject></svg>`;
    const img = new Image();
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(data)));
    await new Promise((res) => img.onload = res);
    ctx.drawImage(img, 0, 0);
    return new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), "image/png"));
  }

  // Fallback to original file for native formats
  return file;
}

