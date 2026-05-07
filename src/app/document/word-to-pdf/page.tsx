import { Metadata } from "next";
import WordToPdfClient from "./WordToPdfClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Convert Word to PDF Online - Free & Private | SafeTools",
  description: "Convert .docx documents to PDF securely in your browser. No server uploads, no privacy risks. Professional-grade Word to PDF conversion using local processing.",
  keywords: ["word to pdf", "convert docx to pdf online", "free word to pdf", "private word converter", "docx to pdf browser", "convert word document to pdf"],
  openGraph: {
    title: "SafeTools Word to PDF | Privacy-First Conversion",
    description: "Surgically convert your Word documents to PDF securely in your browser.",
    type: "website",
    url: "https://safetools.space/document/word-to-pdf",
  },
};

export default function WordToPdfPage() {
  return (
    <>
      <SEOStructuredData 
        name="Word to PDF Converter"
        description="Convert .docx documents to PDF securely in your browser. No server uploads, no privacy risks."
        url="https://safetools.space/document/word-to-pdf"
      />
      <WordToPdfClient />
    </>
  );
}
