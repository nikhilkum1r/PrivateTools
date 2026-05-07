import { Metadata } from "next";
import ImageToPptxClient from "./ImageToPptxClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Convert Images to PowerPoint (PPTX) Online - Free | SafeTools",
  description: "Transform your photos and images into professional PowerPoint presentations instantly. Create slides from JPG, PNG, and more with zero server uploads and 100% privacy.",
  keywords: ["convert image to pptx", "photos to powerpoint", "image to slides converter", "private pptx maker", "online presentation builder", "browser based pptx synthesis"],
  openGraph: {
    title: "SafeTools Deck Studio | Professional Presentation Synthesis",
    description: "Transform your media assets into professional PPTX decks securely in your browser. Powerful, private, and precise.",
    type: "website",
    url: "https://safetools.space/image/to-pptx",
  },
};

export default function ImageToPptxPage() {
  return (
    <>
      <SEOStructuredData 
        name="Image to PPTX Converter"
        description="Transform media assets into professional PowerPoint presentations instantly. Create slides securely in your browser with zero server uploads."
        url="https://safetools.space/image/to-pptx"
      />
      <ImageToPptxClient />
    </>
  );
}
