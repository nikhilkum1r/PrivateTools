import { Metadata } from "next";
import MergeStudioClient from "./MergeStudioClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Merge PDF Online - Free, Secure & Batch | SafeTools",
  description: "Combine multiple PDF files and images into a single PDF document. 100% private, browser-based assembly. No uploads, no limits.",
  keywords: ["merge pdf", "combine pdf online", "pdf joiner", "private pdf merger", "batch pdf assembly", "pdf to image merger"],
  openGraph: {
    title: "SafeTools PDF Merger | Privacy-First Assembly",
    description: "Assemble your documents securely in your browser. Files never leave your device.",
    type: "website",
    url: "https://safetools.space/pdf/merge",
  },
};

export default function PDFMergePage() {
  return (
    <>
      <SEOStructuredData 
        name="PDF Merger"
        description="Securely assemble multiple documents into a single PDF directly in your browser."
        url="https://safetools.space/pdf/merge"
      />
      <MergeStudioClient />
    </>
  );
}
