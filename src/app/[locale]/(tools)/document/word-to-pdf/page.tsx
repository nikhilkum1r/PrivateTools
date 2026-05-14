import { Metadata } from "next";
import { locales } from "@/config/locales";
import WordToPdfClient from "./WordToPdfClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";


import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Word to PDF Converter Online Free – Convert DOC & DOCX to PDF Securely | SafeTools",
    description: "Convert Word documents to PDF for free with secure browser-based processing. Fast DOCX to PDF conversion with zero uploads or registration.",
    keywords: ["word to pdf converter", "doc to pdf", "docx to pdf", "convert word to pdf online", "free word to pdf converter", "online docx to pdf converter", "secure word to pdf tool", "browser based pdf converter", "convert microsoft word to pdf", "best word to pdf converter", "fast doc to pdf converter", "private word to pdf conversion", "free pdf creator", "online pdf generator", "word file to pdf online"],
    openGraph: {
      title: "Word to PDF Converter Online Free – Convert DOC & DOCX to PDF Securely | SafeTools",
      description: "Convert Word documents to PDF online for free with secure browser-based processing. Fast DOC and DOCX to PDF conversion with no uploads, watermark, or registration required.",
      type: "website",
      url: `https://safetools.space/${locale}/document/word-to-pdf`,
    },
    twitter: {
      card: "summary_large_image",
      title: "Word to PDF Converter Online Free – Convert DOC & DOCX to PDF Securely | SafeTools",
      description: "Convert Word documents to PDF for free with secure browser-based processing. Fast DOCX to PDF conversion with zero uploads or registration.",
      images: ["/og-image.webp"],
    },
    alternates: { 
      canonical: `/${locale}/document/word-to-pdf`,
      languages: Object.fromEntries(locales.map(l => [l, `/${l}/document/word-to-pdf`]))
    },
  };
}

export default async function WordToPdfPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "wordToPdf" });
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
        name="Word to PDF Converter"
        description="Convert Word documents to PDF online for free with secure browser-based processing. Fast DOC and DOCX to PDF conversion with no uploads, watermark, or registration required."
        url={`https://safetools.space/${locale}/document/word-to-pdf`}
        faqItems={faqItems.map((f: any) => ({ q: f.q || f.question, a: f.a || f.answer }))}
      />
      <WordToPdfClient />
    </>
  );
}
