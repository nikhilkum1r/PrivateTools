import { Metadata } from "next";
import TextToolsClient from "./TextToolsClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Online Text Utilities - Format, Analyze & Encode Text | SafeTools",
  description: "A comprehensive suite of text utilities including word count, case conversion, and duplicate removal. 100% private, browser-based text processing.",
  keywords: ["text utilities", "word count online", "remove duplicate lines", "uppercase converter", "base64 encoder online", "url encoder decoder", "private text tools"],
  openGraph: {
    title: "SafeTools Text Studio | Professional Content Transformation",
    description: "Transform and analyze your text securely in your browser. zero server uploads.",
    type: "website",
    url: "https://safetools.space/document/text-tools",
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Text Utilities - Format, Analyze & Encode Text | SafeTools",
    description: "A comprehensive suite of text utilities including word count, case conversion, and duplicate removal. 100% private, browser-based text processing.",
    images: ["/og-image.webp"],
  },
  alternates: { canonical: "/document/text-tools" },
};

export default function TextToolsPage() {
  return (
    <>
      <SEOStructuredData 
        name="Text Utility Suite"
        description="Transform, analyze and encode text instantly in your browser. 100% private and secure."
        url="https://safetools.space/document/text-tools"
      />
      <TextToolsClient />
    </>
  );
}
