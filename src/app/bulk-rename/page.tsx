import { Metadata } from "next";
import BulkRenameClient from "./BulkRenameClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Bulk File Renamer - Batch Rename Files Online | SafeTools",
  description: "Rename hundreds of files instantly with custom patterns, sequencing, and search-and-replace. 100% private, browser-based transformation. No uploads required.",
  keywords: ["bulk rename files", "batch renamer online", "rename multiple files", "file renamer with sequencing", "private bulk renamer", "rename photo batch"],
  openGraph: {
    title: "SafeTools Bulk Master | Industrial Batch Renaming",
    description: "Transform your asset libraries securely in your browser. Instant, private, and powerful.",
    type: "website",
    url: "https://safetools.space/bulk-rename",
  },
};

export default function BulkRenamePage() {
  return (
    <>
      <SEOStructuredData 
        name="Bulk File Renamer"
        description="Instant batch transformation. Pattern-based sequencing for professional asset management directly in your browser."
        url="https://safetools.space/bulk-rename"
      />
      <BulkRenameClient />
    </>
  );
}
