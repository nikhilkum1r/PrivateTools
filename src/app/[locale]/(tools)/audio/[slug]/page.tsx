import { Metadata } from "next";
import { locales } from "@/config/locales";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import AudioStudioClient from "../AudioStudioClient";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const COMMON_SLUGS = [
  "compress-mp3", "convert-wav-to-mp3", "audio-mastering-online", "edit-mp3-tags",
  "convert-audio-to-aac", "high-fidelity-audio-conversion"
];

export async function generateStaticParams() {
  return COMMON_SLUGS.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!COMMON_SLUGS.includes(slug)) return {};

  const t = await getTranslations({ locale, namespace: "audio" });
  const common = await getTranslations({ locale, namespace: "common" });
  
  const titleBase = slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  
  return {
    title: `${titleBase} - Free, Private & Pro | ${common("brand.name")}`,
    description: `High-fidelity ${titleBase} utility. Browser-based execution for maximum privacy. Secure ID3 tagging and audio mastering.`,
    keywords: [slug.replace(/-/g, " "), "private audio processor", "local audio tools", "wasm audio engine"],
    openGraph: {
      title: `${titleBase} | ${common("brand.name")} ${common("brand.suffix")}`,
      description: `Studio-grade ${titleBase} laboratory.`,
      type: "website",
      url: `https://safetools.space/${locale}/audio/${slug}`,
    },
    alternates: {
      canonical: `/${locale}/audio/${slug}`,
    }
  };
}

export default async function AudioSEOPage({ params }: PageProps) {
  const { locale } = await params;
  const { slug } = await params;
  if (!COMMON_SLUGS.includes(slug)) notFound();
  return <AudioStudioClient />;
}
