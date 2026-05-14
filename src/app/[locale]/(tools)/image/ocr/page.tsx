import { Metadata } from "next";
import { Suspense } from "react";
import { locales } from "@/config/locales";
import OCRClient from "./OCRClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";
import StudioSkeleton from "@/components/shared/StudioSkeleton";
import { getTranslations } from "next-intl/server";


interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ocr" });
  const t_common = await getTranslations({ locale, namespace: "common" });
  
  return {
    title: t("seo.title"),
    description: t("seo.description"),
    keywords: t("seo.keywords").split(",").map((k: string) => k.trim()),
    openGraph: {
      title: t("seo.ogTitle"),
      description: t("seo.ogDescription"),
      type: "website",
      url: `https://safetools.space/${locale}/image/ocr`,
    },
    twitter: {
      card: "summary_large_image",
      title: t("seo.title"),
      description: t("seo.description"),
      images: ["/og-image.webp"],
    },
    alternates: { 
      canonical: `/${locale}/image/ocr`,
      languages: Object.fromEntries(locales.map(l => [l, `/${l}/image/ocr`]))
    },
  };
}

export default async function OCRPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ocr" });
  
  const t_common = await getTranslations({ locale, namespace: "common" });
  return (
    <>
      <SEOStructuredData 
      browserRequirements={t_common("seo.browserReqs")} 
        name={t("seo.title")}
        description={t("seo.description")}
        url={`https://safetools.space/${locale}/image/ocr`}
        faqItems={(Array.isArray(t.raw("landing.faq.items")) ? (t.raw("landing.faq.items") as any[]) : []).map(f => ({ q: f.q, a: f.a }))}
      />
      <Suspense fallback={<StudioSkeleton />}>
        <OCRClient />
      </Suspense>
    </>
  );
}
