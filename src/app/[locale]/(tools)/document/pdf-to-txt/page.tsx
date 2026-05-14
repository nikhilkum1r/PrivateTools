import { Metadata } from "next";
import { locales } from "@/config/locales";
import PdfToTxtClient from "./PdfToTxtClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";


import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "PDF to TXT Converter Online Free – Extract Text from PDF Instantly | SafeTools",
    description: "Convert PDF to TXT for free with secure browser-based processing. Extract plain text from PDF files instantly without uploads or registration.",
    keywords: ["pdf to txt", "pdf to text converter", "extract text from pdf", "convert pdf to txt online", "free pdf to txt converter", "online pdf text extractor", "secure pdf text converter", "browser based pdf converter", "extract plain text from pdf", "pdf text extraction tool", "convert scanned pdf to text", "fast pdf to txt converter", "pdf content extractor", "online text extraction tool", "free txt generator"],
    openGraph: {
      title: "PDF to TXT Converter Online Free – Extract Text from PDF Instantly | SafeTools",
      description: "Convert PDF to TXT online for free with secure browser-based processing. Extract plain text from PDF files instantly without uploads, registration, or watermarks.",
      type: "website",
      url: `https://safetools.space/${locale}/document/pdf-to-txt`,
    },
    twitter: {
      card: "summary_large_image",
      title: "PDF to TXT Converter Online Free – Extract Text from PDF Instantly | SafeTools",
      description: "Convert PDF to TXT for free with secure browser-based processing. Extract plain text from PDF files instantly without uploads or registration.",
      images: ["/og-image.webp"],
    },
    alternates: { 
      canonical: `/${locale}/document/pdf-to-txt`,
      languages: Object.fromEntries(locales.map(l => [l, `/${l}/document/pdf-to-txt`]))
    },
  };
}

export default async function PdfToTxtPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pdfToTxt" });
  const t_common = await getTranslations({ locale, namespace: "common" });

  const faqRaw = t.raw("landing.faq");
  let faqItems: any[] = [];
  if (faqRaw && Array.isArray(faqRaw.items)) {
    faqItems = faqRaw.items;
  } else if (Array.isArray(faqRaw)) {
    faqItems = faqRaw;
  }

  return (
    <>
      <SEOStructuredData 
      browserRequirements={t_common("seo.browserReqs")} 
        name="PDF to TXT Converter"
        description="Convert PDF to TXT online for free with secure browser-based processing. Extract plain text from PDF files instantly without uploads, registration, or watermarks."
        url={`https://safetools.space/${locale}/document/pdf-to-txt`}
        faqItems={faqItems.map((f: any) => ({ q: f.q || f.question, a: f.a || f.answer }))}
      />
      <PdfToTxtClient />
    </>
  );
}
