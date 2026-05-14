import ContactClient from "./ContactClient";
import { Metadata } from "next";
import { locales } from "@/config/locales";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });

  return {
    title: t("seo.title"),
    description: t("seo.description"),
    keywords: "contact safetools, privacy tools support, technical inquiry, feature request, security audit contact",
    openGraph: {
      title: t("seo.title"),
      description: t("seo.description"),
      type: "website",
      url: `https://safetools.space/${locale}/contact`,
    },
    twitter: {
      card: "summary_large_image",
      title: t("seo.title"),
      description: t("seo.description"),
      images: ["/og-image.webp"],
    },
    alternates: { 
      canonical: `/${locale}/contact`,
      languages: Object.fromEntries(locales.map(l => [l, `/${l}/contact`]))
    },
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <ContactClient />;
}
