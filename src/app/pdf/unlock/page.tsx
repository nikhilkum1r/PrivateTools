import { Metadata } from "next";
import UnlockPdfClient from "@/app/pdf/unlock/UnlockPdfClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Unlock PDF - Remove Password Protection Online | SafeTools",
  description: "Remove passwords and security restrictions from PDF files locally. 100% private, browser-based PDF unlocking with zero server uploads.",
  keywords: ["unlock pdf", "remove pdf password", "pdf security remover", "decrypt pdf online", "private pdf unlocker", "secure pdf password remover"],
  openGraph: {
    title: "SafeTools Unlock PDF | Professional Security Remover",
    description: "Securely remove password protection from your PDF files in your browser. Fast, free, and completely private.",
    type: "website",
    url: "https://safetools.space/pdf/unlock",
  },
};

export default function UnlockPdfPage() {
  return (
    <>
      <SEOStructuredData 
        name="Unlock PDF"
        description="Remove password protection and security restrictions from PDF files directly in your browser. Complete data sovereignty."
        url="https://safetools.space/pdf/unlock"
      />
      <UnlockPdfClient />
    </>
  );
}
