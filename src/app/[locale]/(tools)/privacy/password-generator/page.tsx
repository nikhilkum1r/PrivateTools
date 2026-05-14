import { Metadata } from "next";
import { locales } from "@/config/locales";
import PasswordGeneratorClient from "./PasswordGeneratorClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";


import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "passwordGenerator.metadata" });

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      url: `https://safetools.space/${locale}/privacy/password-generator`,
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/og-image.webp"],
    },
    alternates: {
      canonical: `/${locale}/privacy/password-generator`,
      languages: Object.fromEntries(locales.map(l => [l, `/${l}/privacy/password-generator`]))
    },
  };
}

export default async function PasswordGeneratorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "passwordGenerator" });

  const t_common = await getTranslations({ locale, namespace: "common" });
  return (
    <>
      <SEOStructuredData 
      browserRequirements={t_common("seo.browserReqs")} 
        name={t("metadata.title")}
        description={t("metadata.description")}
        url={`https://safetools.space/${locale}/privacy/password-generator`}
        faqItems={t.raw("landing.faq.items") as any}
      />
      <PasswordGeneratorClient />
    </>
  );
}
