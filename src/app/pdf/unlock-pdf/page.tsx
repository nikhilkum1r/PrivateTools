import { Metadata } from "next";
import UnlockPdfClient from "./UnlockPdfClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Unlock PDF Files | Remove PDF Password Protection Securely",
  description: "Unlock password-protected PDF files securely in your browser with zero uploads and zero tracking. Privacy-first PDF password removal tool.",
  keywords: [
    "unlock PDF",
    "PDF unlock tool",
    "remove PDF password",
    "PDF password remover",
    "decrypt PDF",
    "browser PDF unlock",
    "local PDF unlock",
    "secure PDF unlock",
    "online PDF password remover",
    "privacy PDF tool"
  ],
  openGraph: {
    title: "Unlock PDF Files | Remove PDF Password Protection Securely",
    description: "Unlock password-protected PDF files securely in your browser with zero uploads and zero tracking. Privacy-first PDF password removal tool.",
    type: "website",
    url: "https://safetools.space/pdf/unlock-pdf",
  },
  twitter: {
    card: "summary_large_image",
    title: "Unlock PDF Files | Remove PDF Password Protection Securely",
    description: "Unlock password-protected PDF files securely in your browser with zero uploads and zero tracking. Privacy-first PDF password removal tool.",
    images: ["/og-image.webp"],
  },
  alternates: { canonical: "/pdf/unlock-pdf" },
};

export default function UnlockPdfPage() {
  return (
    <>
      <SEOStructuredData 
        name="Unlock PDF Files"
        description="Unlock password-protected PDF files securely in your browser with zero uploads and zero tracking. Privacy-first PDF password removal tool."
        url="https://safetools.space/pdf/unlock-pdf"
        faqItems={[
          { q: "Are PDF files uploaded to servers?", a: "No. All PDF processing happens locally inside your browser." },
          { q: "Can all PDFs be unlocked?", a: "Some PDFs require the correct password before restrictions can be removed." },
          { q: "Does this tool work offline?", a: "Yes. Offline support can be enabled through PWA functionality." },
          { q: "Can SafeTools access my PDFs?", a: "No. Files remain locally processed and are not stored." },
          { q: "Is unlocking PDFs legal?", a: "Only unlock files you own or are authorized to access." }
        ].map(f => ({ question: f.q, answer: f.a }))}
        breadcrumbs={[
          { name: "Home", item: "https://safetools.space" },
          { name: "PDF Tools", item: "https://safetools.space/pdf" },
          { name: "Unlock PDF", item: "https://safetools.space/pdf/unlock-pdf" }
        ]}
      />
      <UnlockPdfClient />
    </>
  );
}
