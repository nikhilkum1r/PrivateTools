import { Metadata } from "next";
import IconStudioClient from "./IconStudioClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Favicon Generator - Create Professional App Icons | SafeTools",
  description: "Generate all favicon sizes and formats (ICO, PNG, Apple Touch Icon) from any image. 100% private, browser-based icon creation.",
  keywords: ["favicon generator", "create favicon", "ico converter", "apple touch icon generator", "android chrome icon generator", "online favicon maker"],
  openGraph: {
    title: "SafeTools Favicon Master | Professional App Icons",
    description: "Convert any image into a complete set of professional web and mobile icons instantly.",
    type: "website",
    url: "https://safetools.space/image/favicon",
  },
};

export default function FaviconGeneratorPage() {
  return (
    <>
      <SEOStructuredData 
        name="Favicon Generator"
        description="Professional-grade favicon generation directly in your browser. Create all required icon sizes instantly."
        url="https://safetools.space/image/favicon"
      />
      <IconStudioClient />
    </>
  );
}
