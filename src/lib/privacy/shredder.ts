/**
 * File Shredder — overwrites file data with random bytes in browser memory.
 * Does NOT delete the original file on disk.
 */

export type ShredPasses = 1 | 3 | 7;

export async function shredFile(
  file: File,
  passes: ShredPasses = 3,
  onProgress?: (pct: number) => void
): Promise<Blob> {
  const buffer = new Uint8Array(await file.arrayBuffer());
  for (let pass = 0; pass < passes; pass++) {
    crypto.getRandomValues(buffer);
    onProgress?.(Math.round(((pass + 1) / passes) * 100));
    await new Promise((r) => setTimeout(r, 0));
  }
  return new Blob([buffer], { type: "application/octet-stream" });
}

export function shreddedFilename(originalName: string): string {
  const base = originalName.replace(/\.[^.]+$/, "");
  return `${base}_shredded_${Date.now()}.bin`;
}
