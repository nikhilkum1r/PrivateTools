import { Metadata } from "next";
import AudioStudioClient from "./AudioStudioClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Online Audio Converter & Mastering - Free & Private | SafeTools",
  description: "Professional audio mastering and conversion in your browser. Convert MP3, WAV, and AAC with absolute privacy and high-fidelity local processing.",
  keywords: ["audio converter", "mp3 converter", "wav converter", "aac converter", "audio mastering online", "id3 tag editor", "private audio tools", "browser audio editor"],
  openGraph: {
    title: "SafeTools Audio Studio | Professional Mastering Engine",
    description: "Convert and master audio files securely in your browser. zero server uploads.",
    type: "website",
    url: "https://safetools.space/audio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Audio Converter & Mastering - Free & Private | SafeTools",
    description: "Professional audio mastering and conversion in your browser. Convert MP3, WAV, and AAC with absolute privacy and high-fidelity local processing.",
    images: ["/og-image.webp"],
  },
  alternates: { canonical: "/audio" },
};

export default function AudioPage() {
  return (
    <>
      <SEOStructuredData 
        name="Audio Converter & Mastering"
        description="Professional-grade audio conversion and mastering directly in your browser. zero server uploads."
        url="https://safetools.space/audio"
      />
      <AudioStudioClient />
    </>
  );
}
