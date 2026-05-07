import { Metadata } from "next";
import CompressorStudioClient from "./CompressorStudioClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Online Image Compressor - Free, Private & Batch | SafeTools",
  description: "Compress images online without losing quality. Support for PNG, JPG, WebP, AVIF and more. 100% private, browser-based optimization with zero server uploads.",
  keywords: ["image compressor", "compress image online", "reduce image size", "private image compression", "batch image optimizer"],
  openGraph: {
    title: "SafeTools Image Compressor | Privacy-First Optimization",
    description: "Shrink your images by up to 90% instantly in your browser. No signup, no tracking.",
    type: "website",
    url: "https://safetools.space/image/compress",
  },
};

export default function ImageCompressorPage() {
  return (
    <>
      <SEOStructuredData 
        name="Image Compressor"
        description="Professional-grade image compression directly in your browser. Zero server uploads."
        url="https://safetools.space/image/compress"
      />
      <CompressorStudioClient />
    </>
  );
}
