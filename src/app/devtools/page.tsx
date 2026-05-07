import { Metadata } from "next";
import DevToolsStudioClient from "./DevToolsStudioClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Developer Utility Suite - JSON, JWT, Base64 & More | SafeTools",
  description: "A comprehensive suite of developer utilities including JSON formatting, JWT debugging, Base64 encoding, and more. All processing is 100% local and private.",
  keywords: ["developer tools", "json formatter", "jwt debugger", "base64 encoder", "uuid generator", "private devtools", "hash generator", "code formatter"],
  openGraph: {
    title: "SafeTools Dev Studio | Professional Developer Utilities",
    description: "Format, debug, and encode data securely in your browser. zero server uploads.",
    type: "website",
    url: "https://safetools.space/devtools",
  },
};

export default function DevToolsPage() {
  return (
    <>
      <SEOStructuredData 
        name="Developer Utility Suite"
        description="A comprehensive suite of developer utilities including JSON formatting, JWT debugging, and Base64 encoding directly in your browser."
        url="https://safetools.space/devtools"
      />
      <DevToolsStudioClient initialTool="json" />
    </>
  );
}
