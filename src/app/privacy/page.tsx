import { Metadata } from "next";
import PrivacyClient from "./PrivacyClient";

export const metadata: Metadata = {
  title: "Privacy Manifesto | SafeTools - Zero Data Policy",
  description: "Our Privacy Manifesto: SafeTools never collects, stores, or transmits your files. All processing is 100% local and browser-based.",
  keywords: "privacy policy, zero data collection, local processing privacy, safe tools privacy, browser security manifesto",
  openGraph:{
    title: "Privacy Manifesto | SafeTools",
    description: "Your data stays on your device. Always.",
    type: "website",
    url: "https://safetools.space/privacy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Manifesto | SafeTools - Zero Data Policy",
    description: "Our Privacy Manifesto: SafeTools never collects, stores, or transmits your files. All processing is 100% local and browser-based.",
    images: ["/og-image.webp"],
  },
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}
