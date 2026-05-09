import { Metadata } from "next";
import VaultClient from "./VaultClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Secure Vault | Privacy-First Encrypted Storage",
  description: "Protect sensitive files, passwords, and private notes with a privacy-first encrypted vault. Local browser-based encryption with zero uploads and zero tracking.",
  keywords: ["secure vault", "encrypted vault", "browser vault", "secure storage", "privacy vault", "local encrypted storage", "zero knowledge vault", "secure browser storage", "encrypted private vault", "privacy-first storage", "AES-256 vault", "offline encrypted vault"],
  openGraph: {
    title: "Secure Vault | Privacy-First Encrypted Storage",
    description: "Protect sensitive files, passwords, and private notes with a privacy-first encrypted vault. Local browser-based encryption with zero uploads and zero tracking.",
    type: "website",
    url: "https://safetools.space/security/vault",
  },
};

export default function VaultPage() {
  return (
    <>
      <SEOStructuredData 
        name="Secure Vault"
        description="Protect sensitive files, passwords, and private notes with a privacy-first encrypted vault. Local browser-based encryption with zero uploads and zero tracking."
        url="https://safetools.space/security/vault"
        faqItems={[
          { q: "Is my vault uploaded to servers?", a: "No. Vault data stays locally encrypted inside your browser or device storage." },
          { q: "Can SafeTools access my vault?", a: "No. Encryption and decryption happen locally in your browser." },
          { q: "Does the vault work offline?", a: "Yes. Offline support can be enabled through PWA functionality." },
          { q: "Is account registration required?", a: "No. SafeTools prioritizes minimal data collection." },
          { q: "Can I export encrypted vault data?", a: "Yes. Secure encrypted export/import is supported via the .vault file format." }
        ].map(f => ({ question: f.q, answer: f.a }))}
        breadcrumbs={[
          { name: "Home", item: "https://safetools.space" },
          { name: "Security Tools", item: "https://safetools.space/security" },
          { name: "Vault", item: "https://safetools.space/security/vault" }
        ]}
      />
      <VaultClient />
    </>
  );
}
