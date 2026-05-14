import { Metadata } from "next";
import { locales } from "@/config/locales";
import DevToolsStudioClient from "./DevToolsStudioClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "devtools" });
  const t_common = await getTranslations({ locale, namespace: "common" });

  return {
    title: t("seo.title"),
    description: t("seo.description"),
    keywords: ["developer tools", "json formatter", "jwt debugger", "base64 encoder", "uuid generator", "private devtools", "hash generator", "code formatter"],
    openGraph: {
      title: t("seo.ogTitle"),
      description: t("seo.ogDescription"),
      type: "website",
      url: `https://safetools.space/${locale}/devtools`,
    },
    twitter: {
      card: "summary_large_image",
      title: t("seo.title"),
      description: t("seo.description"),
      images: ["/og-image.webp"],
    },
    alternates: { 
      canonical: `/${locale}/devtools`,
      languages: Object.fromEntries(locales.map(l => [l, `/${l}/devtools`]))
    },
  };
}

export default async function DevToolsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t_common = await getTranslations({ locale, namespace: "common" });
  const t = await getTranslations({ locale, namespace: "devtools" });
  
  return (
    <>
      <SEOStructuredData 
        browserRequirements={t_common("seo.browserReqs")} 
        name={t("seo.seoName")}
        description={t("seo.seoDescription")}
        url={`https://safetools.space/${locale}/devtools`}
      />
      <DevToolsStudioClient initialTool="json" />
    </>
  );
}
