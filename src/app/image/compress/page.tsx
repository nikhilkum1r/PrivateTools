import { Metadata } from "next";
import CompressorStudioClient from "./CompressorStudioClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Professional Image Compressor | Batch Optimize Online (100% Private)",
  description: "Shrink images instantly with our professional image compressor. Batch optimize PNG, JPG, WebP & AVIF locally in your browser. No uploads, zero tracking, maximum quality.",
  keywords: ["image compressor", "batch image optimizer", "private image compression", "compress png online", "reduce jpg size", "webp optimizer"],
  openGraph: {
    title: "SafeTools Image Compressor | Professional Studio",
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
        breadcrumbs={[
          { name: "Home", item: "https://safetools.space" },
          { name: "Image Tools", item: "https://safetools.space/image" },
          { name: "Image Compressor", item: "https://safetools.space/image/compress" }
        ]}
      />
      <CompressorStudioClient />
    </>
  );
}
