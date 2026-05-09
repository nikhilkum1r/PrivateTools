import { Metadata } from "next";
import WordToPdfClient from "./WordToPdfClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";
import { WORD_TO_PDF_FAQ } from "@/lib/faq-content";

export const metadata: Metadata = {
  title: "Word to PDF Converter Online Free – Convert DOC & DOCX to PDF Securely | SafeTools",
  description: "Convert Word documents to PDF online for free with secure browser-based processing. Fast DOC and DOCX to PDF conversion with no uploads, watermark, or registration required.",
  keywords: ["word to pdf converter", "doc to pdf", "docx to pdf", "convert word to pdf online", "free word to pdf converter", "online docx to pdf converter", "secure word to pdf tool", "browser based pdf converter", "convert microsoft word to pdf", "best word to pdf converter", "fast doc to pdf converter", "private word to pdf conversion", "free pdf creator", "online pdf generator", "word file to pdf online"],
  openGraph: {
    title: "Word to PDF Converter Online Free – Convert DOC & DOCX to PDF Securely | SafeTools",
    description: "Convert Word documents to PDF online for free with secure browser-based processing. Fast DOC and DOCX to PDF conversion with no uploads, watermark, or registration required.",
    type: "website",
    url: "https://safetools.space/document/word-to-pdf",
  },
};

export default function WordToPdfPage() {
  return (
    <>
      <SEOStructuredData 
        name="Word to PDF Converter"
        description="Convert Word documents to PDF online for free with secure browser-based processing. Fast DOC and DOCX to PDF conversion with no uploads, watermark, or registration required."
        url="https://safetools.space/document/word-to-pdf"
        faqItems={WORD_TO_PDF_FAQ}
      />
      <WordToPdfClient />
    </>
  );
}
