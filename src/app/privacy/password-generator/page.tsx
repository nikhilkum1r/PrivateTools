import { Metadata } from "next";
import PasswordGeneratorClient from "./PasswordGeneratorClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";
import { PASSWORD_GENERATOR_FAQ } from "@/lib/faq-content";

export const metadata: Metadata = {
  title: "Free Secure Password Generator | SafeTools.space",
  description: "Generate high-entropy, secure passwords locally in your browser using the Web Crypto API. Zero server uploads, 100% private, and cryptographically strong.",
  keywords: ["secure password generator", "random password creator", "high entropy passwords", "private password tool", "browser based password generator", "cryptographically secure passwords", "password maker"],
  twitter: {
    card: "summary_large_image",
    title: "Free Secure Password Generator | SafeTools.space",
    description: "Generate high-entropy, secure passwords locally in your browser using the Web Crypto API. Zero server uploads, 100% private, and cryptographically strong.",
    images: ["/og-image.webp"],
  },
  alternates: {
    canonical: "https://safetools.space/privacy/password-generator",
  },
  openGraph: {
    title: "SafeTools Password Generator | Cryptographically Strong Secrets",
    description: "Generate unbreakable passwords securely in your browser. Precise, private, and powerful zero-server architecture.",
    type: "website",
    url: "https://safetools.space/privacy/password-generator",
  },
};

export default function PasswordGeneratorPage() {
  return (
    <>
      <SEOStructuredData 
        name="Secure Password Generator"
        description="Generate high-entropy passwords using cryptographically secure random values directly in your browser."
        url="https://safetools.space/privacy/password-generator"
        faqItems={PASSWORD_GENERATOR_FAQ}
      />
      <PasswordGeneratorClient />
    </>
  );
}
