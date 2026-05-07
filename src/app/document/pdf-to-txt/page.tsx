import { Metadata } from "next";
import PdfToTxtClient from "./PdfToTxtClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Online PDF to Text Converter - Extract Text from PDF | SafeTools",
  description: "Extract clean text from PDF documents instantly in your browser. Preserves page structure and layout. 100% private, zero server uploads.",
  keywords: ["pdf to text converter", "extract text from pdf", "pdf to txt online", "private pdf tools", "browser based pdf extraction"],
  openGraph: {
    title: "SafeTools PDF Studio | Professional Text Extraction",
    description: "Extract text from your PDF documents securely in your browser. Precise, private, and powerful.",
    type: "website",
    url: "https://safetools.space/document/pdf-to-txt",
  },
};

export default function PdfToTxtPage() {
  return (
    <>
      <SEOStructuredData 
        name="PDF to Text Converter"
        description="Extract clean text from PDF documents instantly in your browser with zero privacy risks."
        url="https://safetools.space/document/pdf-to-txt"
      />
      <PdfToTxtClient />
    </>
  );
}
