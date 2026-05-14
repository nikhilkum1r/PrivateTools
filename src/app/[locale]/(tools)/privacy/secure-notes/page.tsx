import { Metadata } from "next";
import { locales } from "@/config/locales";
import SecureNotesClient from "./SecureNotesClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";
import { getTranslations } from "next-intl/server";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "secureNotes.seo" });
  const t_common = await getTranslations({ locale, namespace: "common" });
  
  return {
    title: t("title"),
    description: t("description"),
    keywords: ["secure notes", "encrypted notes", "private notes", "secure note app", "browser secure notes", "privacy notes", "local encrypted notes", "online secure notepad", "zero upload notes", "protected notes tool", "AES-256 encryption", "PBKDF2 security", "client-side encryption", "zero-trust notes", "open source privacy"],
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      url: `https://safetools.space/${locale}/privacy/secure-notes`,
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/og-image.webp"],
    },
    alternates: { 
      canonical: `/${locale}/privacy/secure-notes`,
      languages: Object.fromEntries(locales.map(l => [l, `/${l}/privacy/secure-notes`]))
    },
  };
}

export default async function SecureNotesPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "secureNotes" });

  const t_common = await getTranslations({ locale, namespace: "common" });
  return (
    <>
      <SEOStructuredData 
      browserRequirements={t_common("seo.browserReqs")} 
        name={t("seo.title")}
        description={t("seo.description")}
        url={`https://safetools.space/${locale}/privacy/secure-notes`}
        faqItems={t.raw("faq.items") as any}
      />
      <SecureNotesClient />
    </>
  );
}
