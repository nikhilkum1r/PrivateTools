import { Metadata } from "next";
import { Suspense } from "react";
import { locales } from "@/config/locales";
import RemoveBackgroundClient from "./RemoveBackgroundClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";
import StudioSkeleton from "@/components/shared/StudioSkeleton";
import { getTranslations } from "next-intl/server";


interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "backgroundRemover" });
  const t_common = await getTranslations({ locale, namespace: "common" });
  
  return {
    title: t("seo.title"),
    description: t("seo.description"),
    keywords: t("seo.keywords").split(",").map(k => k.trim()),
    openGraph: {
      title: t("seo.title"),
      description: t("seo.description"),
      type: "website",
      url: `https://safetools.space/${locale}/image/remove-background`,
    },
    twitter: {
      card: "summary_large_image",
      title: t("seo.title"),
      description: t("seo.description"),
      images: ["/og-image.webp"],
    },
    alternates: { 
      canonical: `/${locale}/image/remove-background`,
      languages: Object.fromEntries(locales.map(l => [l, `/${l}/image/remove-background`]))
    },
  };
}

export default async function RemoveBackgroundPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "backgroundRemover" });
  const t_common = await getTranslations({ locale, namespace: "common" });

  const howToData = {
    name: "How to Remove Background from an Image Offline",
    description: "Learn how to instantly remove the background from any image directly in your browser without uploading your files.",
    step: [
      {
        name: "Upload Image",
        text: "Drag and drop your image into the dropzone or click to select a file from your device."
      },
      {
        name: "Wait for AI Processing",
        text: "The WASM AI model will automatically detect the subject and remove the background in seconds."
      },
      {
        name: "Refine (Optional)",
        text: "Use the magic eraser or settings to refine the edges if needed."
      },
      {
        name: "Download",
        text: "Click the Download button to save the transparent PNG image securely to your device."
      }
    ]
  };

  return (
    <>
      <SEOStructuredData 
        browserRequirements={t_common("seo.browserReqs")} 
        name={t("seo.title")}
        description={t("seo.description")}
        url={`https://safetools.space/${locale}/image/remove-background`}
        howTo={howToData}
      />
      <Suspense fallback={<StudioSkeleton />}>
        <RemoveBackgroundClient />
      </Suspense>
    </>
  );
}
