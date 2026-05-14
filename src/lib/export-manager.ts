import { toast } from "sonner";

interface ExportOptions {
  showToast?: boolean;
  onProgress?: (progress: number) => void;
  revocationDelay?: number;
  description?: string;
  messages?: {
    exportSuccess?: string;
    exportDesc?: string;
    exportFailed?: string;
    exportFailedDesc?: string;
    zipSuccess?: string;
    zipSuccessDesc?: string;
    zipFailed?: string;
    zipFailedDesc?: string;
    networkFailed?: string;
    copySuccess?: string;
    copyFailed?: string;
    unsupported?: string;
    shareUnsupported?: string;
    shareFailed?: string;
  };
}

export class ExportManager {
  /**
   * Export a single file as a download
   */
  static async downloadFile(blob: Blob, filename: string, options: ExportOptions = {}) {
    const { showToast = true, revocationDelay = 1000, description, messages } = options;
    
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
        toast.success(messages?.exportSuccess || `Exported: ${filename}`, {
          description: description || messages?.exportDesc || `${(blob.size / 1024).toFixed(1)} KB · Sovereign Local Export`,
        });
      }
    } catch (error) {
      console.error("Export failed:", error);
      toast.error(messages?.exportFailed || "Export Failed", {
        description: messages?.exportFailedDesc || "An error occurred while generating the download link.",
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
    const { showToast = true, onProgress, messages } = options;
    
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
        toast.success(messages?.zipSuccess || "ZIP Bundle Prepared", {
          description: messages?.zipSuccessDesc?.replace("{count}", files.length.toString()).replace("{name}", finalZipName) || `Packaged ${files.length} assets into ${finalZipName}`,
        });
      }
    } catch (error) {
      console.error("ZIP export failed:", error);
      toast.error(messages?.zipFailed || "ZIP Export Failed", {
        description: messages?.zipFailedDesc || "Failed to bundle assets. Try individual exports.",
      });
    }
  }

  /**
   * Helper to fetch and download from URL
   */
  static async downloadFromUrl(url: string, filename: string, options: ExportOptions = {}) {
    try {
      // If it's a blob URL, we can just download it directly without fetch
      if (url.startsWith('blob:')) {
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        setTimeout(() => document.body.removeChild(a), 1000);
        
        if (options.showToast !== false) {
          toast.success(options.messages?.exportSuccess || `Exported: ${filename}`);
        }
        return;
      }

      // For external URLs, we need to fetch to bypass CORS/download restrictions
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
      const blob = await response.blob();
      await this.downloadFile(blob, filename, options);
    } catch (error) {
      console.error("URL export failed:", error);
      
      // Fallback: try direct link if fetch fails
      try {
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.target = "_blank";
        a.click();
      } catch (fallbackError) {
        toast.error(options.messages?.networkFailed || "Network Export Failed");
      }
    }
  }

  /**
   * Copy text to clipboard
   */
  static async copyText(text: string, options: ExportOptions = {}) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(options.messages?.copySuccess || "Copied to clipboard");
    } catch (error) {
      toast.error(options.messages?.copyFailed || "Copy failed");
    }
  }

  /**
   * Copy image blob to clipboard
   */
  static async copyImage(blob: Blob, options: ExportOptions = {}) {
    if (!navigator.clipboard?.write) {
      toast.error(options.messages?.unsupported || "Clipboard API not supported in this browser.");
      return;
    }
    try {
      const item = new ClipboardItem({ [blob.type]: blob });
      await navigator.clipboard.write([item]);
      toast.success(options.messages?.copySuccess || "Image copied to clipboard");
    } catch (error) {
      console.error("Copy failed:", error);
      toast.error(options.messages?.copyFailed || "Failed to copy image");
    }
  }

  /**
   * Share asset via Web Share API
   */
  static async shareFile(blob: Blob, filename: string, title?: string, options: ExportOptions = {}) {
    if (!navigator.share || !navigator.canShare) {
      toast.error(options.messages?.shareUnsupported || "Sharing not supported on this device");
      return false;
    }
    try {
      const file = new File([blob], filename, { type: blob.type });
      if (!navigator.canShare({ files: [file] })) {
        toast.error(options.messages?.unsupported || "This file type cannot be shared");
        return false;
      }
      await navigator.share({ title: title || filename, files: [file] });
      return true;
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        toast.error(options.messages?.shareFailed || "Sharing failed");
      }
      return false;
    }
  }
}
