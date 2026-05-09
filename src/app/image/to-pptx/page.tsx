import { Metadata } from "next";
import ImageToPptxClient from "./ImageToPptxClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Image to PPTX Converter Online Free – Convert JPG, PNG & Images to PowerPoint Slides",
  description: "Convert JPG, PNG, and WebP into PowerPoint PPTX presentations online for free. Fast, secure, browser-based Image to PPTX converter with zero uploads.",
  keywords: ["convert image to pptx", "photos to powerpoint", "image to slides converter", "JPG to PPTX", "PNG to PowerPoint", "WEBP to PPTX", "BMP to PPTX", "GIF to PPTX", "TIFF to PPTX"],
  openGraph: {
    title: "Image to PPTX Converter – Free Online JPG, PNG & WEBP to PowerPoint Tool",
    description: "Turn your images into professional PowerPoint presentations instantly with SafeTools’ free Image to PPTX Converter. No server uploads, 100% private.",
    type: "website",
    url: "https://safetools.space/image/to-pptx",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image to PPTX Converter Online Free – Convert JPG, PNG & Images to PowerPoint Slides",
    description: "Convert JPG, PNG, and WebP into PowerPoint PPTX presentations online for free. Fast, secure, browser-based Image to PPTX converter with zero uploads.",
    images: ["/og-image.webp"],
  },
  alternates: { canonical: "/image/to-pptx" },
};

export default function ImageToPptxPage() {
  return (
    <>
      <SEOStructuredData 
        name="Image to PPTX Converter"
        description="Transform media assets into professional PowerPoint presentations instantly. Create slides securely in your browser with zero server uploads."
        url="https://safetools.space/image/to-pptx"
      />
      <ImageToPptxClient />
    </>
  );
}
