import TermsClient from "./TermsClient";
import { Metadata } from "next";
import { locales } from "@/config/locales";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
  title: "Terms of Service | Local-First Sovereign Covenant | SafeTools",
  description: "Read our service covenant. Understand your rights to data sovereignty, local-first execution, and our commitment to zero-server processing architecture.",
  keywords: "terms of service, data sovereignty, local first agreement, privacy software legal, zero server terms",
  openGraph: {
    title: "Terms of Service | Local-First Sovereign Covenant | SafeTools",
    description: "Read our service covenant. Understand your rights to data sovereignty, local-first execution, and our commitment to zero-server processing architecture.",
    type: "website",
    url: `https://safetools.space/${locale}/terms`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | Local-First Sovereign Covenant | SafeTools",
    description: "Read our service covenant. Understand your rights to data sovereignty, local-first execution, and our commitment to zero-server processing architecture.",
    images: ["/og-image.webp"],
  },
  alternates: { 
      canonical: `/${locale}/terms`,
      languages: Object.fromEntries(locales.map(l => [l, `/${l}/terms`]))
    },
};
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <TermsClient />;
}
