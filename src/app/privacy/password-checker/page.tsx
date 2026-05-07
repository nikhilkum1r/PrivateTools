import { Metadata } from "next";
import PasswordCheckerClient from "./PasswordCheckerClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Password Strength Checker - Secure & Private Analysis | SafeTools",
  description: "Check your password strength and entropy securely in your browser. zero server uploads, 100% private analysis. Protect yourself from brute-force attacks.",
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
      />
      <PasswordCheckerClient />
    </>
  );
}
