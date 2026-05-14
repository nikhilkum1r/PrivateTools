import { Metadata } from "next";
import { locales } from "@/config/locales";
import { notFound } from "next/navigation";
import IconStudioClient from "../IconStudioClient";
import { getTranslations } from "next-intl/server";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
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
  const { locale, slug } = await params;
  
  const t = await getTranslations({ locale, namespace: "iconStudio" });
  
  if (!SUPPORTED_SLUGS.includes(slug)) {
    return { title: "Not Found" };
  }
  
  // Safe cast since we know the slug is in SUPPORTED_SLUGS and we added them to JSON
  const slugKey = slug as any;
  const title = t(`seo.slugs.${slugKey}.title`) || "Icon & Favicon Generator";
  const description = t(`seo.slugs.${slugKey}.description`) || "Generate production-ready icons and favicons directly in your browser.";
  const displayTitle = slug.replace(/-/g, " ").toUpperCase();
  
  return {
    title: `${title} | SafeTools`,
    description,
    keywords: [slug.replace(/-/g, " "), "favicon generator", "app icon creator", "pwa icon generator", "private tools icon"],
    openGraph: {
      title: `${title} | SafeTools Studio`,
      description,
      type: "website",
    },
    alternates: {
      canonical: `/devtools/icons/${slug}`,
    }
  };
}

export default async function FaviconSEOPage({ params }: PageProps) {
  const { locale } = await params;
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
