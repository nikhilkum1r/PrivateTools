import FaqClient from "./FaqClient";
import { Metadata } from "next";
import { locales } from "@/config/locales";
import Script from "next/script";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
  title: "Frequently Asked Questions | SafeTools Knowledge Base",
  description: "Get answers to common questions about SafeTools. Learn about our zero-server privacy architecture, local-first processing, and technical security standards.",
  keywords: "privacy tools faq, zero server architecture, local processing help, safetools security, browser based conversion faq",
  openGraph: {
    title: "Frequently Asked Questions | SafeTools Knowledge Base",
    description: "Get answers to common questions about SafeTools. Learn about our zero-server privacy architecture, local-first processing, and technical security standards.",
    type: "website",
    url: `https://safetools.space/${locale}/faq`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions | SafeTools Knowledge Base",
    description: "Get answers to common questions about SafeTools. Learn about our zero-server privacy architecture, local-first processing, and technical security standards.",
    images: ["/og-image.webp"],
  },
  alternates: { 
      canonical: `/${locale}/faq`,
      languages: Object.fromEntries(locales.map(l => [l, `/${l}/faq`]))
    },
};
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Does SafeTools ever see my files?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Never. SafeTools is built on a 'Zero-Server' architecture. All processing happens locally in your browser's RAM using WebAssembly. Your files never leave your machine."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use SafeTools while offline?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Once the page is loaded, you can disconnect your internet and continue using most tools. The processing logic is entirely client-side."
        }
      }
    ]
  };

  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />
      <FaqClient />
    </>
  );
}
