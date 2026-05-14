import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { locales } from "@/config/locales";
import { notFound } from "next/navigation";
import CompressorStudioClient from "../CompressorStudioClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

import { SUPPORTED_COMPRESSION_FORMATS } from "@/config/seo-routes";

export async function generateStaticParams() {
  return SUPPORTED_COMPRESSION_FORMATS.map(fmt => ({
    slug: `compress-${fmt}`
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const { slug } = await params;
  const format = slug.replace("compress-", "").toUpperCase();
  
  const ogImageUrl = `https://safetools.space/api/og?title=${encodeURIComponent(`Compress ${format} Online`)}&subtitle=${encodeURIComponent('Shrink files by up to 90% offline.')}`;

  return {
    title: `Compress ${format} Online - Free & Private | SafeTools`,
    description: `Professional-grade ${format} compressor. Reduce file size of your ${format} images without losing quality. 100% private, browser-based optimization.`,
    keywords: [`compress ${format}`, `reduce ${format} file size`, `online ${format} optimizer`, `private image compression`],
    openGraph: {
      title: `Optimize ${format} Images | SafeTools`,
      description: `Shrink your ${format} assets by up to 90%. No server uploads.`,
      type: "website",
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `Optimize ${format} Images | SafeTools`,
      description: `Shrink your ${format} assets by up to 90%. No server uploads.`,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: `/image/compress/${slug}`,
    }
  };
}

export default async function CompressionSEOPage({ params }: PageProps) {
  const { locale } = await params;
  const { slug } = await params;
  const format = slug.replace("compress-", "");
  
  if (!SUPPORTED_COMPRESSION_FORMATS.includes(format) && !slug.startsWith("compress-")) {
    notFound();
  }
  
  const t_common = await getTranslations({ locale, namespace: "common" });

  const howToData = {
    name: `How to compress ${format.toUpperCase()} images`,
    description: `Learn how to compress your ${format.toUpperCase()} files without losing quality directly in your browser.`,
    step: [
      {
        name: `Upload ${format.toUpperCase()} File`,
        text: `Drag and drop your ${format.toUpperCase()} image or select it from your device.`
      },
      {
        name: "Adjust Compression Settings",
        text: "Select your desired quality slider (Lossless, High, Medium, Low) to balance size and visual fidelity."
      },
      {
        name: "Preview Size Reduction",
        text: "Compare the original size versus the optimized size before committing."
      },
      {
        name: "Download Optimized Image",
        text: "Click download to save the compressed image securely to your device."
      }
    ]
  };

  return (
    <>
      <SEOStructuredData 
      browserRequirements={t_common("seo.browserReqs")} 
        name={`Compress ${format.toUpperCase()}`}
        description={`Professional-grade ${format.toUpperCase()} compressor. Reduce file size of your ${format.toUpperCase()} images without losing quality.`}
        url={`https://safetools.space/image/compress/${slug}`}
        howTo={howToData}
      />
      <CompressorStudioClient 
        defaultFormat={format === "jpeg" ? "jpeg" : (format === "original" ? undefined : format)} 
      />
    </>
  );
}
