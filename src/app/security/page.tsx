import { Metadata } from "next";
import SecurityClient from "./SecurityClient";

export const metadata: Metadata = {
  title: "Security Architecture | SafeTools - Local-First Privacy",
  description: "Learn how SafeTools mathematically guarantees your privacy through local-first browser isolation, WebAssembly, and zero-upload architecture.",
  keywords: "security architecture, local processing, browser-side AI, privacy-first tools, zero-upload security, safe tools security",
  openGraph: {
    title: "Security Architecture | SafeTools",
    description: "Deep dive into our local-first security model. No uploads. No tracking.",
    type: "website",
  },
};

export default function SecurityPage() {
  return <SecurityClient />;
}
