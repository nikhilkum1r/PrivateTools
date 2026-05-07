import { Metadata } from "next";
import MetadataCleanerClient from "./MetadataCleanerClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Metadata Remover - Strip EXIF & Privacy Markers | SafeTools",
  description: "Remove hidden metadata, GPS locations, and camera information from your images, PDFs, and videos. 100% private, browser-based purging.",
  keywords: ["metadata remover", "strip exif", "remove gps from photos", "privacy scrubber", "clean file metadata", "remove pdf author"],
  openGraph: {
    title: "SafeTools Metadata Remover | Privacy-First Purging",
    description: "Protect your identity by removing tracking markers from your assets. Zero server uploads.",
    type: "website",
    url: "https://safetools.space/privacy/metadata",
  },
};

export default function MetadataRemoverPage() {
  return (
    <>
      <SEOStructuredData 
        name="Metadata Remover"
        description="Industrial-grade metadata purging directly in your browser. Strip GPS, camera signatures, and tracking markers locally."
        url="https://safetools.space/privacy/metadata"
      />
      <MetadataCleanerClient />
    </>
  );
}
