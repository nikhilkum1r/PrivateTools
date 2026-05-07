import { Metadata } from "next";
import DocumentHubClient from "./DocumentHubClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Online Document Conversion & Text Utilities | SafeTools",
  description: "Convert Word to PDF, extract text from PDF, and access a suite of text utilities. All processed locally in your browser with 100% privacy.",
  keywords: ["document conversion online", "word to pdf converter", "extract text from pdf", "text utilities online", "private document tools", "browser based office tools"],
  openGraph: {
    title: "SafeTools Document Studio | Universal Text Intelligence",
    description: "The ultimate local-first document processing suite. Fast, private, and powerful.",
    type: "website",
    url: "https://safetools.space/document",
  },
};

export default function DocumentHubPage() {
  return (
    <>
      <SEOStructuredData 
        name="Document Utility Suite"
        description="A comprehensive suite of document tools including conversion, text extraction, and formatting, all running locally in your browser."
        url="https://safetools.space/document"
      />
      <DocumentHubClient />

      {/* SEO Content Section */}
      <section className="container mx-auto px-4 py-24 border-t border-white/5">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-black italic">Universal Document Intelligence</h2>
            <p className="text-muted-foreground leading-relaxed">
              SafeTools Document Studio is the world's first browser-based Office and PDF engineering suite 
              that prioritizes privacy above all else. By utilizing local WebAssembly (WASM) and high-performance 
              Javascript parsers, we provide the ability to view, edit, and convert documents without ever 
              creating a temporary copy on a remote server.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Can I edit DOCX and PPTX files?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Yes. Our Docs Master tool provides a visual preview and structural editing capabilities 
                for Microsoft Office formats. All edits are applied locally and saved back to your device 
                instantly, ensuring 100% data residency.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold">How does private text extraction work?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We use client-side OCR and text layer extraction technologies. When you drop a PDF or Image, 
                our local engine scans the character matrix on your CPU/GPU, allowing you to copy text 
                without any external API calls or data harvesting.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
