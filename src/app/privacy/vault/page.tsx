import { Metadata } from "next";
import VaultClient from "./VaultClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "File Encryptor & Decryptor - AES-256 Secure Local Vault | SafeTools",
  description: "Securely encrypt and decrypt any file using military-grade AES-256 GCM encryption. 100% private, local-first cryptographic protection with zero server uploads.",
  keywords: ["file encryption", "aes-256 encryptor", "secure file vault", "decrypt files online", "private encryption tool", "client side encryption", "secure file locker"],
  openGraph: {
    title: "SafeTools File Encryptor | Military-Grade Local Vault",
    description: "Encrypt and decrypt your sensitive files securely in your browser. Powerful, private, and unbreakable.",
    type: "website",
    url: "https://safetools.space/privacy/vault",
  },
};

export default function VaultPage() {
  return (
    <>
      <SEOStructuredData 
        name="File Encryptor & Decryptor"
        description="Military-grade AES-256 GCM file encryption and decryption directly in your browser. Complete data sovereignty."
        url="https://safetools.space/privacy/vault"
      />
      <VaultClient />
    </>
  );
}
