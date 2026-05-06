/**
 * Safe download helper — creates an object URL, triggers download, then revokes.
 */

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Revoke after a small delay to ensure the download has started
  setTimeout(() => URL.revokeObjectURL(url), 150);
}

export function downloadUrl(url: string, filename: string): void {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/** Copy a Blob's text content to clipboard */
export async function copyBlobText(blob: Blob): Promise<void> {
  const text = await blob.text();
  await navigator.clipboard.writeText(text);
}

/** Copy an image Blob to clipboard (Chrome 98+) */
export async function copyImageBlob(blob: Blob): Promise<void> {
  if (!navigator.clipboard?.write) {
    throw new Error("Clipboard API not supported in this browser.");
  }
  const item = new ClipboardItem({ [blob.type]: blob });
  await navigator.clipboard.write([item]);
}

/** Web Share API — returns true if sharing was triggered */
export async function shareBlob(blob: Blob, filename: string, title?: string): Promise<boolean> {
  if (!navigator.share || !navigator.canShare) return false;
  const file = new File([blob], filename, { type: blob.type });
  if (!navigator.canShare({ files: [file] })) return false;
  await navigator.share({ title: title ?? filename, files: [file] });
  return true;
}
