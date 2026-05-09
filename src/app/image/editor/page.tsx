import { Metadata } from "next";
import EditorStudioClient from "./EditorStudioClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Free Online Image Editor | Crop, Resize, Compress & Edit Photos",
  description: "Edit images online for free with our privacy-first browser-based image editor. Crop, resize, compress, convert, enhance, remove backgrounds, and optimize photos instantly with no uploads.",
  keywords: [
    "online image editor", "free photo editor", "browser based image editor", 
    "crop image online", "resize image online", "compress images", 
    "image background remover", "AI photo editor", "photo editing tool", 
    "edit pictures online", "image optimizer", "convert image formats", 
    "watermark free editor", "private image editor", "online photoshop alternative"
  ],
  openGraph: {
    title: "Free Online Image Editor | SafeTools",
    description: "Edit photos securely in your browser with zero uploads. Privacy-first online image editor with AI-powered tools.",
    type: "website",
    url: "https://safetools.space/image/editor",
  },
};

export default function ImageEditorPage() {
  return (
    <>
      <SEOStructuredData 
        name="Pro Image Editor"
        description="Professional-grade image editing directly in your browser. Crop, resize, filter, and redact data securely."
        url="https://safetools.space/image/editor"
      />
      <EditorStudioClient mode="landing" />
    </>
  );
}
