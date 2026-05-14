import { Metadata } from "next";
import { locales } from "@/config/locales";
import { notFound } from "next/navigation";
import VideoStudioClient from "../VideoStudioClient";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const COMMON_SLUGS = [
  "compress-mp4", "compress-video", "convert-video-to-webm", "convert-video-to-mp4",
  "extract-frames-from-video", "mute-video-online", "resize-video-720p"
];

export async function generateStaticParams() {
  return COMMON_SLUGS.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const { slug } = await params;
  const title = slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  
  return {
    title: `${title} - Free, Private & Pro | SafeTools`,
    description: `Professional-grade ${title} utility. Browser-based execution for maximum privacy and performance. Zero server uploads.`,
    keywords: [slug.replace(/-/g, " "), "private video editor", "local video processing", "wasm video engine"],
    openGraph: {
      title: `${title} | SafeTools Studio`,
      description: `Secure, local-first ${title} laboratory.`,
      type: "website",
    },
    alternates: {
      canonical: `/video/${slug}`,
    }
  };
}

export default async function VideoSEOPage({ params }: PageProps) {
  const { locale } = await params;
  const { slug } = await params;
  if (!COMMON_SLUGS.includes(slug)) notFound();
  return <VideoStudioClient />;
}
