import { Metadata } from "next";
import { locales } from "@/config/locales";
import ImageToPptxClient from "./ImageToPptxClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";
import { getTranslations } from "next-intl/server";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "imageToPptx" });
  const t_common = await getTranslations({ locale, namespace: "common" });
  
  return {
    title: t("seo.title"),
    description: t("seo.description"),
    keywords: t("seo.keywords").split(",").map((k: string) => k.trim()),
    openGraph: {
      title: t("seo.ogTitle"),
      description: t("seo.ogDescription"),
      type: "website",
      url: `https://safetools.space/${locale}/image/to-pptx`,
    },
    twitter: {
      card: "summary_large_image",
      title: t("seo.title"),
      description: t("seo.description"),
      images: ["/og-image.webp"],
    },
    alternates: { 
      canonical: `/${locale}/image/to-pptx`,
      languages: Object.fromEntries(locales.map(l => [l, `/${l}/image/to-pptx`]))
    },
  };
}

export default async function ImageToPptxPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "imageToPptx" });
  
  const t_common = await getTranslations({ locale, namespace: "common" });
  return (
    <>
      <SEOStructuredData 
      browserRequirements={t_common("seo.browserReqs")} 
        name={t("seo.title")}
        description={t("seo.description")}
        url={`https://safetools.space/${locale}/image/to-pptx`}
      />
      <ImageToPptxClient />
    </>
  );
}
