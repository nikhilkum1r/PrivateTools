import { Metadata } from "next";
import { locales } from "@/config/locales";
import DocumentHubClient from "./DocumentHubClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "documentHub" });
  
  return {
    title: t("seo.title"),
    description: t("seo.description"),
    keywords: t("seo.keywords").split(", "),
    openGraph: {
      title: t("seo.ogTitle"),
      description: t("seo.ogDescription"),
      type: "website",
      url: `https://safetools.space/${locale}/document`,
    },
    twitter: {
      card: "summary_large_image",
      title: t("seo.title"),
      description: t("seo.description"),
      images: ["/og-image.webp"],
    },
    alternates: { 
      canonical: `/${locale}/document`,
      languages: Object.fromEntries(locales.map(l => [l, `/${l}/document`]))
    },
  };
}

export default async function DocumentHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "documentHub" });
  
  const t_common = await getTranslations({ locale, namespace: "common" });
  return (
    <>
      <SEOStructuredData 
      browserRequirements={t_common("seo.browserReqs")} 
        name={t("seo.structuredName")}
        description={t("seo.structuredDesc")}
        url={`https://safetools.space/${locale}/document`}
      />
      <DocumentHubClient />

      {/* SEO Content Section */}
      <section className="container mx-auto px-4 py-24 border-t border-border">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="space-y-6">
            <h2 className="text-xl font-bold">{t("faq.title")}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {t("faq.desc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">{t("faq.q1")}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("faq.a1")}
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold">{t("faq.q2")}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("faq.a2")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
