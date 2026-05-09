import { Metadata } from "next";
import DataConverterClient from "./DataConverterClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";
import { DATA_CONVERTER_FAQ } from "@/lib/faq-content";

export const metadata: Metadata = {
  title: "Data Converter Online Free – JSON, XML, CSV, YAML & Base64 Converter | SafeTools",
  description: "Free online data converter for JSON, XML, CSV, YAML, Base64, HEX, URL encoding, and more. Fast, secure, browser-based developer conversion tool with no uploads required.",
  keywords: ["data converter", "json converter", "xml converter", "csv to json", "yaml converter", "base64 encoder", "base64 decoder", "url encoder decoder", "online data converter", "developer tools online", "json to xml converter", "xml to json converter", "secure browser converter", "api data formatter", "free developer utilities", "encoding decoding tool"],
  openGraph: {
    title: "Data Converter Online Free – JSON, XML, CSV, YAML & Base64 Converter | SafeTools",
    description: "Free online data converter for JSON, XML, CSV, YAML, Base64, HEX, URL encoding, and more. Fast, secure, browser-based developer conversion tool with no uploads required.",
    type: "website",
    url: "https://safetools.space/devtools/data-converter",
  },
};

export default function DataConverterPage() {
  return (
    <>
      <SEOStructuredData 
        name="Data Converter"
        description="Convert data instantly between multiple developer and data formats including JSON, XML, CSV, YAML, Base64, HEX, URL encoding, and more with a secure browser-based converter."
        url="https://safetools.space/devtools/data-converter"
        faqItems={DATA_CONVERTER_FAQ}
      />
      <DataConverterClient />
    </>
  );
}
