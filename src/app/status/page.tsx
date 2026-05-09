import StatusClient from "./StatusClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Status | Engine Integrity Audit",
  description: "Verify the status of the SafeTools local-first engine. Check browser compatibility for WebAssembly, Web Workers, and hardware acceleration.",
  keywords: "system status, wasm support check, browser compatibility, safetools uptime, local engine audit",
  openGraph: {
    title: "System Status | Engine Integrity Audit",
    description: "Verify the status of the SafeTools local-first engine. Check browser compatibility for WebAssembly, Web Workers, and hardware acceleration.",
    type: "website",
    url: "https://safetools.space/status",
  },
  twitter: {
    card: "summary_large_image",
    title: "System Status | Engine Integrity Audit",
    description: "Verify the status of the SafeTools local-first engine. Check browser compatibility for WebAssembly, Web Workers, and hardware acceleration.",
    images: ["/og-image.webp"],
  },
  alternates: { canonical: "/status" },
};

export default function StatusPage() {
  return <StatusClient />;
}
