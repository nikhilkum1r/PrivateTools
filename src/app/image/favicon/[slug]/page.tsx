import { Metadata } from "next";
import { notFound } from "next/navigation";
import IconStudioClient from "../IconStudioClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const SUPPORTED_SLUGS = [
  "png-to-ico", 
  "svg-to-favicon", 
  "generate-android-icons", 
  "ios-icon-generator", 
  "convert-image-to-favicon", 
  "pwa-icon-architect"
];

export async function generateStaticParams() {
  return SUPPORTED_SLUGS.map(slug => ({
    slug
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  const titleMap: Record<string, string> = {
    "png-to-ico": "Convert PNG to ICO - Free Favicon Generator",
    "svg-to-favicon": "SVG to Favicon Converter - High Quality",
    "generate-android-icons": "Generate Android App Icons (MDPI to XXXHDPI)",
    "ios-icon-generator": "iOS App Icon Generator - iOS 17 Compatible",
    "convert-image-to-favicon": "Convert Any Image to Favicon Online",
    "pwa-icon-architect": "PWA Icon Generator & Manifest Creator"
  };

  const title = titleMap[slug] || "Icon & Favicon Generator";
  const displayTitle = slug.replace(/-/g, " ").toUpperCase();
  
  return {
    title: `${title} | PrivateTools`,
    description: `Professional-grade ${displayTitle} tool. Generate 16x16, 32x32 favicons, iOS icons, and Android launcher icons locally in your browser. 100% private.`,
    keywords: [slug.replace(/-/g, " "), "favicon generator", "app icon creator", "pwa icon generator", "private tools icon"],
    openGraph: {
      title: `${title} | PrivateTools Studio`,
      description: `Generate production-ready icons and favicons directly in your browser.`,
      type: "website",
    }
  };
}

export default async function FaviconSEOPage({ params }: PageProps) {
  const { slug } = await params;
  
  if (!SUPPORTED_SLUGS.includes(slug)) {
    notFound();
  }
  
  const displayTitle = slug.replace(/-/g, " ");
  
  return (
    <IconStudioClient 
      defaultTitle={displayTitle}
    />
  );
}
