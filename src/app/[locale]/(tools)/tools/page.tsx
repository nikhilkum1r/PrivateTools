import ToolsClient from "./ToolsClient";
import { Metadata } from "next";
import { locales } from "@/config/locales";

import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'toolsHub' });

  return {
    title: t('seo.title'),
    description: t('seo.description'),
    keywords: t('seo.keywords'),
    openGraph: {
      title: t('seo.title'),
      description: t('seo.description'),
      type: "website",
      url: `https://safetools.space/${locale}/tools`,
    },
    twitter: {
      card: "summary_large_image",
      title: t('seo.ogTitle'),
      description: t('seo.ogDescription'),
      images: ["/og-image.webp"],
    },
    alternates: { 
      canonical: `/${locale}/tools`,
      languages: Object.fromEntries(locales.map(l => [l, `/${l}/tools`]))
    },
  };
}

export default async function ToolsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <ToolsClient />;
}
