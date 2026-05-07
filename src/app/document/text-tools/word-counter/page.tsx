import { Metadata } from "next";
import WordCounterClient from "./WordCounterClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Online Word Counter - Real-time Character & Reading Time | SafeTools",
  description: "Count words, characters, sentences, and estimated reading time in real-time. 100% private, browser-based text analysis with zero server uploads.",
  keywords: ["word counter online", "character count tool", "reading time calculator", "free word count", "private text analysis", "twitter character count", "sentence counter"],
  openGraph: {
    title: "SafeTools Word Master | Professional Text Analytics Studio",
    description: "Analyze your manuscripts securely in your browser. Powerful, private, and precise.",
    type: "website",
    url: "https://safetools.space/document/text-tools/word-counter",
  },
};

export default function WordCounterPage() {
  return (
    <>
      <SEOStructuredData 
        name="Word & Character Counter"
        description="Real-time text analytics for words, characters, sentences, and estimated reading time. Professional-grade local text processing."
        url="https://safetools.space/document/text-tools/word-counter"
      />
      <WordCounterClient />
    </>
  );
}
