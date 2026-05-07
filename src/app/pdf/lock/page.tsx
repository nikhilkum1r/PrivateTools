import { Metadata } from "next";
import LockPdfClient from "@/app/pdf/lock/LockPdfClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Lock PDF - Password Protect PDF Files Online | SafeTools",
  description: "Add strong password protection and encryption to your PDF files locally. 100% private, browser-based PDF locking with military-grade security.",
  keywords: ["lock pdf", "password protect pdf", "pdf encryption online", "secure pdf online", "private pdf locker", "encrypt pdf browser"],
  openGraph: {
    title: "SafeTools Lock PDF | Professional Document Shield",
    description: "Securely add password protection to your PDF files in your browser. Fast, free, and completely private.",
    type: "website",
    url: "https://safetools.space/pdf/lock",
  },
};

export default function LockPdfPage() {
  return (
    <>
      <SEOStructuredData 
        name="Lock PDF"
        description="Add password protection and military-grade encryption to PDF files directly in your browser. Complete data sovereignty."
        url="https://safetools.space/pdf/lock"
      />
      <LockPdfClient />
    </>
  );
}
