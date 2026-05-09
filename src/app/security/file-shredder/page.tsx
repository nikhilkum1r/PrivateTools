import { Metadata } from "next";
import FileShredderClient from "./FileShredderClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "File Shredder | Securely Delete Files & Protect Privacy",
  description: "Securely remove sensitive files with a privacy-first browser-based file shredder. Local processing with zero uploads and zero tracking.",
  keywords: [
    "file shredder", 
    "secure file deletion", 
    "secure delete files", 
    "privacy file remover", 
    "secure file wipe",
    "browser file shredder",
    "local secure delete",
    "file recovery protection",
    "secure file cleanup",
    "online file shredder"
  ],
  openGraph: {
    title: "File Shredder | Securely Delete Files & Protect Privacy",
    description: "Securely remove sensitive files with a privacy-first browser-based file shredder. Local processing with zero uploads and zero tracking.",
    type: "website",
    url: "https://safetools.space/security/file-shredder",
  },
};

export default function FileShredderPage() {
  return (
    <>
      <SEOStructuredData 
        name="File Shredder"
        description="Securely remove sensitive files with a privacy-first browser-based file shredder. Local processing with zero uploads and zero tracking."
        url="https://safetools.space/security/file-shredder"
        faqItems={[
          { q: "Are my files uploaded?", a: "No. All file processing happens locally inside your browser." },
          { q: "Can deleted files still be recovered?", a: "Recovery risk may vary depending on operating system behavior, storage devices, and hardware architecture." },
          { q: "Does this work on SSDs?", a: "Modern SSD storage mechanisms can affect overwrite behavior." },
          { q: "Does this tool work offline?", a: "Yes. Offline support can be enabled through PWA functionality." },
          { q: "Can SafeTools access my files?", a: "No. Files remain locally processed." }
        ].map(f => ({ question: f.q, answer: f.a }))}
        breadcrumbs={[
          { name: "Home", item: "https://safetools.space" },
          { name: "Security Tools", item: "https://safetools.space/security" },
          { name: "File Shredder", item: "https://safetools.space/security/file-shredder" }
        ]}
      />
      <FileShredderClient />
    </>
  );
}
