import { Metadata } from "next";
import { locales } from "@/config/locales";
import CompressorStudioClient from "./CompressorStudioClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "compressor" });
  const t_common = await getTranslations({ locale, namespace: "common" });

  return {
    title: t("seo.title"),
    description: t("seo.description"),
    keywords: t("seo.keywords").split(",").map((k: string) => k.trim()),
    openGraph: {
      title: t("seo.ogTitle"),
      description: t("seo.ogDescription"),
      type: "website",
      url: `https://safetools.space/${locale}/image/compress`,
    },
    twitter: {
      card: "summary_large_image",
      title: t("seo.title"),
      description: t("seo.description"),
      images: ["/og-image.webp"],
    },
    alternates: { 
      canonical: `/${locale}/image/compress`,
      languages: Object.fromEntries(locales.map(l => [l, `/${l}/image/compress`]))
    },
  };
}

export default async function ImageCompressorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t_common = await getTranslations({ locale, namespace: "common" });
  const t = await getTranslations({ locale, namespace: "compressor" });
  return (
    <>
      <SEOStructuredData 
        browserRequirements={t_common("seo.browserReqs")} 
        name={t("seo.seoName")}
        description={t("seo.seoDescription")}
        url={`https://safetools.space/${locale}/image/compress`}
        faqItems={(Array.isArray(t.raw("landing.faq.items")) ? (t.raw("landing.faq.items") as any[]) : []).map(f => ({ q: f.q, a: f.a }))}
        breadcrumbs={[
          { name: t("seo.breadcrumbs.home"), item: `https://safetools.space/${locale}` },
          { name: t("seo.breadcrumbs.parent"), item: `https://safetools.space/${locale}/image` },
          { name: t("seo.breadcrumbs.current"), item: `https://safetools.space/${locale}/image/compress` }
        ]}

        howToSteps={(t.has("landing.educational.how_it_works.steps") && Array.isArray(t.raw("landing.educational.how_it_works.steps")) 
          ? t.raw("landing.educational.how_it_works.steps") as any[] 
          : []).map((step: any) => ({
          name: typeof step === "string" ? (step.split('.')[0] || "Step") : (step.t || step.title || "Step"),
          text: typeof step === "string" ? step : (step.d || step.desc || step.description || "Description")
        }))}
      />
      <CompressorStudioClient />
    </>
  );
}
