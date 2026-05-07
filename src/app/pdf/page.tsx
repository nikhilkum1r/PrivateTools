import { Metadata } from "next";
import PDFHubClient from "./PDFHubClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Professional PDF Processing Suite - Free & Private | SafeTools",
  description: "A comprehensive suite of local PDF tools. Merge, split, convert, and scrub PDF documents with 100% privacy and zero server uploads.",
  keywords: ["pdf tools online", "private pdf processing", "pdf merger hub", "pdf splitter hub", "online pdf editor hub", "secure pdf tools"],
  openGraph: {
    title: "SafeTools PDF Studio | Universal Document Intelligence",
    description: "The ultimate local-first PDF processing suite. Fast, private, and powerful.",
    type: "website",
    url: "https://safetools.space/pdf",
  },
};

export default function PDFPage() {
  return (
    <>
      <SEOStructuredData 
        name="PDF Processing Suite"
        description="A comprehensive suite of professional PDF tools including merging, splitting, and metadata scrubbing, all running locally in your browser."
        url="https://safetools.space/pdf"
      />
      <PDFHubClient />

      {/* SEO Content Section */}
      <section className="container mx-auto px-4 py-24 border-t border-white/5">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-black italic">Professional PDF Engineering</h2>
            <p className="text-muted-foreground leading-relaxed">
              SafeTools PDF Studio provides industrial-grade document surgery tools that run entirely in your browser. 
              By utilizing advanced WebAssembly (WASM) engines, we bring the processing power of enterprise software 
              directly to your device, ensuring that your sensitive legal, medical, and financial documents never 
              leave your local environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Is it safe to merge sensitive PDFs?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Absolutely. Unlike traditional online PDF editors, SafeTools does not use a backend server for processing. 
                Your files are combined in your browser's RAM and the output is generated locally. This makes it the 
                safest option for processing documents with PII (Personally Identifiable Information).
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold">What is the maximum file size?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Because processing happens on your device, the only limit is your system's available memory (RAM). 
                SafeTools can typically handle PDFs up to 1GB or more, depending on your hardware specifications.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
