import { Metadata } from "next";
import SecurityToolsClient from "./SecurityToolsClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Secure Password Generator - Cryptographically Strong | SafeTools",
  description: "Generate high-entropy, secure passwords locally in your browser. Uses Web Crypto API for cryptographically strong random values. zero server uploads, 100% private.",
  keywords: ["secure password generator", "random password creator", "high entropy passwords", "private password tool", "browser based password generator", "cryptographically secure passwords"],
  openGraph: {
    title: "SafeTools Security Studio | Professional Password Engineering",
    description: "Generate unbreakable passwords securely in your browser. Precise, private, and powerful.",
    type: "website",
    url: "https://safetools.space/security",
  },
};

export default function SecurityPage() {
  return (
    <>
      <SEOStructuredData 
        name="Secure Password Generator"
        description="Generate high-entropy passwords using cryptographically secure random values directly in your browser."
        url="https://safetools.space/security"
      />
      <SecurityToolsClient />
    </>
  );
}
