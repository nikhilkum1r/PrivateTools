import { Metadata } from "next";
import CompressPdfClient from "./CompressPdfClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Compress PDF Files Online | Free Privacy-First PDF Compressor",
  description: "Compress PDF files securely in your browser with zero uploads and zero tracking. Reduce PDF size instantly using privacy-first local processing.",
  keywords: [
    "compress PDF",
    "PDF compressor",
    "reduce PDF size",
    "PDF optimizer",
    "shrink PDF",
    "browser PDF compressor",
    "local PDF compression",
    "secure PDF compression",
    "privacy PDF tool",
    "compress PDF without upload"
  ],
  openGraph: {
    title: "Compress PDF Files Online | Free Privacy-First PDF Compressor",
    description: "Compress PDF files securely in your browser with zero uploads and zero tracking. Reduce PDF size instantly using privacy-first local processing.",
    type: "website",
    url: "https://safetools.space/pdf/compress-pdf",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compress PDF Files Online | Free Privacy-First PDF Compressor",
    description: "Compress PDF files securely in your browser with zero uploads and zero tracking. Reduce PDF size instantly using privacy-first local processing.",
    images: ["/og-image.webp"],
  },
  alternates: { canonical: "/pdf/compress-pdf" },
};

export default function CompressPdfPage() {
  return (
    <>
      <SEOStructuredData 
        name="Compress PDF Files Online"
        description="Compress PDF files securely in your browser with zero uploads and zero tracking. Reduce PDF size instantly using privacy-first local processing."
        url="https://safetools.space/pdf/compress-pdf"
        faqItems={[
          { q: "Are PDF files uploaded to servers?", a: "No. PDF compression happens locally inside your browser." },
          { q: "Will compression reduce PDF quality?", a: "Compression levels can affect image quality depending on settings." },
          { q: "Does this tool work offline?", a: "Yes. Offline support can be enabled through PWA functionality." },
          { q: "Can SafeTools access my PDFs?", a: "No. Files remain locally processed and are not stored." },
          { q: "Can I compress large PDFs?", a: "Yes. Performance depends on browser memory and device capabilities." }
        ].map(f => ({ question: f.q, answer: f.a }))}
        breadcrumbs={[
          { name: "Home", item: "https://safetools.space" },
          { name: "PDF Tools", item: "https://safetools.space/pdf" },
          { name: "Compress PDF", item: "https://safetools.space/pdf/compress-pdf" }
        ]}
      />
      <CompressPdfClient />
    </>
  );
}
