import { Metadata } from "next";
import SplitStudioClient from "./SplitStudioClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Split PDF Online - Extract Pages & Divide Documents | SafeTools",
  description: "Split PDF files into individual pages or extract specific ranges. Secure, browser-based splitting with zero server uploads. Free and private PDF extraction.",
  keywords: ["split pdf", "extract pages from pdf", "divide pdf online", "pdf page extractor", "private pdf splitter", "extract pdf range"],
  openGraph: {
    title: "SafeTools PDF Splitter | Privacy-First Extraction",
    description: "Surgically extract or divide your PDF documents securely in your browser.",
    type: "website",
    url: "https://safetools.space/pdf/split",
  },
};

export default function PDFSplitPage() {
  return (
    <>
      <SEOStructuredData 
        name="PDF Splitter"
        description="Securely extract or divide PDF documents directly in your browser. zero server uploads."
        url="https://safetools.space/pdf/split"
      />
      <SplitStudioClient />
    </>
  );
}
