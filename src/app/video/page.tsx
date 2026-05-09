import { Metadata } from "next";
import VideoStudioClient from "./VideoStudioClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Online Video Compressor & Converter - Free & Private | SafeTools",
  description: "High-performance, browser-based video transcoding and frame extraction. Convert MP4, WebM, and more with absolute privacy. No server uploads, powered by WASM.",
  keywords: ["video converter", "mp4 converter", "webm converter", "video compressor", "reduce video size", "frame extractor", "private video tools", "ffmpeg browser"],
  openGraph: {
    title: "SafeTools Video Studio | Professional Local Transcoding",
    description: "Compress and convert video files securely in your browser. Powered by high-speed FFmpeg WASM.",
    type: "website",
    url: "https://safetools.space/video",
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Video Compressor & Converter - Free & Private | SafeTools",
    description: "High-performance, browser-based video transcoding and frame extraction. Convert MP4, WebM, and more with absolute privacy. No server uploads, powered by WASM.",
    images: ["/og-image.webp"],
  },
  alternates: { canonical: "/video" },
};

export default function VideoPage() {
  return (
    <>
      <SEOStructuredData 
        name="Video Compressor & Converter"
        description="High-performance, browser-based video transcoding directly in your browser. zero server uploads."
        url="https://safetools.space/video"
      />
      <VideoStudioClient />
    </>
  );
}
