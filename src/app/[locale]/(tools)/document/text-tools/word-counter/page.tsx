import { Metadata } from "next";
import { locales } from "@/config/locales";
import WordCounterClient from "./WordCounterClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";


import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Word Counter Online Free – Count Words, Characters & Reading Time | SafeTools",
    description: "Free online word counter to count words, characters, sentences, and reading time instantly. Fast, secure, privacy-focused browser-based text analysis.",
    keywords: ["word counter", "character counter", "online word counter", "free word counter", "text counter tool", "character count tool", "reading time calculator", "speaking time calculator", "essay word counter", "seo content analyzer", "word count checker", "online text analyzer", "live word counter", "paragraph counter", "sentence counter", "writing statistics tool"],
    openGraph: {
      title: "Word Counter Online Free – Count Words, Characters & Reading Time | SafeTools",
      description: "Free online word counter tool to count words, characters, sentences, paragraphs, reading time, and speaking time instantly. Fast, secure, and privacy-focused browser-based text analysis.",
      type: "website",
      url: `https://safetools.space/${locale}/document/text-tools/word-counter`,
    },
    twitter: {
      card: "summary_large_image",
      title: "Word Counter Online Free – Count Words, Characters & Reading Time | SafeTools",
      description: "Free online word counter to count words, characters, sentences, and reading time instantly. Fast, secure, privacy-focused browser-based text analysis.",
      images: ["/og-image.webp"],
    },
    alternates: { 
      canonical: `/${locale}/document/text-tools/word-counter`,
      languages: Object.fromEntries(locales.map(l => [l, `/${l}/document/text-tools/word-counter`]))
    },
  };
}

export default async function WordCounterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "wordCounter" });
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
        name="Word Counter"
        description="Analyze text instantly with a fast and secure online word counter. Count words, characters, sentences, paragraphs, reading time, speaking time, and more directly in your browser."
        url={`https://safetools.space/${locale}/document/text-tools/word-counter`}
        faqItems={faqItems.map((f: any) => ({ q: f.q || f.question, a: f.a || f.answer }))}
      />
      <WordCounterClient />
    </>
  );
}
