import { toast } from "sonner";

interface ExportOptions {
  showToast?: boolean;
  onProgress?: (progress: number) => void;
  revocationDelay?: number;
  description?: string;
}

export class ExportManager {
  /**
   * Export a single file as a download
   */
  static async downloadFile(blob: Blob, filename: string, options: ExportOptions = {}) {
    const { showToast = true, revocationDelay = 1000, description } = options;
    
    try {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, revocationDelay);
      
      if (showToast) {
        toast.success(`Exported: ${filename}`, {
          description: description || `${(blob.size / 1024).toFixed(1)} KB · Sovereign Local Export`,
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
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      
      files.forEach((file) => {
        zip.file(file.name, file.blob);
      });
      
      const content = await zip.generateAsync({ 
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 }
      }, (metadata) => {
        if (onProgress) onProgress(metadata.percent);
      });
      
      const finalZipName = zipName.endsWith(".zip") ? zipName : `${zipName}.zip`;
      await this.downloadFile(content, finalZipName, {
        ...options,
        showToast: false,
      });
      
      if (showToast) {
        toast.success("ZIP Bundle Prepared", {
          description: `Packaged ${files.length} assets into ${finalZipName}`,
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

  /**
   * Copy text to clipboard
   */
  static async copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch (error) {
      toast.error("Copy failed");
    }
  }

  /**
   * Copy image blob to clipboard
   */
  static async copyImage(blob: Blob) {
    if (!navigator.clipboard?.write) {
      toast.error("Clipboard API not supported in this browser.");
      return;
    }
    try {
      const item = new ClipboardItem({ [blob.type]: blob });
      await navigator.clipboard.write([item]);
      toast.success("Image copied to clipboard");
    } catch (error) {
      console.error("Copy failed:", error);
      toast.error("Failed to copy image");
    }
  }

  /**
   * Share asset via Web Share API
   */
  static async shareFile(blob: Blob, filename: string, title?: string) {
    if (!navigator.share || !navigator.canShare) {
      toast.error("Sharing not supported on this device");
      return false;
    }
    try {
      const file = new File([blob], filename, { type: blob.type });
      if (!navigator.canShare({ files: [file] })) {
        toast.error("This file type cannot be shared");
        return false;
      }
      await navigator.share({ title: title || filename, files: [file] });
      return true;
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        toast.error("Sharing failed");
      }
      return false;
    }
  }
}
