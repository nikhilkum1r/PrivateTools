/**
 * Shared FFmpeg loader for all studio modules.
 * Loads @ffmpeg/ffmpeg from a CDN to bypass Next.js Turbopack's dynamic import errors.
 */

let ffmpegInstance: any = null;
let loadingPromise: Promise<any> | null = null;

// Native implementation of fetchFile to bypass @ffmpeg/util bundle issues
export const fetchFile = async (file: File | string | Blob | URL): Promise<Uint8Array> => {
  if (file instanceof File || file instanceof Blob) {
    const buffer = await file.arrayBuffer();
    return new Uint8Array(buffer);
  }
  const response = await fetch(file.toString());
  const buffer = await response.arrayBuffer();
  return new Uint8Array(buffer);
};


// Dynamically injects the FFmpeg UMD script from local static assets
async function loadFFmpegScript(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && (window as any).FFmpegWASM) {
      resolve((window as any).FFmpegWASM.FFmpeg);
      return;
    }
    const script = document.createElement("script");
    script.src = "/lib/ffmpeg/ffmpeg.js";
    script.async = true;
    script.onload = () => {
      resolve((window as any).FFmpegWASM.FFmpeg);
    };
    script.onerror = () => {
      reject(new Error("Failed to load FFmpeg script from local assets."));
    };
    document.head.appendChild(script);
  });
}

export async function loadFFmpegInstance(
  onProgress?: (ratio: number) => void,
  onLog?: (msg: string) => void
): Promise<any> {
  if (ffmpegInstance) return ffmpegInstance;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    const FFmpegClass = await loadFFmpegScript();
    const ffmpeg = new FFmpegClass();

    if (onLog) {
      ffmpeg.on("log", ({ message }: { message: string }) => onLog(message));
    }
    if (onProgress) {
      ffmpeg.on("progress", ({ progress }: { progress: number }) => onProgress(progress));
    }

    const baseURL = "/lib/ffmpeg";
    await ffmpeg.load({
      coreURL: `${baseURL}/ffmpeg-core.js`,
      wasmURL: `${baseURL}/ffmpeg-core.wasm`,
    });

    ffmpegInstance = ffmpeg;
    return ffmpeg;
  })();

  return loadingPromise;
}

export function getFFmpegInstance(): any | null {
  return ffmpegInstance;
}

export function resetFFmpegInstance(): void {
  ffmpegInstance = null;
  loadingPromise = null;
}
