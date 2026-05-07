import { Metadata } from "next";
import CaseConverterClient from "./CaseConverterClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Online Case Converter - Upper, Lower, Camel, Snake Case | SafeTools",
  description: "Change text case instantly between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, and snake_case. 100% private, browser-based text transformation.",
  keywords: ["case converter online", "change text case", "convert text to uppercase", "title case converter", "camel case converter", "snake case generator", "sentence case tool", "private text tools"],
  openGraph: {
    title: "SafeTools Case Master | Professional Text Transformation Studio",
    description: "Transform your text casing securely in your browser. Powerful, private, and precise.",
    type: "website",
    url: "https://safetools.space/document/text-tools/case-converter",
  },
};

export default function CaseConverterPage() {
  return (
    <>
      <SEOStructuredData 
        name="Text Case Converter"
        description="Transform text between various casing conventions including Sentence, Title, Camel, and Snake case. Professional-grade local text processing."
        url="https://safetools.space/document/text-tools/case-converter"
      />
      <CaseConverterClient />
    </>
  );
}
