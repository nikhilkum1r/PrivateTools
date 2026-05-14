import FeaturesClient from "./FeaturesClient";
import { Metadata } from "next";
import { locales } from "@/config/locales";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
  title: "SafeTools Features | Zero-Server Privacy Infrastructure",
  description: "Explore the advanced privacy architecture of SafeTools. Built with WebAssembly, client-side sandboxing, and zero-server processing for maximum security.",
  keywords: "privacy tools, client-side processing, webassembly, secure file tools, no-upload converter",
  openGraph: {
    title: "SafeTools Features | Zero-Server Privacy Infrastructure",
    description: "Explore the advanced privacy architecture of SafeTools. Built with WebAssembly, client-side sandboxing, and zero-server processing for maximum security.",
    type: "website",
    url: `https://safetools.space/${locale}/features`,
  },
  twitter: {
    card: "summary_large_image",
    title: "SafeTools Features | Zero-Server Privacy Infrastructure",
    description: "Explore the advanced privacy architecture of SafeTools. Built with WebAssembly, client-side sandboxing, and zero-server processing for maximum security.",
    images: ["/og-image.webp"],
  },
  alternates: { 
      canonical: `/${locale}/features`,
      languages: Object.fromEntries(locales.map(l => [l, `/${l}/features`]))
    },
};
}

export default async function FeaturesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <FeaturesClient />;
}
