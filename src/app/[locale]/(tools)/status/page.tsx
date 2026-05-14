import StatusClient from "./StatusClient";
import { Metadata } from "next";
import { locales } from "@/config/locales";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
  title: "System Status | Engine Integrity Audit",
  description: "Verify the status of the SafeTools local-first engine. Check browser compatibility for WebAssembly, Web Workers, and hardware acceleration.",
  keywords: "system status, wasm support check, browser compatibility, safetools uptime, local engine audit",
  openGraph: {
    title: "System Status | Engine Integrity Audit",
    description: "Verify the status of the SafeTools local-first engine. Check browser compatibility for WebAssembly, Web Workers, and hardware acceleration.",
    type: "website",
    url: `https://safetools.space/${locale}/status`,
  },
  twitter: {
    card: "summary_large_image",
    title: "System Status | Engine Integrity Audit",
    description: "Verify the status of the SafeTools local-first engine. Check browser compatibility for WebAssembly, Web Workers, and hardware acceleration.",
    images: ["/og-image.webp"],
  },
  alternates: { 
      canonical: `/${locale}/status`,
      languages: Object.fromEntries(locales.map(l => [l, `/${l}/status`]))
    },
};
}

export default async function StatusPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <StatusClient />;
}
