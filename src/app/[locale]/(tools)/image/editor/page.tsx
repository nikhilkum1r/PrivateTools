import { Metadata } from "next";
import { locales } from "@/config/locales";
import EditorStudioClient from "./EditorStudioClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";
import { getTranslations } from "next-intl/server";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "imageEditor" });
  const t_common = await getTranslations({ locale, namespace: "common" });
  
  return {
    title: t("seo.title"),
    description: t("seo.description"),
    keywords: t.raw("seo.keywords") as string[],
    openGraph: {
      title: t("seo.title"),
      description: t("seo.description"),
      type: "website",
      url: `https://safetools.space/${locale}/image/editor`,
    },
    twitter: {
      card: "summary_large_image",
      title: t("seo.title"),
      description: t("seo.description"),
      images: ["/og-image.webp"],
    },
    alternates: { 
      canonical: `/${locale}/image/editor`,
      languages: Object.fromEntries(locales.map(l => [l, `/${l}/image/editor`]))
    },
  };
}

export default async function ImageEditorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "imageEditor" });
  
  const t_common = await getTranslations({ locale, namespace: "common" });
  return (
    <>
      <SEOStructuredData 
      browserRequirements={t_common("seo.browserReqs")} 
        name={t("seo.title")}
        description={t("seo.description")}
        url={`https://safetools.space/${locale}/image/editor`}
        faqItems={t.raw("landing.faq.items") as any}
      />
      <EditorStudioClient mode="landing" />
    </>
  );
}
