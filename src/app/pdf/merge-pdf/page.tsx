import { Metadata } from "next";
import MergePdfClient from "./MergePdfClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Merge PDF Files Online | Free Privacy-First PDF Merger",
  description: "Merge PDF files securely in your browser with zero uploads and zero tracking. Fast privacy-first PDF combiner with local processing.",
  keywords: [
    "merge PDF",
    "PDF merger",
    "combine PDF files",
    "merge PDFs online",
    "free PDF merge tool",
    "browser PDF merger",
    "local PDF merge",
    "secure PDF combiner",
    "privacy PDF tools",
    "PDF merge without upload"
  ],
  openGraph: {
    title: "Merge PDF Files Online | Free Privacy-First PDF Merger",
    description: "Merge PDF files securely in your browser with zero uploads and zero tracking. Fast privacy-first PDF combiner with local processing.",
    type: "website",
    url: "https://safetools.space/pdf/merge-pdf",
  },
  twitter: {
    card: "summary_large_image",
    title: "Merge PDF Files Online | Free Privacy-First PDF Merger",
    description: "Merge PDF files securely in your browser with zero uploads and zero tracking. Fast privacy-first PDF combiner with local processing.",
    images: ["/og-image.webp"],
  },
  alternates: { canonical: "/pdf/merge-pdf" },
};

export default function MergePdfPage() {
  return (
    <>
      <SEOStructuredData 
        name="Merge PDF Files"
        description="Merge PDF files securely in your browser with zero uploads and zero tracking. Fast privacy-first PDF combiner with local processing."
        url="https://safetools.space/pdf/merge-pdf"
        faqItems={[
          { q: "Are PDF files uploaded to servers?", a: "No. All PDF merging happens locally inside your browser." },
          { q: "Can I merge large PDF files?", a: "Yes. Performance depends on device memory and browser capabilities." },
          { q: "Does this tool work offline?", a: "Yes. Offline support can be enabled through PWA functionality." },
          { q: "Can SafeTools access my PDFs?", a: "No. Files remain locally processed and are never stored." },
          { q: "Can I rearrange PDF order?", a: "Yes. Drag-and-drop reordering should be supported." }
        ].map(f => ({ question: f.q, answer: f.a }))}
        breadcrumbs={[
          { name: "Home", item: "https://safetools.space" },
          { name: "PDF Tools", item: "https://safetools.space/pdf" },
          { name: "Merge PDF", item: "https://safetools.space/pdf/merge-pdf" }
        ]}
      />
      <MergePdfClient />
    </>
  );
}
