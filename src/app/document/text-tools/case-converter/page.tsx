import { Metadata } from "next";
import CaseConverterClient from "./CaseConverterClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";
import { CASE_CONVERTER_FAQ } from "@/lib/faq-content";

export const metadata: Metadata = {
  title: "Case Converter Online Free – Uppercase, Lowercase & Text Case Tool | SafeTools",
  description: "Convert text instantly with a free online case converter. Change text to uppercase, lowercase, title case, sentence case, camelCase, snake_case, and more securely in your browser.",
  keywords: ["case converter", "uppercase converter", "lowercase converter", "title case converter", "sentence case converter", "camelcase converter", "snake case converter", "kebab case converter", "text formatter online", "online capitalization tool", "free case converter", "developer text formatter", "convert text case online", "text transformation tool", "coding naming converter", "seo title formatter"],
  openGraph: {
    title: "Case Converter Online Free – Uppercase, Lowercase & Text Case Tool | SafeTools",
    description: "Convert text instantly with a free online case converter. Change text to uppercase, lowercase, title case, sentence case, camelCase, snake_case, and more securely in your browser.",
    type: "website",
    url: "https://safetools.space/document/text-tools/case-converter",
  },
};

export default function CaseConverterPage() {
  return (
    <>
      <SEOStructuredData 
        name="Case Converter"
        description="Transform text instantly with a fast and privacy-focused online case converter. Convert uppercase, lowercase, title case, sentence case, camelCase, snake_case, kebab-case, and more directly in your browser."
        url="https://safetools.space/document/text-tools/case-converter"
        faqItems={CASE_CONVERTER_FAQ}
      />
      <CaseConverterClient />
    </>
  );
}
