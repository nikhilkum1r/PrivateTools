import { Metadata } from "next";
import ProtectPdfClient from "./ProtectPdfClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Protect PDF Files | Add Password Security to PDFs",
  description: "Protect PDF files with password encryption securely in your browser. Privacy-first PDF protection tool with zero uploads and local processing.",
  keywords: [
    "protect PDF",
    "password protect PDF",
    "encrypt PDF",
    "secure PDF",
    "PDF password protection",
    "browser PDF encryption",
    "local PDF protection",
    "secure PDF online",
    "PDF permissions",
    "privacy PDF tool"
  ],
  openGraph: {
    title: "Protect PDF Files | Add Password Security to PDFs",
    description: "Protect PDF files with password encryption securely in your browser. Privacy-first PDF protection tool with zero uploads and local processing.",
    type: "website",
    url: "https://safetools.space/pdf/protect-pdf",
  },
};

export default function ProtectPdfPage() {
  return (
    <>
      <SEOStructuredData 
        name="Protect PDF Files"
        description="Protect PDF files with password encryption securely in your browser. Privacy-first PDF protection tool with zero uploads and local processing."
        url="https://safetools.space/pdf/protect-pdf"
        faqItems={[
          { q: "Are PDF files uploaded to servers?", a: "No. PDF protection happens locally inside your browser." },
          { q: "What encryption is supported?", a: "Modern PDF encryption standards such as AES-based protection can be supported." },
          { q: "Does this tool work offline?", a: "Yes. Offline support can be enabled through PWA functionality." },
          { q: "Can SafeTools access my PDFs?", a: "No. Files remain locally processed and are never stored." },
          { q: "Can I restrict printing and editing?", a: "Yes. Permission restrictions can be added to supported PDFs." }
        ].map(f => ({ question: f.q, answer: f.a }))}
        breadcrumbs={[
          { name: "Home", item: "https://safetools.space" },
          { name: "PDF Tools", item: "https://safetools.space/pdf" },
          { name: "Protect PDF", item: "https://safetools.space/pdf/protect-pdf" }
        ]}
      />
      <ProtectPdfClient />
    </>
  );
}
