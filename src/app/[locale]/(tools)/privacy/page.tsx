import { Metadata } from "next";
import { locales } from "@/config/locales";
import PrivacyClient from "./PrivacyClient";

import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });

  return {
    title: t("seo.title"),
    description: t("seo.description"),
    keywords: t("seo.keywords"),
    openGraph: {
      title: t("seo.ogTitle"),
      description: t("seo.ogDescription"),
      type: "website",
      url: `https://safetools.space/${locale}/privacy`,
    },
    twitter: {
      card: "summary_large_image",
      title: t("seo.title"),
      description: t("seo.description"),
      images: ["/og-image.webp"],
    },
    alternates: { 
      canonical: `/${locale}/privacy`,
      languages: Object.fromEntries(locales.map(l => [l, `/${l}/privacy`]))
    },
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <PrivacyClient />;
}
