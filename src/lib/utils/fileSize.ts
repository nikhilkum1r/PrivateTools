/**
 * Utility functions for human-readable file size formatting.
 */

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

export function bytesToMB(bytes: number): number {
  return bytes / (1024 * 1024);
}

export function bytesToKB(bytes: number): number {
  return bytes / 1024;
}

export function mbToBytes(mb: number): number {
  return mb * 1024 * 1024;
}

/** Returns a human-readable savings string e.g. "Saved 2.3 MB (42%)" */
export function formatSavings(inputBytes: number, outputBytes: number): string {
  if (inputBytes === 0) return "";
  const saved = inputBytes - outputBytes;
  const pct = Math.round((saved / inputBytes) * 100);
  if (saved <= 0) return `+${formatBytes(Math.abs(saved))} larger`;
  return `Saved ${formatBytes(saved)} (${pct}%)`;
}
