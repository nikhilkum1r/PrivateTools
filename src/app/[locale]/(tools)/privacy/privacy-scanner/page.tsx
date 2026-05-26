import { Metadata } from "next";
import PrivacyScannerClient from "./PrivacyScannerClient";
import { getTranslations, setRequestLocale } from "next-intl/server";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "navbar.items" });
  return {
    title: `${t("dataLeakChecker")} | SafeTools`,
    description: t("dataLeakCheckerDesc"),
    openGraph: {
      title: `${t("dataLeakChecker")} | SafeTools`,
      description: t("dataLeakCheckerDesc"),
      type: "website",
      url: `https://safetools.space/${locale}/privacy/privacy-scanner`,
    },
    alternates: {
      canonical: `/${locale}/privacy/privacy-scanner`,
    },
  };
}

export default async function PrivacyScannerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "privacyScanner" });
  const common = await getTranslations({ locale, namespace: "common" });

  return (
    <>
      <SEOStructuredData 
        name={t("title")}
        description={t("description")}
        url={`https://safetools.space/${locale}/privacy/privacy-scanner`}
        faqItems={t.raw("faq.items")}
        breadcrumbs={[
          { name: common("home"), item: `https://safetools.space/${locale}` },
          { name: common("privacyTools"), item: `https://safetools.space/${locale}/privacy` },
          { name: t("title"), item: `https://safetools.space/${locale}/privacy/privacy-scanner` }
        ]}

        howToSteps={(t.has("landing.educational.how_it_works.steps") && Array.isArray(t.raw("landing.educational.how_it_works.steps")) 
          ? t.raw("landing.educational.how_it_works.steps") as any[] 
          : []).map((step: any) => ({
          name: typeof step === "string" ? (step.split('.')[0] || "Step") : (step.t || step.title || "Step"),
          text: typeof step === "string" ? step : (step.d || step.desc || step.description || "Description")
        }))}
      />
      <PrivacyScannerClient />
    </>
  );
}
