import { Metadata } from "next";
import { Suspense } from "react";
import { locales } from "@/config/locales";
import VideoStudioClient from "./VideoStudioClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";
import StudioSkeleton from "@/components/shared/StudioSkeleton";
import { getTranslations } from "next-intl/server";


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("videoStudio.seo");
  
  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords").split(", "),
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      type: "website",
      url: `https://safetools.space/${locale}/video`,
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/og-image.webp"],
    },
    alternates: { 
      canonical: `/${locale}/video`,
      languages: Object.fromEntries(locales.map(l => [l, `/${l}/video`]))
    },
  };
}

export default async function VideoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t_common = await getTranslations({ locale, namespace: "common" });
  return (
    <>
      <SEOStructuredData 
      browserRequirements={t_common("seo.browserReqs")} 
        name="Video Compressor & Converter"
        description="High-performance, browser-based video transcoding directly in your browser. zero server uploads."
        url={`https://safetools.space/${locale}/video`}
      />
      <Suspense fallback={<StudioSkeleton />}>
        <VideoStudioClient />
      </Suspense>
    </>
  );
}
