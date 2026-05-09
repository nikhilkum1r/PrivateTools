import { Metadata } from "next";
import QRGeneratorClient from "./QRGeneratorClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "QR Code Generator | Free Privacy-First QR Maker",
  description: "Generate QR codes instantly with a privacy-first browser-based QR generator. Create text, URL, WiFi, contact, and payment QR codes with zero tracking.",
  keywords: [
    "QR code generator",
    "free QR generator",
    "browser QR generator",
    "QR maker",
    "create QR code",
    "WiFi QR generator",
    "vCard QR code",
    "privacy QR generator",
    "local QR creator",
    "secure QR tool"
  ],
  openGraph: {
    title: "QR Code Generator | Free Privacy-First QR Maker",
    description: "Generate QR codes instantly with a privacy-first browser-based QR generator. Create text, URL, WiFi, contact, and payment QR codes with zero tracking.",
    type: "website",
    url: "https://safetools.space/tools/qr-generator",
  },
  twitter: {
    card: "summary_large_image",
    title: "QR Code Generator | Free Privacy-First QR Maker",
    description: "Generate QR codes instantly with a privacy-first browser-based QR generator. Create text, URL, WiFi, contact, and payment QR codes with zero tracking.",
    images: ["/og-image.webp"],
  },
  alternates: { canonical: "/tools/qr-generator" },
};

export default function QRGeneratorPage() {
  return (
    <>
      <SEOStructuredData 
        name="QR Code Generator"
        description="Generate QR codes instantly with a privacy-first browser-based QR generator. Create text, URL, WiFi, contact, and payment QR codes with zero tracking."
        url="https://safetools.space/tools/qr-generator"
        faqItems={[
          { q: "Are QR codes uploaded to servers?", a: "No. QR generation happens locally inside your browser." },
          { q: "Can I generate QR codes offline?", a: "Yes. Offline support can be enabled through PWA functionality." },
          { q: "Which formats can I export?", a: "PNG, SVG, and high-resolution formats are recommended." },
          { q: "Can I customize QR code colors?", a: "Yes. Custom styling and branding support can be added." },
          { q: "Is there tracking inside generated QR codes?", a: "No. SafeTools does not inject tracking into QR codes." }
        ].map(f => ({ question: f.q, answer: f.a }))}
        breadcrumbs={[
          { name: "Home", item: "https://safetools.space" },
          { name: "Utility Tools", item: "https://safetools.space/tools" },
          { name: "QR Generator", item: "https://safetools.space/tools/qr-generator" }
        ]}
      />
      <QRGeneratorClient />
    </>
  );
}
