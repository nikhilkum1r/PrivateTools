import { Metadata } from "next";
import { locales } from "@/config/locales";
import SecurityClient from "./SecurityClient";

import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "security.seo" });
  
  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      url: `https://safetools.space/${locale}/security`,
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/og-image.webp"],
    },
    alternates: { 
      canonical: `/${locale}/security`,
      languages: Object.fromEntries(locales.map(l => [l, `/${l}/security`]))
    },
  };
}

export default async function SecurityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <SecurityClient />;
}
