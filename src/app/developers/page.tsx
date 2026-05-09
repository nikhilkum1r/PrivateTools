import DevelopersClient from "./DevelopersClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SafeTools for Developers | Local-First Processing Engine",
  description: "Learn to build and contribute to SafeTools. Explore our local-first WebAssembly architecture, client-side AI, and privacy-preserving developer utilities.",
  keywords: "developer tools, webassembly api, client-side processing, privacy architecture, open source security tools",
  openGraph: {
    title: "SafeTools for Developers | Local-First Processing Engine",
    description: "Learn to build and contribute to SafeTools. Explore our local-first WebAssembly architecture, client-side AI, and privacy-preserving developer utilities.",
    type: "website",
    url: "https://safetools.space/developers",
  },
  twitter: {
    card: "summary_large_image",
    title: "SafeTools for Developers | Local-First Processing Engine",
    description: "Learn to build and contribute to SafeTools. Explore our local-first WebAssembly architecture, client-side AI, and privacy-preserving developer utilities.",
    images: ["/og-image.webp"],
  },
  alternates: { canonical: "/developers" },
};

export default function DevelopersPage() {
  return <DevelopersClient />;
}
