import DocsMasterClient from "./DocsMasterClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Docs Master Pro — Universal Document Viewer & Editor | SafeTools",
    description:
      "Open, view, and edit any document format — PDF, DOCX, DOC, XLSX, PPTX, CSV, JSON, XML, HTML, MD, RTF, ODT, ODS, ODP — 100% privately in your browser. Powered by WebAssembly with zero uploads.",
    keywords: [
      "online document viewer", "docx viewer online free", "xlsx editor online", "pptx viewer browser",
      "pdf reader online", "csv editor browser", "odt viewer online", "rtf reader online",
      "markdown viewer", "xml viewer online", "html file viewer", "document editor no upload",
      "private document editor", "wasm document processing", "browser office suite", "zero server document viewer",
      "open source document viewer", "free docx editor", "online spreadsheet editor", "presentation viewer browser",
    ],
    alternates: {
      canonical: `/${locale}/document/master`,
      languages: {
        "en": "/en/document/master",
        "hi": "/hi/document/master",
        "es": "/es/document/master",
        "fr": "/fr/document/master",
        "de": "/de/document/master",
        "pt": "/pt/document/master",
        "zh": "/zh/document/master",
        "ja": "/ja/document/master",
        "ar": "/ar/document/master",
        "ru": "/ru/document/master",
      },
    },
    openGraph: {
      title: "Docs Master Pro — Universal Document Viewer & Editor",
      description:
        "View and edit PDF, DOCX, XLSX, PPTX, CSV, JSON, XML, HTML, MD, RTF, ODT and 20+ more formats privately in your browser. No uploads. No accounts. WebAssembly-powered.",
      url: `https://safetools.space/${locale}/document/master`,
      type: "website",
      images: [{ url: "/og-image.webp", width: 1200, height: 630, alt: "Docs Master Pro — Universal Document Viewer" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Docs Master Pro — Universal Document Viewer & Editor | SafeTools",
      description:
        "Open any document format in your browser with zero uploads. PDF, DOCX, XLSX, PPTX, CSV, JSON, XML, MD, RTF, ODT and more.",
      images: ["/og-image.webp"],
    },
  };
}

export default async function DocsMasterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t_common = await getTranslations({ locale, namespace: "common" });
  return (
    <>
      <SEOStructuredData
        browserRequirements={t_common("seo.browserReqs")}
        name="Docs Master Pro"
        description="Universal document viewer and editor for PDF, DOCX, XLSX, PPTX, CSV, JSON, XML, HTML, MD, RTF, ODT, ODS, ODP and more — 100% browser-based with zero server uploads."
        url={`https://safetools.space/${locale}/document/master`}
      />
      <DocsMasterClient />
    </>
  );
}
