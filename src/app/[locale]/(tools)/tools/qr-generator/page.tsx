import { Metadata } from "next";
import { locales } from "@/config/locales";
import QRGeneratorClient from "./QRGeneratorClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "qrGenerator" });
  const t_common = await getTranslations({ locale, namespace: "common" });

  return {
    title: t("seo.title"),
    description: t("seo.description"),
    keywords: t("seo.keywords"),
    openGraph: {
      title: t("seo.ogTitle"),
      description: t("seo.ogDescription"),
      type: "website",
      url: `https://safetools.space/${locale}/tools/qr-generator`,
    },
    twitter: {
      card: "summary_large_image",
      title: t("seo.ogTitle"),
      description: t("seo.ogDescription"),
      images: ["/og-image.webp"],
    },
    alternates: { 
      canonical: `/${locale}/tools/qr-generator`,
      languages: Object.fromEntries(locales.map(l => [l, `/${l}/tools/qr-generator`]))
    },
  };
}

export default async function QRGeneratorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "qrGenerator" });

  const t_common = await getTranslations({ locale, namespace: "common" });
  return (
    <>
      <SEOStructuredData 
      browserRequirements={t_common("seo.browserReqs")} 
        name={t("seo.structuredName")}
        description={t("seo.structuredDesc")}
        url={`https://safetools.space/${locale}/tools/qr-generator`}
        faqItems={(Array.isArray(t.raw("landing.faq.items")) ? (t.raw("landing.faq.items") as Array<{ q: string; a: string }>) : []).map(f => ({ q: f.q, a: f.a }))}
      />
      <QRGeneratorClient />
    </>
  );
}
