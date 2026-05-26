import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { locales } from "@/config/locales";
import UnlockPdfClient from "./UnlockPdfClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pdfUnlock" });

  return {
    title: t("seo.title"),
    description: t("seo.description"),
    keywords: t("seo.keywords").split(",").map((k: string) => k.trim()),
    openGraph: {
      title: t("seo.title"),
      description: t("seo.description"),
      type: "website",
      url: `https://safetools.space/${locale}/pdf/unlock-pdf`,
    },
    twitter: {
      card: "summary_large_image",
      title: t("seo.title"),
      description: t("seo.description"),
      images: ["/og-image.webp"],
    },
    alternates: { 
      canonical: `/${locale}/pdf/unlock-pdf`,
      languages: Object.fromEntries(locales.map(l => [l, `/${l}/pdf/unlock-pdf`]))
    },
  };
}

export default async function UnlockPdfPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pdfUnlock" });
  const t_common = await getTranslations({ locale, namespace: "common" });

  const faqItems = (Array.isArray(t.raw("landing.faq.items")) ? (t.raw("landing.faq.items") as any[]) : []).map(f => ({ q: f.q, a: f.a }));

  return (
    <>
      <SEOStructuredData 
      browserRequirements={t_common("seo.browserReqs")} 
        name={t("seo.title")}
        description={t("seo.description")}
        url={`https://safetools.space/${locale}/pdf/unlock-pdf`}
        faqItems={faqItems}
        breadcrumbs={[
          { name: t_common("home"), item: `https://safetools.space/${locale}` },
          { name: t_common("Navbar.categories.pdf"), item: `https://safetools.space/${locale}/pdf` },
          { name: t("seo.title"), item: `https://safetools.space/${locale}/pdf/unlock-pdf` }
        ]}

        howToSteps={(t.has("landing.educational.how_it_works.steps") && Array.isArray(t.raw("landing.educational.how_it_works.steps")) 
          ? t.raw("landing.educational.how_it_works.steps") as any[] 
          : []).map((step: any) => ({
          name: typeof step === "string" ? (step.split('.')[0] || "Step") : (step.t || step.title || "Step"),
          text: typeof step === "string" ? step : (step.d || step.desc || step.description || "Description")
        }))}
      />
      <UnlockPdfClient />
    </>
  );
}
