import { Metadata } from "next";
import { locales } from "@/config/locales";
import { getTranslations } from "next-intl/server";
import MetadataCleanerClient from "./MetadataCleanerClient";
import { ClientOnly } from "@/components/shared/ClientOnly";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadataCleaner" });
  const t_common = await getTranslations({ locale, namespace: "common" });

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
    keywords: t("metadata.keywords").split(",").map((k: string) => k.trim()),
    openGraph: {
      title: t("metadata.ogTitle"),
      description: t("metadata.ogDescription"),
      type: "website",
      url: `https://safetools.space/${locale}/security/metadata-cleaner`,
    },
    twitter: {
      card: "summary_large_image",
      title: t("metadata.ogTitle"),
      description: t("metadata.ogDescription"),
      images: ["/og-image.webp"],
    },
    alternates: { 
      canonical: `/${locale}/security/metadata-cleaner`,
      languages: Object.fromEntries(locales.map(l => [l, `/${l}/security/metadata-cleaner`]))
    },
  };
}

export default async function MetadataCleanerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadataCleaner" });
  const common = await getTranslations({ locale, namespace: "common" });

  const t_common = await getTranslations({ locale, namespace: "common" });
  return (
    <>
      <SEOStructuredData 
      browserRequirements={t_common("seo.browserReqs")} 
        name={t("metadata.title")}
        description={t("metadata.description")}
        url={`https://safetools.space/${locale}/security/metadata-cleaner`}
        faqItems={t.raw("landing.faq.items") as any[]}
        breadcrumbs={[
          { name: common("home"), item: `https://safetools.space/${locale}` },
          { name: common("securityTools"), item: `https://safetools.space/${locale}/security` },
          { name: t("hero.title").replace(/<[^>]*>?/gm, ''), item: `https://safetools.space/${locale}/security/metadata-cleaner` }
        ]}

        howTo={{
          name: t("seo.title"),
          description: t("seo.description"),
          step: (Array.isArray(t.raw("landing.educational.how_it_works.steps")) ? t.raw("landing.educational.how_it_works.steps") as string[] : []).map((step: string) => ({
            name: step.split('.')[0] || "Step",
            text: step
          }))
        }}
      />
      <ClientOnly>
        <MetadataCleanerClient />
      </ClientOnly>
    </>
  );
}
