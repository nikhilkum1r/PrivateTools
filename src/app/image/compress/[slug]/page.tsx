import { Metadata } from "next";
import { notFound } from "next/navigation";
import CompressorStudioClient from "../CompressorStudioClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const SUPPORTED_FORMATS = ["png", "jpeg", "webp", "avif", "heic", "svg", "tiff", "gif"];

export async function generateStaticParams() {
  return SUPPORTED_FORMATS.map(fmt => ({
    slug: `compress-${fmt}`
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const format = slug.replace("compress-", "").toUpperCase();
  
  return {
    title: `Compress ${format} Online - Free & Private | PrivateTools`,
    description: `Professional-grade ${format} compressor. Reduce file size of your ${format} images without losing quality. 100% private, browser-based optimization.`,
    keywords: [`compress ${format}`, `reduce ${format} file size`, `online ${format} optimizer`, `private image compression`],
    openGraph: {
      title: `Optimize ${format} Images | PrivateTools`,
      description: `Shrink your ${format} assets by up to 90%. No server uploads.`,
      type: "website",
    }
  };
}

export default async function CompressionSEOPage({ params }: PageProps) {
  const { slug } = await params;
  const format = slug.replace("compress-", "");
  
  if (!SUPPORTED_FORMATS.includes(format) && !slug.startsWith("compress-")) {
    notFound();
  }
  
  return (
    <CompressorStudioClient 
      defaultFormat={format === "jpeg" ? "jpeg" : (format === "original" ? undefined : format)} 
    />
  );
}
