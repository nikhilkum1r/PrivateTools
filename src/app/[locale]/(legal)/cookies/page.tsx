import CookiesClient from "./CookiesClient";
import { Metadata } from "next";
import { locales } from "@/config/locales";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cookies" });

  return {
    title: t("seo.title"),
    description: t("seo.description"),
    keywords: "cookie policy, no cookies, privacy manifesto, tracker free online tools, safetools privacy",
    openGraph: {
      title: t("seo.title"),
      description: t("seo.description"),
      type: "website",
      url: `https://safetools.space/${locale}/cookies`,
    },
    twitter: {
      card: "summary_large_image",
      title: t("seo.title"),
      description: t("seo.description"),
      images: ["/og-image.webp"],
    },
    alternates: { 
      canonical: `/${locale}/cookies`,
      languages: Object.fromEntries(locales.map(l => [l, `/${l}/cookies`]))
    },
  };
}

export default async function CookiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <CookiesClient />;
}
