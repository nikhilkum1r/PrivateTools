import { Metadata } from "next";
import OCRClient from "./OCRClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Free Online OCR Tool | Extract Text From Images & PDFs",
  description: "Extract text from images, screenshots, handwritten notes, and scanned PDFs instantly using our free privacy-first online OCR tool. Fast AI-powered text recognition with no uploads.",
  keywords: ["OCR online free", "image to text converter", "extract text from image", "OCR PDF tool", "screenshot text extractor", "handwriting OCR", "scanned document OCR", "free OCR software", "AI OCR tool", "browser based OCR", "optical character recognition", "image to editable text", "PDF OCR online", "multilingual OCR", "OCR without upload"],
  openGraph: {
    title: "SafeTools OCR | Free Online OCR Tool - Extract Text From Images Instantly",
    description: "Convert images, scanned documents, screenshots, handwritten notes, and PDFs into editable text using our privacy-first browser-based OCR tool. Fast, accurate, and completely free.",
    type: "website",
    url: "https://safetools.space/image/ocr",
  },
};

export default function OCRPage() {
  return (
    <>
      <SEOStructuredData 
        name="Free Online OCR Tool - Extract Text From Images"
        description="Convert images, screenshots, and PDFs into editable text instantly with our privacy-first browser-based OCR tool. 100% free, secure, and local processing."
        url="https://safetools.space/image/ocr"
      />
      <OCRClient />
    </>
  );
}
