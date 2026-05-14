import { Metadata } from "next";
import { locales } from "@/config/locales";
import ColorLabClient from "./ColorLabClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "colorLab" });
  const t_common = await getTranslations({ locale, namespace: "common" });

  return {
    title: t("seo.title"),
    description: t("seo.description"),
    keywords: t.raw("seo.keywords") as string[],
    openGraph: {
      title: t("seo.ogTitle"),
      description: t("seo.ogDescription"),
      type: "website",
      url: `https://safetools.space/${locale}/image/colors`,
    },
    twitter: {
      card: "summary_large_image",
      title: t("seo.title"),
      description: t("seo.description"),
      images: ["/og-image.webp"],
    },
    alternates: { 
      canonical: `/${locale}/image/colors`,
    },
  };
}

export default async function ColorLabPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "colorLab" });

  const t_common = await getTranslations({ locale, namespace: "common" });
  return (
    <>
      <SEOStructuredData 
      browserRequirements={t_common("seo.browserReqs")} 
        name={t("seo.structuredName")}
        description={t("seo.structuredDesc")}
        url={`https://safetools.space/${locale}/image/colors`}
        faqItems={t.raw("faq.items") as any}
      />
      <ColorLabClient />
    </>
  );
}
