/**
 * ZIP archive creation using JSZip.
 */

export interface ZipEntry {
  name: string;
  blob: Blob;
}

export async function createZip(
  files: ZipEntry[],
  onProgress?: (percent: number) => void
): Promise<Blob> {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();

  for (const { name, blob } of files) {
    zip.file(name, blob);
  }

  return zip.generateAsync(
    { type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } },
    (meta) => onProgress?.(Math.round(meta.percent))
  );
}

/** Download multiple blobs as a single ZIP file */
export async function downloadAsZip(
  files: ZipEntry[],
  zipFilename = "privatetools-export.zip",
  onProgress?: (percent: number) => void
): Promise<void> {
  const { downloadBlob } = await import("./download");
  const zipBlob = await createZip(files, onProgress);
  downloadBlob(zipBlob, zipFilename);
}
