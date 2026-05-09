import ToolsClient from "./ToolsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tools Directory | 150+ Privacy-First Browser Utilities",
  description: "Explore the full directory of SafeTools utilities. Image editing, AI background removal, secure PDF manipulation, and encryption—all running 100% locally.",
  keywords: "online tools directory, privacy utilities, local file editor, wasm tools list, secure browser apps, safetools index",
  openGraph: {
    title: "Tools Directory | 150+ Privacy-First Browser Utilities",
    description: "Explore the full directory of SafeTools utilities. Image editing, AI background removal, secure PDF manipulation, and encryption—all running 100% locally.",
    type: "website",
    url: "https://safetools.space/tools",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tools Directory | 150+ Privacy-First Browser Utilities",
    description: "Explore the full directory of SafeTools utilities. Image editing, AI background removal, secure PDF manipulation, and encryption—all running 100% locally.",
    images: ["/og-image.webp"],
  },
  alternates: { canonical: "/tools" },
};

export default function ToolsPage() {
  return <ToolsClient />;
}
