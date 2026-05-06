import { toast } from "sonner";
import JSZip from "jszip";

interface ExportOptions {
  showToast?: boolean;
  onProgress?: (progress: number) => void;
  revocationDelay?: number;
}

export class ExportManager {
  /**
   * Export a single file as a download
   */
  static async downloadFile(blob: Blob, filename: string, options: ExportOptions = {}) {
    const { showToast = true, revocationDelay = 1000 } = options;
    
    try {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, revocationDelay);
      
      if (showToast) {
        toast.success(`Exported: ${filename}`, {
          description: `${(blob.size / 1024).toFixed(1)} KB · Sovereign Local Export`,
        });
      }
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Export Failed", {
        description: "An error occurred while generating the download link.",
      });
    }
  }

  /**
   * Export multiple files bundled in a ZIP
   */
  static async downloadZip(
    files: { blob: Blob; name: string }[],
    zipName: string,
    options: ExportOptions = {}
  ) {
    const { showToast = true, onProgress } = options;
    
    if (files.length === 0) return;
    
    try {
      const zip = new JSZip();
      
      files.forEach((file) => {
        zip.file(file.name, file.blob);
      });
      
      const content = await zip.generateAsync({ type: "blob" }, (metadata) => {
        if (onProgress) onProgress(metadata.percent);
      });
      
      await this.downloadFile(content, zipName.endsWith(".zip") ? zipName : `${zipName}.zip`, {
        ...options,
        showToast: false, // We'll show a custom toast for ZIPs
      });
      
      if (showToast) {
        toast.success("ZIP Bundle Prepared", {
          description: `Packaged ${files.length} assets into ${zipName}`,
        });
      }
    } catch (error) {
      console.error("ZIP export failed:", error);
      toast.error("ZIP Export Failed", {
        description: "Failed to bundle assets. Try individual exports.",
      });
    }
  }

  /**
   * Helper to fetch and download from URL
   */
  static async downloadFromUrl(url: string, filename: string, options: ExportOptions = {}) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      await this.downloadFile(blob, filename, options);
    } catch (error) {
      console.error("URL export failed:", error);
      toast.error("Network Export Failed");
    }
  }
}
