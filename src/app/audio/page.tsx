import { Metadata } from "next";
import AudioStudioClient from "./AudioStudioClient";

export const metadata: Metadata = {
  title: "Audio Studio - Studio-Grade Mastering & Conversion | PrivateTools",
  description: "Professional-grade audio mastering and conversion in your browser. Convert MP3, WAV, AAC with absolute privacy. ID3 tag management and high-fidelity local processing.",
  keywords: ["audio converter", "mp3 converter", "wav converter", "audio mastering online", "id3 tag editor", "private audio tools"],
};

export default function AudioPage() {
  return <AudioStudioClient />;
}
