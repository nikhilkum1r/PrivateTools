import PricingClient from "./PricingClient";
import { Metadata } from "next";
import { locales } from "@/config/locales";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pricing" });

  return {
    title: t("seo.title"),
    description: t("seo.description"),
    keywords: "free online tools, no subscription privacy tools, unlimited file converter, open source tools, support privacy software",
    openGraph: {
      title: t("seo.title"),
      description: t("seo.description"),
      type: "website",
      url: `https://safetools.space/${locale}/pricing`,
    },
    twitter: {
      card: "summary_large_image",
      title: t("seo.title"),
      description: t("seo.description"),
      images: ["/og-image.webp"],
    },
    alternates: { 
      canonical: `/${locale}/pricing`,
      languages: Object.fromEntries(locales.map(l => [l, `/${l}/pricing`]))
    },
  };
}

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <PricingClient />;
}
