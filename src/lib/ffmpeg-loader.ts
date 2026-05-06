/**
 * Shared FFmpeg loader for all studio modules.
 * Uses npm-installed @ffmpeg/ffmpeg + @ffmpeg/core to bypass COEP/CORS issues.
 * The COOP/COEP headers are already set in next.config.ts.
 */

let ffmpegInstance: any = null;
let loadingPromise: Promise<any> | null = null;

export async function loadFFmpegInstance(
  onProgress?: (ratio: number) => void,
  onLog?: (msg: string) => void
): Promise<any> {
  // Return cached instance
  if (ffmpegInstance) return ffmpegInstance;
  // Return in-flight promise to avoid double-load
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    const { FFmpeg } = await import("@ffmpeg/ffmpeg");
    const { toBlobURL } = await import("@ffmpeg/util");

    const ffmpeg = new FFmpeg();

    if (onLog) {
      ffmpeg.on("log", ({ message }: { message: string }) => onLog(message));
    }
    if (onProgress) {
      ffmpeg.on("progress", ({ progress }: { progress: number }) =>
        onProgress(progress)
      );
    }

    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
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
