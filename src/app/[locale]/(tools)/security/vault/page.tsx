import { Metadata } from "next";
import { locales } from "@/config/locales";
import { getTranslations } from "next-intl/server";
import VaultClient from "./VaultClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "vault" });
  const t_common = await getTranslations({ locale, namespace: "common" });

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
    keywords: t("metadata.keywords").split(",").map((k: string) => k.trim()),
    openGraph: {
      title: t("metadata.ogTitle"),
      description: t("metadata.ogDescription"),
      type: "website",
      url: `https://safetools.space/${locale}/security/vault`,
    },
    twitter: {
      card: "summary_large_image",
      title: t("metadata.ogTitle"),
      description: t("metadata.ogDescription"),
      images: ["/og-image.webp"],
    },
    alternates: { 
      canonical: `/${locale}/security/vault`,
      languages: Object.fromEntries(locales.map(l => [l, `/${l}/security/vault`]))
    },
  };
}

export default async function VaultPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "vault" });
  const common = await getTranslations({ locale, namespace: "common" });

  const t_common = await getTranslations({ locale, namespace: "common" });
  return (
    <>
      <SEOStructuredData 
      browserRequirements={t_common("seo.browserReqs")} 
        name={t("metadata.title")}
        description={t("metadata.description")}
        url={`https://safetools.space/${locale}/security/vault`}
        faqItems={(Array.isArray(t.raw("landing.faq.items")) ? (t.raw("landing.faq.items") as any[]) : []).map(f => ({ q: f.q, a: f.a }))}
        breadcrumbs={[
          { name: common("home"), item: `https://safetools.space/${locale}` },
          { name: common("securityTools"), item: `https://safetools.space/${locale}/security` },
          { name: t("hero.title").replace(/<[^>]*>?/gm, ''), item: `https://safetools.space/${locale}/security/vault` }
        ]}

        howToSteps={(t.has("landing.educational.how_it_works.steps") && Array.isArray(t.raw("landing.educational.how_it_works.steps")) 
          ? t.raw("landing.educational.how_it_works.steps") as any[] 
          : []).map((step: any) => ({
          name: typeof step === "string" ? (step.split('.')[0] || "Step") : (step.t || step.title || "Step"),
          text: typeof step === "string" ? step : (step.d || step.desc || step.description || "Description")
        }))}
      />
      <VaultClient />
    </>
  );
}
