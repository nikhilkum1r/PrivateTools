import UpdatesClient from "./UpdatesClient";
import { Metadata } from "next";
import { locales } from "@/config/locales";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
  title: "Latest Updates & News | SafeTools Product Feed",
  description: "Stay informed about the latest features, architectural breakthroughs, and security updates from SafeTools. The home for privacy-first product announcements.",
  keywords: "safetools updates, product news, privacy tools blog, latest software features, zero server announcements",
  openGraph: {
    title: "Latest Updates & News | SafeTools Product Feed",
    description: "Stay informed about the latest features, architectural breakthroughs, and security updates from SafeTools. The home for privacy-first product announcements.",
    type: "website",
    url: `https://safetools.space/${locale}/updates`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Latest Updates & News | SafeTools Product Feed",
    description: "Stay informed about the latest features, architectural breakthroughs, and security updates from SafeTools. The home for privacy-first product announcements.",
    images: ["/og-image.webp"],
  },
  alternates: { 
      canonical: `/${locale}/updates`,
      languages: Object.fromEntries(locales.map(l => [l, `/${l}/updates`]))
    },
};
}

export default async function UpdatesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <UpdatesClient />;
}
