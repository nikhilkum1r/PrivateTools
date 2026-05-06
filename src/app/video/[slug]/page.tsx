import { Metadata } from "next";
import { notFound } from "next/navigation";
import VideoStudioClient from "../VideoStudioClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const COMMON_SLUGS = [
  "compress-mp4", "compress-video", "convert-video-to-webm", "convert-video-to-mp4",
  "extract-frames-from-video", "mute-video-online", "resize-video-720p"
];

export async function generateStaticParams() {
  return COMMON_SLUGS.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  
  return {
    title: `${title} - Free, Private & Pro | PrivateTools`,
    description: `Professional-grade ${title} utility. Browser-based execution for maximum privacy and performance. Zero server uploads.`,
    keywords: [slug.replace(/-/g, " "), "private video editor", "local video processing", "wasm video engine"],
    openGraph: {
      title: `${title} | PrivateTools Studio`,
      description: `Secure, local-first ${title} laboratory.`,
      type: "website",
    }
  };
}

export default async function VideoSEOPage({ params }: PageProps) {
  const { slug } = await params;
  if (!COMMON_SLUGS.includes(slug)) notFound();
  return <VideoStudioClient />;
}
