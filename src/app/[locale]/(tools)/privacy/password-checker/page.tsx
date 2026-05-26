import { Metadata } from "next";
import PasswordCheckerClient from "./client";
import { getTranslations, setRequestLocale } from "next-intl/server";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "navbar.items" });
  return {
    title: `${t("passwordChecker")} | SafeTools`,
    description: t("passwordCheckerDesc"),
    openGraph: {
      title: `${t("passwordChecker")} | SafeTools`,
      description: t("passwordCheckerDesc"),
      type: "website",
      url: `https://safetools.space/${locale}/privacy/password-checker`,
    },
    alternates: {
      canonical: `/${locale}/privacy/password-checker`,
    },
  };
}

export default async function PasswordCheckerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "passwordChecker" });
  const common = await getTranslations({ locale, namespace: "common" });

  return (
    <>
      <SEOStructuredData 
        name={t("title")}
        description={t("description")}
        url={`https://safetools.space/${locale}/privacy/password-checker`}
        faqItems={t.raw("faq.items")}
        breadcrumbs={[
          { name: common("home"), item: `https://safetools.space/${locale}` },
          { name: common("privacyTools"), item: `https://safetools.space/${locale}/privacy` },
          { name: t("title"), item: `https://safetools.space/${locale}/privacy/password-checker` }
        ]}

        howToSteps={(t.has("landing.educational.how_it_works.steps") && Array.isArray(t.raw("landing.educational.how_it_works.steps")) 
          ? t.raw("landing.educational.how_it_works.steps") as any[] 
          : []).map((step: any) => ({
          name: typeof step === "string" ? (step.split('.')[0] || "Step") : (step.t || step.title || "Step"),
          text: typeof step === "string" ? step : (step.d || step.desc || step.description || "Description")
        }))}
      />
      <PasswordCheckerClient />
    </>
  );
}
