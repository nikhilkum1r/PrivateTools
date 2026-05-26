import { Metadata } from "next";
import { locales } from "@/config/locales";
import { getTranslations } from "next-intl/server";
import AudioStudioClient from "./AudioStudioClient";
import { ClientOnly } from "@/components/shared/ClientOnly";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "audio" });
  const t_common = await getTranslations({ locale, namespace: "common" });
  
  return {
    title: t("seo.title"),
    description: t("seo.description"),
    keywords: ["audio converter", "mp3 converter", "wav converter", "aac converter", "audio mastering online", "id3 tag editor", "private audio tools", "browser audio editor"],
    openGraph: {
      title: t("seo.title"),
      description: t("seo.description"),
      type: "website",
      url: `https://safetools.space/${locale}/audio`,
    },
    twitter: {
      card: "summary_large_image",
      title: t("seo.title"),
      description: t("seo.description"),
      images: ["/og-image.webp"],
    },
    alternates: { 
      canonical: `/${locale}/audio`,
      languages: Object.fromEntries(locales.map(l => [l, `/${l}/audio`]))
    },
  };
}

export default async function AudioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "audio" });
  const common = await getTranslations({ locale, namespace: "common" });

  const t_common = await getTranslations({ locale, namespace: "common" });
  return (
    <>
      <SEOStructuredData 
      browserRequirements={t_common("seo.browserReqs")} 
        name={t("seo.title")}
        description={t("seo.description")}
        url={`https://safetools.space/${locale}/audio`}
        breadcrumbs={[
          { name: common("home"), item: `https://safetools.space/${locale}` },
          { name: t("hero.title").replace(/<[^>]*>?/gm, ''), item: `https://safetools.space/${locale}/audio` }
        ]}

        howTo={{
          name: t("seo.title"),
          description: t("seo.description"),
          step: (Array.isArray(t.raw("landing.educational.how_it_works.steps")) ? t.raw("landing.educational.how_it_works.steps") as string[] : []).map((step: string) => ({
            name: step.split('.')[0] || "Step",
            text: step
          }))
        }}
      />
      <ClientOnly>
        <AudioStudioClient />
      </ClientOnly>
    </>
  );
}
