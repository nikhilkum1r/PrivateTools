import { Metadata } from "next";
import { notFound } from "next/navigation";
import PDFConverterClient from "../PDFConverterClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const PDF_TASKS = [
  "pdf-to-word",
  "pdf-to-pptx",
  "pdf-to-jpg",
  "pdf-to-png",
  "pdf-to-text"
];

export async function generateStaticParams() {
  return PDF_TASKS.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  const titles: Record<string, string> = {
    "pdf-to-word": "Convert PDF to Word (.docx) Online - Free & Private",
    "pdf-to-pptx": "Convert PDF to PowerPoint (.pptx) Online - Free & Private",
    "pdf-to-jpg": "Convert PDF to JPG Online - High Quality Images",
    "pdf-to-png": "Convert PDF to PNG Online - Transparent Backgrounds",
    "pdf-to-text": "Convert PDF to Text (TXT) Online - Extract Content"
  };

  const title = titles[slug] || "PDF Converter";
  const parts = slug.split("-to-");
  const from = parts[0].toUpperCase();
  const to = parts[1].toUpperCase();

  return {
    title: `${title} | SafeTools`,
    description: `Professional-grade ${from} to ${to} conversion. Secure, browser-based processing with zero server uploads. 100% data sovereignty guaranteed.`,
    keywords: [`${from.toLowerCase()} to ${to.toLowerCase()}`, `convert ${from} to ${to} online`, "private pdf converter", "browser-based pdf tool"],
    openGraph: {
      title: `${from} to ${to} Studio | SafeTools`,
      description: `Reconstruct your ${from} documents into ${to} format securely in your browser.`,
      type: "website",
    }
  };
}

export default async function PDFConversionSEOPage({ params }: PageProps) {
  const { slug } = await params;
  
  if (!PDF_TASKS.includes(slug)) notFound();

  const parts = slug.split("-to-");
  const from = parts[0];
  const to = parts[1];

  return (
    <>
      <SEOStructuredData 
        name={`Convert ${from.toUpperCase()} to ${to.toUpperCase()}`}
        description={`Securely convert ${from.toUpperCase()} files to ${to.toUpperCase()} format in your browser.`}
        url={`https://safetools.space/pdf/convert/${slug}`}
        breadcrumbs={[
          { name: "Home", item: "https://safetools.space" },
          { name: "PDF Tools", item: "https://safetools.space/pdf" },
          { name: `Convert ${from.toUpperCase()} to ${to.toUpperCase()}`, item: `https://safetools.space/pdf/convert/${slug}` }
        ]}
      />
      <PDFConverterClient initialTask={slug} />
    </>
  );
}
