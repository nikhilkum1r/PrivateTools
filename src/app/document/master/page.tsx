import DocsMasterClient from "./DocsMasterClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Docs Master - Universal Online Document Processor | SafeTools",
  description: "View and edit PDF, DOCX, XLSX, PPTX, and CSV files privately in your browser. High-performance WASM rendering with zero-upload privacy.",
  keywords: ["docx viewer online", "pptx editor online", "xlsx reader", "pdf processor", "private document editor", "browser office suite", "wasm document rendering"],
  alternates: {
    canonical: "/document/master",
  },
  openGraph: {
    title: "SafeTools Docs Master | Universal Document Intelligence",
    description: "Universal document processor for PDF, DOCX, XLSX, PPTX, and CSV. No uploads, total privacy.",
    url: "https://safetools.space/document/master",
  },
};

export default function DocsMasterPage() {
  return (
    <>
      <SEOStructuredData 
        name="Docs Master"
        description="Universal document processor for PDF, DOCX, XLSX, PPTX, and CSV. View and edit files securely in your browser."
        url="https://safetools.space/document/master"
      />
      <DocsMasterClient />
    </>
  );
}
