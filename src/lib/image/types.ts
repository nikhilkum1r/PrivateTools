import { ImageFormat } from "@/store/useImageStore";

export interface ProcessOptions {
  format: ImageFormat;
  quality: number;
  maxWidth?: number;
  maxHeight?: number;
  rotate?: number;
  flipX?: boolean;
  flipY?: boolean;
  brightness?: number;
  contrast?: number;
  saturation?: number;
  filter?: string;
  watermarkText?: string;
  watermarkColor?: string;
  watermarkSize?: number;
  targetSize?: number;
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  blurs?: {
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
  stripMetadata?: boolean;
}

export interface ProcessingResult {
  blob: Blob;
  url: string;
}
