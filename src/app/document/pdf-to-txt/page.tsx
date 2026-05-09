import { Metadata } from "next";
import PdfToTxtClient from "./PdfToTxtClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";
import { PDF_TO_TXT_FAQ } from "@/lib/faq-content";

export const metadata: Metadata = {
  title: "PDF to TXT Converter Online Free – Extract Text from PDF Instantly | SafeTools",
  description: "Convert PDF to TXT online for free with secure browser-based processing. Extract plain text from PDF files instantly without uploads, registration, or watermarks.",
  keywords: ["pdf to txt", "pdf to text converter", "extract text from pdf", "convert pdf to txt online", "free pdf to txt converter", "online pdf text extractor", "secure pdf text converter", "browser based pdf converter", "extract plain text from pdf", "pdf text extraction tool", "convert scanned pdf to text", "fast pdf to txt converter", "pdf content extractor", "online text extraction tool", "free txt generator"],
  openGraph: {
    title: "PDF to TXT Converter Online Free – Extract Text from PDF Instantly | SafeTools",
    description: "Convert PDF to TXT online for free with secure browser-based processing. Extract plain text from PDF files instantly without uploads, registration, or watermarks.",
    type: "website",
    url: "https://safetools.space/document/pdf-to-txt",
  },
};

export default function PdfToTxtPage() {
  return (
    <>
      <SEOStructuredData 
        name="PDF to TXT Converter"
        description="Convert PDF to TXT online for free with secure browser-based processing. Extract plain text from PDF files instantly without uploads, registration, or watermarks."
        url="https://safetools.space/document/pdf-to-txt"
        faqItems={PDF_TO_TXT_FAQ}
      />
      <PdfToTxtClient />
    </>
  );
}
