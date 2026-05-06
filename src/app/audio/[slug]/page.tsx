import { Metadata } from "next";
import { notFound } from "next/navigation";
import AudioStudioClient from "../AudioStudioClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const COMMON_SLUGS = [
  "compress-mp3", "convert-wav-to-mp3", "audio-mastering-online", "edit-mp3-tags",
  "convert-audio-to-aac", "high-fidelity-audio-conversion"
];

export async function generateStaticParams() {
  return COMMON_SLUGS.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  
  return {
    title: `${title} - Free, Private & Pro | PrivateTools`,
    description: `High-fidelity ${title} utility. Browser-based execution for maximum privacy. Secure ID3 tagging and audio mastering.`,
    keywords: [slug.replace(/-/g, " "), "private audio processor", "local audio tools", "wasm audio engine"],
    openGraph: {
      title: `${title} | PrivateTools Studio`,
      description: `Studio-grade ${title} laboratory.`,
      type: "website",
    }
  };
}

export default async function AudioSEOPage({ params }: PageProps) {
  const { slug } = await params;
  if (!COMMON_SLUGS.includes(slug)) notFound();
  return <AudioStudioClient />;
}
