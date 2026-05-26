import { Metadata } from "next";
import { locales } from "@/config/locales";
import { getTranslations } from "next-intl/server";
import SteganographyClient from "./SteganographyClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "steganography" });
  const t_common = await getTranslations({ locale, namespace: "common" });

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
    keywords: t("metadata.keywords").split(",").map((k: string) => k.trim()),
    openGraph: {
      title: t("metadata.title"),
      description: t("metadata.description"),
      type: "website",
      url: `https://safetools.space/${locale}/security/steganography`,
    },
    twitter: {
      card: "summary_large_image",
      title: t("metadata.title"),
      description: t("metadata.description"),
      images: ["/og-image.webp"],
    },
    alternates: { 
      canonical: `/${locale}/security/steganography`,
      languages: Object.fromEntries(locales.map(l => [l, `/${l}/security/steganography`]))
    },
  };
}

export default async function SteganographyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "steganography" });
  const common = await getTranslations({ locale, namespace: "common" });

  const t_common = await getTranslations({ locale, namespace: "common" });
  return (
    <>
      <SEOStructuredData 
      browserRequirements={t_common("seo.browserReqs")} 
        name={t("metadata.title")}
        description={t("metadata.description")}
        url={`https://safetools.space/${locale}/security/steganography`}
        faqItems={t.raw("landing.faq.items") as any[]}
        breadcrumbs={[
          { name: common("home"), item: `https://safetools.space/${locale}` },
          { name: common("securityTools"), item: `https://safetools.space/${locale}/security` },
          { name: t("hero.title"), item: `https://safetools.space/${locale}/security/steganography` }
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
      <SteganographyClient />
    </>
  );
}
