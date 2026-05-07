import DocsMasterClient from "./DocsMasterClient";

export const metadata = {
  title: "Docs Master | Universal Document Processor",
  description: "View and edit PDF, DOCX, XLSX, PPTX, and CSV files privately in your browser. High-performance WASM rendering with zero-upload privacy.",
  keywords: ["docx viewer", "pptx editor", "xlsx reader", "pdf processor", "private document editor", "browser-based office", "wasm document rendering"],
  alternates: {
    canonical: "/document/master",
  },
  openGraph: {
    title: "Docs Master | SafeTools Studio",
    description: "Universal document processor for PDF, DOCX, XLSX, PPTX, and CSV. No uploads, total privacy.",
    url: "https://safetools.space/document/master",
  },
};

export default function DocsMasterPage() {
  return <DocsMasterClient />;
}
