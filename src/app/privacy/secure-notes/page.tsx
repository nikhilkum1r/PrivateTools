import { Metadata } from "next";
import SecureNotesClient from "./SecureNotesClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Secure Notes Online | Privacy-First Encrypted Notes Tool",
  description: "Create encrypted secure notes directly in your browser with zero uploads, zero tracking, and privacy-first protection. Your notes stay private on your device.",
  keywords: ["secure notes", "encrypted notes", "private notes", "secure note app", "browser secure notes", "privacy notes", "local encrypted notes", "online secure notepad", "zero upload notes", "protected notes tool", "AES-256 encryption", "PBKDF2 security", "client-side encryption", "zero-trust notes", "open source privacy"],
  openGraph: {
    title: "Secure Notes Online | Privacy-First Encrypted Notes Tool",
    description: "Create encrypted secure notes directly in your browser with zero uploads, zero tracking, and privacy-first protection.",
    type: "website",
    url: "https://safetools.space/privacy/secure-notes",
  },
  twitter: {
    card: "summary_large_image",
    title: "Secure Notes Online | Privacy-First Encrypted Notes Tool",
    description: "Create encrypted secure notes directly in your browser with zero uploads, zero tracking, and privacy-first protection. Your notes stay private on your device.",
    images: ["/og-image.webp"],
  },
  alternates: { canonical: "/privacy/secure-notes" },
};

export default function SecureNotesPage() {
  return (
    <>
      <SEOStructuredData 
        name="Secure Notes Online"
        description="Create encrypted secure notes directly in your browser with zero uploads, zero tracking, and privacy-first protection. Your notes stay private on your device."
        url="https://safetools.space/privacy/secure-notes"
        faqItems={[
          { q: "Are my notes uploaded to servers?", a: "No. All notes are processed locally inside your browser." },
          { q: "Can SafeTools read my notes?", a: "No. Your encrypted notes remain under your control." },
          { q: "Does Secure Notes work offline?", a: "Yes. Most functionality can work offline as a Progressive Web App (PWA)." },
          { q: "Is encryption performed locally?", a: "Yes. Encryption and decryption happen directly inside your browser." },
          { q: "Can I use Secure Notes on mobile?", a: "Yes. The tool is fully responsive and mobile-friendly." }
        ].map(f => ({ question: f.q, answer: f.a }))}
        breadcrumbs={[
          { name: "Home", item: "https://safetools.space" },
          { name: "Privacy Tools", item: "https://safetools.space/privacy" },
          { name: "Secure Notes", item: "https://safetools.space/privacy/secure-notes" }
        ]}
      />
      <SecureNotesClient />
    </>
  );
}
