import { Metadata } from "next";
import { locales } from "@/config/locales";
import Base64Client from "./Base64Client";
import SEOStructuredData from "@/components/shared/SEOStructuredData";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "base64" });

  return {
    title: t("seo.title"),
    description: t("seo.description"),
    keywords: ["base64 encoder", "base64 decoder", "image to base64", "base64 to image", "data uri generator", "online base64 tool", "private encoding", "text to base64 converter"],
    openGraph: {
      title: t("seo.title"),
      description: t("seo.description"),
      type: "website",
      url: `https://safetools.space/${locale}/devtools/base64`,
    },
    twitter: {
      card: "summary_large_image",
      title: t("seo.title"),
      description: t("seo.description"),
      images: ["/og-image.webp"],
    },
    alternates: { 
      canonical: `/${locale}/devtools/base64`,
      languages: Object.fromEntries(locales.map(l => [l, `/${l}/devtools/base64`]))
    },
  };
}

export default async function Base64Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "base64" });
  const t_common = await getTranslations({ locale, namespace: "common" });

  const faqRaw = t.raw("faq");
  let faqItems: any[] = [];
  if (Array.isArray(faqRaw)) {
    faqItems = faqRaw;
  } else if (faqRaw && Array.isArray(faqRaw.items)) {
    faqItems = faqRaw.items;
  }

  return (
    <>
      <SEOStructuredData 
        browserRequirements={t_common("seo.browserReqs")} 
        name="Base64 Encoder & Decoder"
        description={t("seo.description")}
        url={`https://safetools.space/${locale}/devtools/base64`}
        faqItems={faqItems.map((f: any) => ({ q: f.q || f.question, a: f.a || f.answer }))}
      />
      <Base64Client />
    </>
  );
}
