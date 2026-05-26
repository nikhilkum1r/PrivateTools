import { Metadata } from "next";
import { locales } from "@/config/locales";
import ConversionStudioClient from "../ConversionStudioClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

import { SUPPORTED_CONVERSION_SLUGS } from "@/config/seo-routes";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  
  if (!SUPPORTED_CONVERSION_SLUGS.includes(slug)) return {};

  const [from, to] = slug.split("-to-");
  const t = await getTranslations({ locale, namespace: "imageConverter.hero" });
  const t_common = await getTranslations({ locale, namespace: "common" });
  
  const title = t("titleSpecific", { from: from.toUpperCase(), to: to.toUpperCase() }).replace(/<span>|<\/span>/g, "");
  const description = t("descriptionSpecific", { from: from.toUpperCase(), to: to.toUpperCase() });

  const ogImageUrl = `https://safetools.space/api/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent('100% Free & Offline In-Browser Processing')}`;

  return {
    title: `${title} | SafeTools`,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://safetools.space/${locale}/image/convert/${slug}`,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
    alternates: { 
      canonical: `/${locale}/image/convert/${slug}`,
      languages: Object.fromEntries(locales.map(l => [l, `/${l}/image/convert/${slug}`]))
    },
  };
}

export default async function SpecificConverterPage({ params }: Props) {
  const { locale } = await params;
  const { slug } = await params;
  if (!SUPPORTED_CONVERSION_SLUGS.includes(slug)) notFound();

  const [from, to] = slug.split("-to-");
  const t = await getTranslations("imageConverter.hero");
  
  const title = t("titleSpecific", { from: from.toUpperCase(), to: to.toUpperCase() }).replace(/<span>|<\/span>/g, "");
  const description = t("descriptionSpecific", { from: from.toUpperCase(), to: to.toUpperCase() });

  const t_common = await getTranslations({ locale, namespace: "common" });

  const howToData = {
    name: `How to convert ${from.toUpperCase()} to ${to.toUpperCase()} for free`,
    description: `A fast and secure way to convert ${from.toUpperCase()} images into ${to.toUpperCase()} without server uploads.`,
    step: [
      {
        name: `Upload ${from.toUpperCase()} Image`,
        text: `Drag and drop your ${from.toUpperCase()} files into the browser window.`
      },
      {
        name: `Select ${to.toUpperCase()} Format`,
        text: `Choose ${to.toUpperCase()} as the output format if it isn't automatically selected.`
      },
      {
        name: "Process Client-Side",
        text: "The WASM engine will convert your file instantly in your browser."
      },
      {
        name: "Download the converted file",
        text: `Download the final ${to.toUpperCase()} file to your device.`
      }
    ]
  };

  return (
    <>
      <SEOStructuredData 
      browserRequirements={t_common("seo.browserReqs")} 
        name={title}
        description={description}
        url={`https://safetools.space/image/convert/${slug}`}
        howToSteps={howToData?.step}
      />
      <ConversionStudioClient fromFormat={from} toFormat={to} />
    </>
  );
}
