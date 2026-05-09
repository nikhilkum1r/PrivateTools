import { Metadata } from "next";
import SplitPdfClient from "./SplitPdfClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Split PDF Files Online | Free Privacy-First PDF Splitter",
  description: "Split PDF files securely in your browser with zero uploads and zero tracking. Extract pages and separate PDFs using privacy-first local processing.",
  keywords: [
    "split PDF",
    "PDF splitter",
    "extract PDF pages",
    "separate PDF",
    "divide PDF",
    "browser PDF splitter",
    "local PDF split",
    "secure PDF splitting",
    "privacy PDF tools",
    "split PDF without upload"
  ],
  openGraph: {
    title: "Split PDF Files Online | Free Privacy-First PDF Splitter",
    description: "Split PDF files securely in your browser with zero uploads and zero tracking. Extract pages and separate PDFs using privacy-first local processing.",
    type: "website",
    url: "https://safetools.space/pdf/split-pdf",
  },
  twitter: {
    card: "summary_large_image",
    title: "Split PDF Files Online | Free Privacy-First PDF Splitter",
    description: "Split PDF files securely in your browser with zero uploads and zero tracking. Extract pages and separate PDFs using privacy-first local processing.",
    images: ["/og-image.webp"],
  },
  alternates: { canonical: "/pdf/split-pdf" },
};

export default function SplitPdfPage() {
  return (
    <>
      <SEOStructuredData 
        name="Split PDF Files Online"
        description="Split PDF files securely in your browser with zero uploads and zero tracking. Extract pages and separate PDFs using privacy-first local processing."
        url="https://safetools.space/pdf/split-pdf"
        faqItems={[
          { q: "Are PDF files uploaded to servers?", a: "No. PDF splitting happens locally inside your browser." },
          { q: "Can I extract only specific pages?", a: "Yes. Custom page extraction should be supported." },
          { q: "Does this tool work offline?", a: "Yes. Offline support can be enabled through PWA functionality." },
          { q: "Can SafeTools access my PDFs?", a: "No. Files remain locally processed and are not stored." },
          { q: "Can I split large PDF files?", a: "Yes. Performance depends on browser memory and device capabilities." }
        ].map(f => ({ question: f.q, answer: f.a }))}
        breadcrumbs={[
          { name: "Home", item: "https://safetools.space" },
          { name: "PDF Tools", item: "https://safetools.space/pdf" },
          { name: "Split PDF", item: "https://safetools.space/pdf/split-pdf" }
        ]}
      />
      <SplitPdfClient />
    </>
  );
}
