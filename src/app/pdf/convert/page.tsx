import { Metadata } from "next";
import PDFConverterClient from "./PDFConverterClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Convert PDF to Word & PPTX Online - Free & Private | SafeTools",
  description: "Convert PDF documents to editable Word (.docx) and PowerPoint (.pptx) formats securely in your browser. zero server uploads, 100% layout preservation.",
  keywords: ["pdf to word", "pdf to pptx", "convert pdf to editable word", "convert pdf to powerpoint", "private pdf converter", "browser pdf conversion"],
  openGraph: {
    title: "SafeTools Document Studio | Professional PDF Reconstruction",
    description: "Reconstruct your PDF documents into editable formats securely in your browser.",
    type: "website",
    url: "https://safetools.space/pdf/convert",
  },
};

export default function PDFConverterPage() {
  return (
    <>
      <SEOStructuredData 
        name="PDF to Word & PPTX Converter"
        description="Reconstruct PDF documents into editable Word and PowerPoint formats securely in your browser. zero server uploads."
        url="https://safetools.space/pdf/convert"
      />
      <PDFConverterClient />
    </>
  );
}
