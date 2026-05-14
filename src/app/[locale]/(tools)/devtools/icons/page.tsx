import { Metadata } from "next";
import Script from "next/script";
import { locales } from "@/config/locales";
import dynamic from "next/dynamic";
import { getTranslations } from "next-intl/server";

const IconsLandingClient = dynamic(() => import("./IconsLandingClient"), {
  ssr: true, // We want the skeleton to render, but the interactivity to hydrate
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "iconStudio" });

  return {
    title: t("seo.title"),
    description: t("seo.description"),
    keywords: t("seo.keywords").split(",").map((k: string) => k.trim()),
    openGraph: {
      title: t("seo.title"),
      description: t("seo.description"),
      type: "website",
      url: `https://safetools.space/${locale}/devtools/icons`,
    },
    twitter: {
      card: "summary_large_image",
      title: t("seo.title"),
      description: t("seo.description"),
      images: ["/og-image.webp"],
    },
    alternates: { 
      canonical: `/${locale}/devtools/icons`,
      languages: Object.fromEntries(locales.map(l => [l, `/${l}/devtools/icons`]))
    },
  };
}

const PAGE_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "SafeTools Icon Studio",
      "description": "Professional app icon and favicon generator for web, iOS, and Android platforms.",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "All",
      "url": "https://safetools.space/devtools/icons",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://safetools.space" },
        { "@type": "ListItem", "position": 2, "name": "Image Tools", "item": "https://safetools.space/image" },
        { "@type": "ListItem", "position": 3, "name": "Icon Studio", "item": "https://safetools.space/devtools/icons" }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is the icon generator free?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes. The SafeTools Icon Studio is completely free to use with no account required." }
        },
        {
          "@type": "Question",
          "name": "Are my images uploaded to servers?",
          "acceptedAnswer": { "@type": "Answer", "text": "No. All processing happens locally in your browser using the Canvas API and WebAssembly. Your images never leave your device." }
        },
        {
          "@type": "Question",
          "name": "Can I generate Android and iOS icons?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes. The tool generates full asset bundles for both Android (including adaptive icons) and iOS (Apple Touch icons)." }
        },
        {
          "@type": "Question",
          "name": "Does the tool support SVG icons?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes. SVG export and input are fully supported for scalable branding." }
        },
        {
          "@type": "Question",
          "name": "Can I generate PWA icons?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes. Progressive Web App icons and manifest-ready assets are included in the bundle." }
        }
      ]
    }
  ]
};

export default async function IconStudioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "iconStudio" });
  const t_common = await getTranslations({ locale, namespace: "common" });

  const faqItems = (Array.isArray(t.raw("landing.faq.items")) ? (t.raw("landing.faq.items") as any[]) : []).map(f => ({ q: f.q, a: f.a }));

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": t("seo.title"),
        "description": t("seo.description"),
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "All",
        "url": `https://safetools.space/${locale}/devtools/icons`,
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": t_common("home"), "item": `https://safetools.space/${locale}` },
          { "@type": "ListItem", "position": 2, "name": t_common("imageTools"), "item": `https://safetools.space/${locale}/image` },
          { "@type": "ListItem", "position": 3, "name": t("seo.title"), "item": `https://safetools.space/${locale}/devtools/icons` }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqItems.map(item => ({
          "@type": "Question",
          "name": item.q,
          "acceptedAnswer": { "@type": "Answer", "text": item.a }
        }))
      }
    ]
  };

  return (
    <>
      <Script
        id="icon-studio-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <IconsLandingClient pageSchema={schema} />
    </>
  );
}
