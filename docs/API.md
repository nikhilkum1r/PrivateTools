# 🛠️ Image Processor API

The SafeTools image engine is a modular, worker-offloaded system designed for high-performance, local-first image manipulation.

## Core Functions

### `processImage(file: File, options: ProcessOptions, onProgress?: Function)`
The main entry point for image processing.
- **Worker**: Automatically offloads to `image.worker.ts` if `OffscreenCanvas` is supported.
- **Fallback**: Executes in the main thread for older browsers.

## Types

### `ProcessOptions`
```typescript
interface ProcessOptions {
  format: 'jpeg' | 'png' | 'webp' | 'avif' | 'tiff' | 'pdf' | 'svg';
  quality: number; // 1-100
  maxWidth?: number;
  maxHeight?: number;
  rotate?: number;
  flipX?: boolean;
  flipY?: boolean;
  brightness?: number;
  contrast?: number;
  saturation?: number;
  filter?: 'none' | 'grayscale' | 'sepia' | 'invert' | 'vivid';
  watermarkText?: string;
  blurs?: { x: number; y: number; width: number; height: number }[];
  targetSize?: number; // In bytes
}
```

## Modules

### 📂 `decoders.ts`
Handles complex file decoding:
- **HEIC/HEIF**: via `heic2any`.
- **PSD**: via `psd.js`.
- **TIFF**: via `utif`.
- **RAW**: via `exifreader`.
- **PDF**: via `pdfjs-dist`.
- **Docs**: via `mammoth` & `xlsx`.

### 📂 `transformers.ts`
Handles canvas transformations:
- **Filters**: Brightness, Contrast, Saturation.
- **Privacy**: High-performance Gaussian blur for sensitive regions.
- **Watermark**: Standard canvas text overlays.

### 📂 `encoders.ts`
Handles binary search compression for target sizes and final format encoding.
