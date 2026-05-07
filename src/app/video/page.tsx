import { Metadata } from "next";
import VideoStudioClient from "./VideoStudioClient";

export const metadata: Metadata = {
  title: "Video Studio - Pro-Grade Local Transcoding | SafeTools",
  description: "High-performance, browser-based video transcoding and frame extraction. Convert MP4, WebM, and more with absolute privacy. No server uploads, powered by WASM.",
  keywords: ["video converter", "mp4 converter", "webm converter", "video compressor", "frame extractor", "private video tools"],
};

export default function VideoPage() {
  return <VideoStudioClient />;
}
