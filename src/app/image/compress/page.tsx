import { Metadata } from "next";
import CompressorStudioClient from "./CompressorStudioClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Compress Images Online | Free Privacy-First Image Compressor",
  description: "Compress images securely in your browser with zero uploads and zero tracking. Reduce JPG, PNG, and WEBP image sizes using privacy-first local processing.",
  keywords: ["compress image", "image compressor", "reduce image size", "compress JPG", "compress PNG", "browser image compressor", "local image compression", "secure image optimization", "privacy image tools"],
  openGraph: {
    title: "SafeTools Image Compressor | Professional Browser Studio",
    description: "Compress images securely in your browser with zero uploads and zero tracking. Maximum quality, 100% private.",
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
