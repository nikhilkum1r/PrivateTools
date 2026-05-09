import { Metadata } from "next";
import WordCounterClient from "./WordCounterClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";
import { WORD_COUNTER_FAQ } from "@/lib/faq-content";

export const metadata: Metadata = {
  title: "Word Counter Online Free – Count Words, Characters & Reading Time | SafeTools",
  description: "Free online word counter tool to count words, characters, sentences, paragraphs, reading time, and speaking time instantly. Fast, secure, and privacy-focused browser-based text analysis.",
  keywords: ["word counter", "character counter", "online word counter", "free word counter", "text counter tool", "character count tool", "reading time calculator", "speaking time calculator", "essay word counter", "seo content analyzer", "word count checker", "online text analyzer", "live word counter", "paragraph counter", "sentence counter", "writing statistics tool"],
  openGraph: {
    title: "Word Counter Online Free – Count Words, Characters & Reading Time | SafeTools",
    description: "Free online word counter tool to count words, characters, sentences, paragraphs, reading time, and speaking time instantly. Fast, secure, and privacy-focused browser-based text analysis.",
    type: "website",
    url: "https://safetools.space/document/text-tools/word-counter",
  },
};

export default function WordCounterPage() {
  return (
    <>
      <SEOStructuredData 
        name="Word Counter"
        description="Analyze text instantly with a fast and secure online word counter. Count words, characters, sentences, paragraphs, reading time, speaking time, and more directly in your browser."
        url="https://safetools.space/document/text-tools/word-counter"
        faqItems={WORD_COUNTER_FAQ}
      />
      <WordCounterClient />
    </>
  );
}
