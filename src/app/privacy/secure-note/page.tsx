import { Metadata } from "next";
import SecureNoteClient from "./SecureNoteClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Secure Online Notepad - Encrypt Notes with AES-256 | SafeTools",
  description: "Encrypt and decrypt private notes locally using AES-256-GCM. 100% private, no data is ever sent to a server. Perfect for passwords and secret keys.",
  keywords: ["secure online notepad", "encrypt text online", "aes-256-gcm text encryption", "private notes online", "browser based encryption", "secret note creator"],
  openGraph: {
    title: "SafeTools Secure Note | Professional Text Shielding",
    description: "Protect your sensitive notes with local AES-256 encryption. Zero server uploads, total privacy.",
    type: "website",
    url: "https://safetools.space/privacy/secure-note",
  },
};

export default function SecureNotePage() {
  return (
    <>
      <SEOStructuredData 
        name="Secure Note Pad"
        description="Encrypt and decrypt private notes locally using AES-256-GCM. 100% private and secure text shielding."
        url="https://safetools.space/privacy/secure-note"
      />
      <SecureNoteClient />
    </>
  );
}
