import { Metadata } from "next";
import MetadataCleanerClient from "./MetadataCleanerClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Metadata Cleaner | Remove Hidden Data from Files & Images",
  description: "Remove hidden metadata from images, documents, and files securely in your browser. Privacy-first local processing with zero uploads and zero tracking.",
  keywords: ["metadata cleaner", "metadata remover", "remove metadata", "EXIF remover", "file metadata cleaner", "image metadata remover", "privacy metadata tool", "browser metadata cleaner", "remove GPS metadata", "online metadata remover"],
  openGraph: {
    title: "Metadata Cleaner | Remove Hidden Data from Files & Images",
    description: "Remove hidden metadata from images, documents, and files securely in your browser. Privacy-first local processing with zero uploads and zero tracking.",
    type: "website",
    url: "https://safetools.space/security/metadata-cleaner",
  },
  twitter: {
    card: "summary_large_image",
    title: "Metadata Cleaner | Remove Hidden Data from Files & Images",
    description: "Remove hidden metadata from images, documents, and files securely in your browser. Privacy-first local processing with zero uploads and zero tracking.",
    images: ["/og-image.webp"],
  },
  alternates: { canonical: "/security/metadata-cleaner" },
};

export default function MetadataCleanerPage() {
  return (
    <>
      <SEOStructuredData 
        name="Metadata Cleaner"
        description="Remove hidden metadata from images, documents, and files securely in your browser. Privacy-first local processing with zero uploads and zero tracking."
        url="https://safetools.space/security/metadata-cleaner"
        faqItems={[
          { q: "Are files uploaded to servers?", a: "No. All metadata cleaning happens locally inside your browser." },
          { q: "Can metadata reveal my location?", a: "Yes. GPS coordinates and device information may be embedded inside files." },
          { q: "Does this tool work offline?", a: "Yes. Offline support can be enabled through PWA functionality." },
          { q: "Can SafeTools access my files?", a: "No. Files remain locally processed and are not stored." },
          { q: "Which metadata can be removed?", a: "EXIF, GPS, timestamps, author data, software information, and more." }
        ].map(f => ({ question: f.q, answer: f.a }))}
        breadcrumbs={[
          { name: "Home", item: "https://safetools.space" },
          { name: "Security Tools", item: "https://safetools.space/security" },
          { name: "Metadata Cleaner", item: "https://safetools.space/security/metadata-cleaner" }
        ]}
      />
      <MetadataCleanerClient />
    </>
  );
}
