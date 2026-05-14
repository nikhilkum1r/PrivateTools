import { Metadata } from "next";
import { locales } from "@/config/locales";
import CaseConverterClient from "./CaseConverterClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";


import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Case Converter Online Free – Uppercase, Lowercase & Text Case Tool | SafeTools",
    description: "Convert text instantly with a free online case converter. Change text to uppercase, title case, camelCase, and more securely in your browser.",
    keywords: ["case converter", "uppercase converter", "lowercase converter", "title case converter", "sentence case converter", "camelcase converter", "snake case converter", "kebab case converter", "text formatter online", "online capitalization tool", "free case converter", "developer text formatter", "convert text case online", "text transformation tool", "coding naming converter", "seo title formatter"],
    openGraph: {
      title: "Case Converter Online Free – Uppercase, Lowercase & Text Case Tool | SafeTools",
      description: "Convert text instantly with a free online case converter. Change text to uppercase, lowercase, title case, sentence case, camelCase, snake_case, and more securely in your browser.",
      type: "website",
      url: `https://safetools.space/${locale}/document/text-tools/case-converter`,
    },
    twitter: {
      card: "summary_large_image",
      title: "Case Converter Online Free – Uppercase, Lowercase & Text Case Tool | SafeTools",
      description: "Convert text instantly with a free online case converter. Change text to uppercase, title case, camelCase, and more securely in your browser.",
      images: ["/og-image.webp"],
    },
    alternates: { 
      canonical: `/${locale}/document/text-tools/case-converter`,
      languages: Object.fromEntries(locales.map(l => [l, `/${l}/document/text-tools/case-converter`]))
    },
  };
}

export default async function CaseConverterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "caseConverter" });
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
        name="Case Converter"
        description="Transform text instantly with a fast and privacy-focused online case converter. Convert uppercase, lowercase, title case, sentence case, camelCase, snake_case, kebab-case, and more directly in your browser."
        url={`https://safetools.space/${locale}/document/text-tools/case-converter`}
        faqItems={faqItems.map((f: any) => ({ q: f.q || f.question, a: f.a || f.answer }))}
      />
      <CaseConverterClient />
    </>
  );
}
