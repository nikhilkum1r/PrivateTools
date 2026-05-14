import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { locales } from "@/config/locales";
import TextToolsClient from "./TextToolsClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
  title: "Online Text Utilities - Format, Analyze & Encode Text | SafeTools",
  description: "A comprehensive suite of text utilities including word count, case conversion, and duplicate removal. 100% private, browser-based text processing.",
  keywords: ["text utilities", "word count online", "remove duplicate lines", "uppercase converter", "base64 encoder online", "url encoder decoder", "private text tools"],
  openGraph: {
    title: "SafeTools Text Studio | Professional Content Transformation",
    description: "Transform and analyze your text securely in your browser. zero server uploads.",
    type: "website",
    url: `https://safetools.space/${locale}/document/text-tools`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Text Utilities - Format, Analyze & Encode Text | SafeTools",
    description: "A comprehensive suite of text utilities including word count, case conversion, and duplicate removal. 100% private, browser-based text processing.",
    images: ["/og-image.webp"],
  },
  alternates: { 
      canonical: `/${locale}/document/text-tools`,
      languages: Object.fromEntries(locales.map(l => [l, `/${l}/document/text-tools`]))
    },
};
}

export default async function TextToolsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t_common = await getTranslations({ locale, namespace: "common" });
  return (
    <>
      <SEOStructuredData 
      browserRequirements={t_common("seo.browserReqs")} 
        name="Text Utility Suite"
        description="Transform, analyze and encode text instantly in your browser. 100% private and secure."
        url={`https://safetools.space/${locale}/document/text-tools`}
      />
      <TextToolsClient />
    </>
  );
}
