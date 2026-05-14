import { Metadata } from "next";
import { locales } from "@/config/locales";
import ConversionStudioClient from "./ConversionStudioClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";
import { getTranslations } from "next-intl/server";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "imageConverter" });
  const t_common = await getTranslations({ locale, namespace: "common" });

  return {
    title: t("seo.title"),
    description: t("seo.description"),
    openGraph: {
      title: t("seo.title"),
      description: t("seo.description"),
      type: "website",
      url: `https://safetools.space/${locale}/image/convert`,
    },
    twitter: {
      card: "summary_large_image",
      title: t("seo.title"),
      description: t("seo.description"),
      images: ["/og-image.webp"],
    },
    alternates: { 
      canonical: `/${locale}/image/convert`,
      languages: Object.fromEntries(locales.map(l => [l, `/${l}/image/convert`]))
    },
  };
}

export default async function ImageConverterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "imageConverter" });

  const t_common = await getTranslations({ locale, namespace: "common" });
  return (
    <>
      <SEOStructuredData 
      browserRequirements={t_common("seo.browserReqs")}
        name={t("seo.title")}
        description={t("seo.description")}
        url={`https://safetools.space/${locale}/image/convert`}
        faqItems={(Array.isArray(t.raw("landing.faq.items")) ? (t.raw("landing.faq.items") as any[]) : []).map(f => ({ q: f.q, a: f.a }))}
      />
      <ConversionStudioClient />
    </>
  );
}
