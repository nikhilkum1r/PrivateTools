import { Metadata } from "next";
import ShredderClient from "./ShredderClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Online File Shredder - Secure Multi-Pass Deletion | SafeTools",
  description: "Securely wipe sensitive files from your browser memory with multi-pass shredding. zero server uploads, 100% private. Protect yourself from data recovery.",
  keywords: ["file shredder online", "secure file deletion", "wipe files browser", "multi-pass shredding", "private file eraser", "secure data wiping"],
  openGraph: {
    title: "SafeTools Shredder | Professional Data Wiping",
    description: "Protect your privacy by securely wiping files from your browser. Powerful, private, and precise.",
    type: "website",
    url: "https://safetools.space/privacy/shredder",
  },
};

export default function ShredderPage() {
  return (
    <>
      <SEOStructuredData 
        name="Secure File Shredder"
        description="Securely wipe sensitive files from your browser memory with multi-pass shredding. 100% private and secure data deletion."
        url="https://safetools.space/privacy/shredder"
      />
      <ShredderClient />
    </>
  );
}
