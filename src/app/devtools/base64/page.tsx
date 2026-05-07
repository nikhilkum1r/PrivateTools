import { Metadata } from "next";
import Base64Client from "./Base64Client";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Base64 Encoder & Decoder - Online Image to Base64 | SafeTools",
  description: "Encode text and images to Base64 or decode Base64 strings instantly. Convert JPG, PNG, SVG to Data URI securely in your browser. 100% private, zero server uploads.",
  keywords: ["base64 encoder", "base64 decoder", "image to base64", "base64 to image", "data uri generator", "online base64 tool", "private encoding", "text to base64 converter"],
  openGraph: {
    title: "SafeTools Base64 Master | Professional Binary Studio",
    description: "Encode and decode your assets securely in your browser. Powerful, private, and precise.",
    type: "website",
    url: "https://safetools.space/devtools/base64",
  },
};

export default function Base64Page() {
  return (
    <>
      <SEOStructuredData 
        name="Base64 Encoder & Decoder"
        description="Professional-grade Base64 encoding and decoding for text and images. Convert assets to Data URIs securely in your browser with zero server uploads."
        url="https://safetools.space/devtools/base64"
      />
      <Base64Client />
    </>
  );
}
