import { Metadata } from "next";
import SteganographyClient from "./SteganographyClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Steganography Tool | Hide Secret Messages in Images",
  description: "Hide secret text inside images securely using browser-based steganography. Privacy-first local processing with zero uploads and zero tracking.",
  keywords: ["steganography tool", "image steganography", "hide text in image", "secret image message", "browser steganography", "hidden message encoder", "local steganography tool", "png steganography", "online steganography", "secure hidden messages"],
  openGraph: {
    title: "Steganography Tool | Hide Secret Messages in Images",
    description: "Hide secret text inside images securely using browser-based steganography. Privacy-first local processing with zero uploads and zero tracking.",
    type: "website",
    url: "https://safetools.space/security/steganography",
  },
};

export default function SteganographyPage() {
  return (
    <>
      <SEOStructuredData 
        name="Steganography Tool"
        description="Hide secret text inside images securely using browser-based steganography. Privacy-first local processing with zero uploads and zero tracking."
        url="https://safetools.space/security/steganography"
        faqItems={[
          { q: "Are images uploaded to servers?", a: "No. All encoding and decoding happen locally inside your browser." },
          { q: "Which image format works best?", a: "PNG is recommended because it preserves hidden data more reliably." },
          { q: "Can hidden data survive compression?", a: "Lossy compression like JPEG may damage hidden information." },
          { q: "Does this tool work offline?", a: "Yes. Offline support can be enabled through PWA functionality." },
          { q: "Is steganography encryption?", a: "No. Steganography hides data, while encryption protects readability." }
        ].map(f => ({ question: f.q, answer: f.a }))}
        breadcrumbs={[
          { name: "Home", item: "https://safetools.space" },
          { name: "Security Tools", item: "https://safetools.space/security" },
          { name: "Steganography", item: "https://safetools.space/security/steganography" }
        ]}
      />
      <SteganographyClient />
    </>
  );
}
