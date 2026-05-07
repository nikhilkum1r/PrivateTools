import { Metadata } from "next";
import PrivacyHubClient from "./PrivacyHubClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Privacy & Security Hub - Local-First Data Protection | SafeTools",
  description: "Learn about our zero-server privacy architecture. Access secure tools for metadata removal, file encryption, and secure deletion. 100% private and browser-based.",
  keywords: ["privacy tools online", "secure data protection", "zero server knowledge", "private file encryption", "local first software", "data privacy hub"],
  openGraph: {
    title: "SafeTools Privacy Studio | Professional Identity Protection",
    description: "The ultimate local-first privacy and security suite. Fast, private, and powerful.",
    type: "website",
    url: "https://safetools.space/privacy",
  },
};

export default function PrivacyHubPage() {
  return (
    <>
      <SEOStructuredData 
        name="Privacy & Security Suite"
        description="A comprehensive suite of privacy-focused tools including encryption, metadata scrubbing, and secure deletion, all running locally in your browser."
        url="https://safetools.space/privacy"
      />
      <PrivacyHubClient />
    </>
  );
}
