import { Metadata } from "next";
import OCRClient from "./OCRClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Online OCR - Extract Text from Images Free & Private | SafeTools",
  description: "Extract text from images (JPG, PNG, WebP) instantly using professional-grade OCR. Multi-language support, 100% private local processing, zero server uploads.",
  keywords: ["online ocr", "extract text from image", "image to text converter", "free ocr tool", "private ocr", "scan text from photo", "ocr multi language", "tesseract online"],
  openGraph: {
    title: "SafeTools OCR Studio | Professional Neural Text Extraction",
    description: "Convert your images into editable text securely in your browser. Powerful, private, and precise.",
    type: "website",
    url: "https://safetools.space/image/ocr",
  },
};

export default function OCRPage() {
  return (
    <>
      <SEOStructuredData 
        name="Image OCR (Optical Character Recognition)"
        description="Extract clean text from any image instantly using professional-grade neural recognition. 100% private local processing."
        url="https://safetools.space/image/ocr"
      />
      <OCRClient />
    </>
  );
}
