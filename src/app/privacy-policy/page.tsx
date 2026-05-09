import { Metadata } from "next";
import PrivacyPolicyClient from "./PrivacyPolicyClient";

export const metadata: Metadata = {
  title: "Privacy Policy | SafeTools - Your Data Stays on Your Device",
  description: "SafeTools operates on a zero-server architecture. Your files never leave your device. No tracking, no cookies, 100% private processing.",
  openGraph: {
    title: "Privacy Policy | SafeTools - Your Data Stays on Your Device",
    description: "SafeTools operates on a zero-server architecture. Your files never leave your device. No tracking, no cookies, 100% private processing.",
    type: "website",
    url: "https://safetools.space/privacy-policy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | SafeTools - Your Data Stays on Your Device",
    description: "SafeTools operates on a zero-server architecture. Your files never leave your device. No tracking, no cookies, 100% private processing.",
    images: ["/og-image.webp"],
  },
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}
