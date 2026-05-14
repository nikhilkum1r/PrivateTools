import { Metadata } from "next";
import { setRequestLocale } from 'next-intl/server';
import { AdsClientView } from "./AdsClientView";
import { locales } from "@/config/locales";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: "Why We Show Ads | SafeTools - Sustainable Privacy",
    description: "Learn why SafeTools uses lightweight advertising to support a free, privacy-first platform without selling your data.",
    alternates: { 
      canonical: `/${locale}/ads`,
      languages: Object.fromEntries(locales.map(l => [l, `/${l}/ads`]))
    },
  };
}

export default async function AdsPolicyPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Enable static rendering
  setRequestLocale(locale);

  return <AdsClientView />;
}
