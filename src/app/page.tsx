import { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "SafeTools - 150+ Free, Privacy-First Online File Utilities",
  description: "The ultimate privacy-first utility suite. 150+ professional tools for PDF, Images, Video, Audio, and Security. All processing happens locally in your browser with zero server uploads.",
  keywords: ["free online tools", "privacy first utilities", "pdf tools", "image compressor", "video converter", "audio editor", "secure file vault", "wasm tools"],
  openGraph: {
    title: "SafeTools | Universal Private Utility Studio",
    description: "150+ professional-grade tools running entirely in your browser. Fast, free, and 100% private.",
    type: "website",
    url: "https://safetools.space",
  },
};

export default function RootPage() {
  return <HomeClient />;
}
