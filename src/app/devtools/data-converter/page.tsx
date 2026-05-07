import { Metadata } from "next";
import DataConverterClient from "./DataConverterClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Online JSON to CSV & CSV to JSON Converter - Free | SafeTools",
  description: "Convert JSON to CSV and CSV to JSON instantly in your browser. Industrial-grade data transformation with 100% privacy, zero server uploads, and no signup.",
  keywords: ["json to csv converter", "csv to json converter", "online data converter", "convert json to excel csv", "private json tools", "json data transformation"],
  openGraph: {
    title: "SafeTools Data Studio | Professional JSON & CSV Transformation",
    description: "Transform your data structures securely in your browser. Powerful, private, and precise.",
    type: "website",
    url: "https://safetools.space/devtools/data-converter",
  },
};

export default function DataConverterPage() {
  return (
    <>
      <SEOStructuredData 
        name="JSON to CSV & CSV to JSON Converter"
        description="Bidirectional data transformation for JSON and CSV structures. Process your data securely in your browser with zero server uploads."
        url="https://safetools.space/devtools/data-converter"
      />
      <DataConverterClient />
    </>
  );
}
