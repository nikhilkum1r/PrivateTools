/**
 * Supported formats for the Image Compressor SEO landing pages.
 */
export const SUPPORTED_COMPRESSION_FORMATS = [
  "png", "jpeg", "jpg", "webp", "avif", "heic", "heif", "svg", "tiff", "tif", 
  "gif", "ico", "bmp", "raw", "dng", "nef", "arw", "cr2", "psd", "ai", "eps",
  "jxl", "tga", "dds", "exr"
];

/**
 * Supported conversion pairs for the Image Converter SEO landing pages.
 * Expanded to cover high-volume search queries.
 */
export const SUPPORTED_CONVERSION_SLUGS = [
  // Common
  "jpg-to-png", "png-to-jpg", "webp-to-jpg", "webp-to-png",
  "heic-to-jpg", "heic-to-png", "pdf-to-jpg", "pdf-to-png",
  "svg-to-png", "tiff-to-jpg", "raw-to-jpg", "avif-to-jpg",
  
  // Modern Web
  "png-to-webp", "jpg-to-webp", "webp-to-avif", "avif-to-webp",
  "png-to-avif", "jpg-to-avif", "heic-to-webp", "svg-to-webp",
  
  // Design & Professional
  "psd-to-png", "psd-to-jpg", "ai-to-png", "ai-to-svg",
  "eps-to-png", "eps-to-svg", "tiff-to-png", "tiff-to-pdf",
  "raw-to-png", "dng-to-jpg", "dng-to-png",
  
  // Office & Documents
  "jpg-to-pdf", "png-to-pdf", "webp-to-pdf", "heic-to-pdf",
  "svg-to-pdf", "bmp-to-pdf", "gif-to-pdf", "pdf-to-webp",
  
  // Specialized
  "ico-to-png", "png-to-ico", "jpg-to-ico", "gif-to-png",
  "gif-to-jpg", "gif-to-webp", "bmp-to-jpg", "bmp-to-png",
  "svg-to-jpg", "png-to-svg", "jpg-to-svg"
];
