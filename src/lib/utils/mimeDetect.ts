/**
 * Magic-bytes MIME type detection.
 * Do NOT trust file.type alone — it can be spoofed by renaming files.
 */

interface MagicSignature {
  mime: string;
  bytes: number[];
  offset?: number;
}

const SIGNATURES: MagicSignature[] = [
  // Images
  { mime: "image/jpeg",   bytes: [0xFF, 0xD8, 0xFF] },
  { mime: "image/png",    bytes: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A] },
  { mime: "image/gif",    bytes: [0x47, 0x49, 0x46, 0x38] },
  { mime: "image/webp",   bytes: [0x52, 0x49, 0x46, 0x46], offset: 0 },
  { mime: "image/bmp",    bytes: [0x42, 0x4D] },
  { mime: "image/tiff",   bytes: [0x49, 0x49, 0x2A, 0x00] },
  { mime: "image/tiff",   bytes: [0x4D, 0x4D, 0x00, 0x2A] },
  { mime: "image/avif",   bytes: [0x00, 0x00, 0x00], offset: 0 }, // rough check
  // Documents
  { mime: "application/pdf", bytes: [0x25, 0x50, 0x44, 0x46] },
  { mime: "application/zip", bytes: [0x50, 0x4B, 0x03, 0x04] },
  // DOCX is a ZIP — checked separately by extension
  // Video/Audio
  { mime: "video/mp4",    bytes: [0x00, 0x00, 0x00], offset: 0 }, // rough
  { mime: "audio/mpeg",   bytes: [0xFF, 0xFB] },
  { mime: "audio/mpeg",   bytes: [0xFF, 0xF3] },
  { mime: "audio/wav",    bytes: [0x52, 0x49, 0x46, 0x46] },
];

function matchSignature(header: Uint8Array, sig: MagicSignature): boolean {
  const offset = sig.offset ?? 0;
  return sig.bytes.every((b, i) => header[offset + i] === b);
}

/**
 * Reads the first 16 bytes of a File and matches against known signatures.
 * Falls back to file.type if no match found.
 */
export async function detectMimeType(file: File): Promise<string> {
  try {
    const slice = file.slice(0, 16);
    const buffer = await slice.arrayBuffer();
    const header = new Uint8Array(buffer);

    for (const sig of SIGNATURES) {
      if (matchSignature(header, sig)) {
        // Special case: RIFF container — disambiguate WebP vs WAV
        if (sig.mime === "image/webp" || sig.mime === "audio/wav") {
          const riff = String.fromCharCode(...Array.from(header.slice(0, 4)));
          const subtype = String.fromCharCode(...Array.from(header.slice(8, 12)));
          if (riff === "RIFF") {
            return subtype === "WEBP" ? "image/webp" : "audio/wav";
          }
        }
        return sig.mime;
      }
    }
  } catch {
    // Silently fall through to file.type
  }

  // Fallback — trust browser-provided type or extension guess
  if (file.type) return file.type;

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const extMap: Record<string, string> = {
    jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
    webp: "image/webp", gif: "image/gif", bmp: "image/bmp",
    tiff: "image/tiff", tif: "image/tiff", avif: "image/avif",
    svg: "image/svg+xml", heic: "image/heic", heif: "image/heif",
    pdf: "application/pdf", docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    txt: "text/plain", mp4: "video/mp4", webm: "video/webm",
    mov: "video/quicktime", avi: "video/x-msvideo", mkv: "video/x-matroska",
    mp3: "audio/mpeg", wav: "audio/wav", ogg: "audio/ogg",
    aac: "audio/aac", flac: "audio/flac",
  };
  return extMap[ext] ?? "application/octet-stream";
}

export function isImageMime(mime: string): boolean {
  return mime.startsWith("image/");
}

export function isVideoMime(mime: string): boolean {
  return mime.startsWith("video/");
}

export function isAudioMime(mime: string): boolean {
  return mime.startsWith("audio/");
}

export function isPdfMime(mime: string): boolean {
  return mime === "application/pdf";
}
