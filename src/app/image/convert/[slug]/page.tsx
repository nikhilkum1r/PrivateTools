import { Metadata } from "next";
import { notFound } from "next/navigation";
import ConversionStudioClient from "../ConversionStudioClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const COMMON_FORMATS = ["png", "jpeg", "webp", "avif", "pdf", "heic", "svg", "tiff", "gif", "ico"];

export async function generateStaticParams() {
  const params: { slug: string }[] = [];
  
  // Generate top 50 common pairs for build-time optimization
  const featured = ["png", "jpeg", "webp", "avif", "pdf", "heic"];
  for (const from of featured) {
    for (const to of featured) {
      if (from !== to) {
        params.push({ slug: `${from}-to-${to}` });
      }
    }
  }
  
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const parts = slug.split("-to-");
  
  if (parts.length !== 2) return { title: "Image Converter" };
  
  const from = parts[0].toUpperCase();
  const to = parts[1].toUpperCase();
  
  return {
    title: `Convert ${from} to ${to} Online - Free & Private | PrivateTools`,
    description: `High-quality ${from} to ${to} converter. Secure, browser-based conversion with zero server uploads. Batch process your ${from} files to ${to} instantly.`,
    keywords: [`convert ${from} to ${to}`, `${from} to ${to} online`, `batch ${from} converter`, `private image conversion`],
    openGraph: {
      title: `Convert ${from} to ${to} | PrivateTools Studio`,
      description: `Professional-grade ${from} to ${to} conversion. 100% private.`,
      type: "website",
    }
  };
}

export default async function ConversionSEOPage({ params }: PageProps) {
  const { slug } = await params;
  const parts = slug.split("-to-");
  
  if (parts.length !== 2) notFound();
  
  const from = parts[0];
  const to = parts[1];
  
  return (
    <ConversionStudioClient 
      fromFormat={from} 
      toFormat={to} 
    />
  );
}
