/**
 * Free and Pro file size limits per module.
 * All values in bytes.
 */

export const FREE_LIMITS = {
  image:    20  * 1024 * 1024,   // 20 MB
  pdf:      50  * 1024 * 1024,   // 50 MB
  video:    200 * 1024 * 1024,   // 200 MB
  audio:    100 * 1024 * 1024,   // 100 MB
  document: 10  * 1024 * 1024,   // 10 MB
  txt:      1   * 1024 * 1024,   // 1 MB
  fileLock: 100 * 1024 * 1024,   // 100 MB
} as const;

export const PRO_LIMITS = {
  image:    200  * 1024 * 1024,  // 200 MB
  pdf:      500  * 1024 * 1024,  // 500 MB
  video:    5    * 1024 * 1024 * 1024, // 5 GB
  audio:    1    * 1024 * 1024 * 1024, // 1 GB
  document: 100  * 1024 * 1024,  // 100 MB
  txt:      10   * 1024 * 1024,  // 10 MB
  fileLock: 2    * 1024 * 1024 * 1024, // 2 GB
} as const;

export type Module = keyof typeof FREE_LIMITS;

export function isWithinFreeLimit(module: Module, bytes: number): boolean {
  return bytes <= FREE_LIMITS[module];
}

export function isWithinProLimit(module: Module, bytes: number): boolean {
  return bytes <= PRO_LIMITS[module];
}

/** Returns percentage of limit used (capped at 100) */
export function limitUsagePercent(module: Module, bytes: number): number {
  return Math.min(100, (bytes / FREE_LIMITS[module]) * 100);
}
