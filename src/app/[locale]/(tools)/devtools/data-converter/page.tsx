import { Metadata } from "next";
import { locales } from "@/config/locales";
import DataConverterClient from "./DataConverterClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";


import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dataConverter.seo" });
  const t_common = await getTranslations({ locale, namespace: "common" });

  return {
    title: t("title"),
    description: t("description"),
    keywords: ["data converter", "json converter", "xml converter", "csv to json", "yaml converter", "base64 encoder", "base64 decoder"],
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/og-image.webp"],
    },
    alternates: {
      canonical: `/${locale}/devtools/data-converter`,
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      url: `https://safetools.space/${locale}/devtools/data-converter`,
    },
  };
}

export default async function DataConverterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dataConverter" });

  // Handle both array format and object format for faq items
  const faqRaw = t.raw("faq.items");
  let faqItems: any[] = [];
  if (Array.isArray(faqRaw)) {
    faqItems = faqRaw;
  } else if (faqRaw && Array.isArray(faqRaw.items)) {
    faqItems = faqRaw.items;
  }

  const t_common = await getTranslations({ locale, namespace: "common" });
  return (
    <>
      <SEOStructuredData 
      browserRequirements={t_common("seo.browserReqs")} 
        name={t("seo.title")}
        description={t("seo.description")}
        url={`https://safetools.space/${locale}/devtools/data-converter`}
        faqItems={faqItems.map((f: any) => ({ q: f.q || f.question, a: f.a || f.answer }))}
      />
      <DataConverterClient />
    </>
  );
}
