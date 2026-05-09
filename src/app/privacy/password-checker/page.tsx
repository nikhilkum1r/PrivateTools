import { Metadata } from "next";
import PasswordCheckerClient from "./PasswordCheckerClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";
import { PASSWORD_CHECKER_FAQ } from "@/lib/faq-content";

export const metadata: Metadata = {
  title: "Free Password Strength Checker | Privacy-First Security Tool",
  description: "Check password strength instantly with a privacy-first password checker. Analyze password security locally in your browser with zero uploads and zero tracking.",
  keywords: ["password strength checker", "password entropy calculator", "secure password test", "is my password safe", "private password checker", "brute force protection"],
  openGraph: {
    title: "SafeTools Password Studio | Professional Security Analysis",
    description: "Verify your password integrity securely in your browser. Powerful, private, and precise.",
    type: "website",
    url: "https://safetools.space/privacy/password-checker",
  },
};

export default function PasswordCheckerPage() {
  return (
    <>
      <SEOStructuredData 
        name="Password Strength Checker"
        description="Check your password strength and entropy securely in your browser with zero privacy risks."
        url="https://safetools.space/privacy/password-checker"
        faqItems={PASSWORD_CHECKER_FAQ}
      />
      <PasswordCheckerClient />
    </>
  );
}
