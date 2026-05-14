/**
 * All user-facing strings.
 * Centralised here so they can be swapped for i18n in Phase 3.
 */

export const STRINGS = {
  errors: {
    fileTooBig: (module: string, limit: string) => `This file exceeds the ${limit} free limit for ${module}. Upgrade to Pro for larger files.`,
    unsupportedType: (types: string) => `Unsupported file type. This tool accepts: ${types}`,
    corruptedFile: "This file appears to be corrupted or unreadable.",
    zeroByte: "This file is empty (0 bytes). Please select a valid file.",
    noHttps: "This feature requires HTTPS. Please access this app over a secure connection.",
    ffmpegCrash: "Processing failed. Try a smaller file or reload the page.",
    pdfPassword: "This PDF is password-protected. Remove the password before uploading.",
    pdfNoPages: "This PDF has no pages.",
    qrNotDetected: "QR code not detected. Try a higher resolution or clearer image.",
    cameraPermission: "Camera permission denied. You can still scan by uploading an image.",
    stegPngRequired: "Steganography requires a PNG file. JPEG compression destroys hidden data.",
    lockedFileMagic: "This file doesn't appear to be a SafeTools locked file.",
    webCryptoNoHttps: "Encryption requires HTTPS. Please access the app over HTTPS.",
    processingFailed: "Something went wrong during processing. Please try again.",
  },
  labels: {
    download: "Download",
    copyToClipboard: "Copy to Clipboard",
    share: "Share",
    reset: "Reset",
    processing: "Processing…",
    uploading: "Uploading…",
    dragDrop: "Drag & drop files here, or click to browse",
    noFileSelected: "No file selected",
    fileReady: "File ready",
    done: "Done!",
    upgrade: "Upgrade to Pro",
    proComingSoon: "Pro  Coming Soon",
  },
  badges: {
    privacy: "No data leaves your device",
    pro: "Processing on our secure server",
    free: "Free  Browser Only",
    new: "NEW",
    beta: "BETA",
  },
  disclaimers: {
    metadataInjector: {
      title: "⚠️ Legal Disclaimer  Metadata Injector",
      body: "This tool is provided for legitimate privacy, testing, and research purposes only. Injecting false metadata into files with the intent to deceive, defraud, or misrepresent is illegal in many jurisdictions. By continuing, you confirm you have legal authority to modify this file and accept full responsibility for your use of this tool.",
    },
    steganography: {
      title: "⚠️ Legal Disclaimer  Steganography",
      body: "This tool hides data inside images using LSB encoding. It is intended for privacy, watermarking, and research use only. Using steganography to conceal illegal content or activities is strictly prohibited. By continuing, you accept full responsibility for your use of this tool.",
    },
    fileShredder: {
      title: "⚠️ Important  File Shredder",
      body: "This tool overwrites your file's data with random bytes in browser memory. It does NOT delete the original file from your hard drive, SSD, or storage device  that requires OS-level secure deletion tools. Download the shredded file as proof of in-memory overwrite. By continuing, you confirm you understand this limitation.",
    },
  },
} as const;
