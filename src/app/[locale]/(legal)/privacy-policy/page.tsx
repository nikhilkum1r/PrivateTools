import { Metadata } from "next";
import { locales } from "@/config/locales";
import PrivacyPolicyClient from "./PrivacyPolicyClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
  title: "Privacy Policy | SafeTools - Your Data Stays on Your Device",
  description: "SafeTools operates on a zero-server architecture. Your files never leave your device. No tracking, no cookies, 100% private processing.",
  openGraph: {
    title: "Privacy Policy | SafeTools - Your Data Stays on Your Device",
    description: "SafeTools operates on a zero-server architecture. Your files never leave your device. No tracking, no cookies, 100% private processing.",
    type: "website",
    url: `https://safetools.space/${locale}/privacy-policy`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | SafeTools - Your Data Stays on Your Device",
    description: "SafeTools operates on a zero-server architecture. Your files never leave your device. No tracking, no cookies, 100% private processing.",
    images: ["/og-image.webp"],
  },
  alternates: { 
      canonical: `/${locale}/privacy-policy`,
      languages: Object.fromEntries(locales.map(l => [l, `/${l}/privacy-policy`]))
    },
};
}

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <PrivacyPolicyClient />;
}
