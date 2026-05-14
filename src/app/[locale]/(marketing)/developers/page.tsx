import DevelopersClient from "./DevelopersClient";
import { Metadata } from "next";
import { locales } from "@/config/locales";

import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "developers" });

  return {
    title: t("seo.title"),
    description: t("seo.description"),
    keywords: "developer tools, webassembly api, client-side processing, privacy architecture, open source security tools",
    openGraph: {
      title: t("seo.title"),
      description: t("seo.description"),
      type: "website",
      url: `https://safetools.space/${locale}/developers`,
    },
    twitter: {
      card: "summary_large_image",
      title: t("seo.title"),
      description: t("seo.description"),
      images: ["/og-image.webp"],
    },
    alternates: { 
      canonical: `/${locale}/developers`,
      languages: Object.fromEntries(locales.map(l => [l, `/${l}/developers`]))
    },
  };
}

export default async function DevelopersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <DevelopersClient />;
}
