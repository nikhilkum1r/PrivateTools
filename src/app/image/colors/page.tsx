import { Metadata } from "next";
import ColorLabClient from "./ColorLabClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Online Color Palette Generator - Extract Colors from Images | SafeTools",
  description: "Extract professional color palettes from any image instantly. Verify accessibility with contrast checks and generate harmonious color schemes. 100% private and browser-based.",
  keywords: ["color palette generator", "extract colors from image", "image color picker", "accessible color palette", "color lab online", "private design tools"],
  openGraph: {
    title: "SafeTools Color Lab | Professional Chromatic Analysis",
    description: "Extract and analyze design palettes securely in your browser. Precise, private, and powerful.",
    type: "website",
    url: "https://safetools.space/image/colors",
  },
};

export default function ColorLabPage() {
  return (
    <>
      <SEOStructuredData 
        name="Color Palette Generator"
        description="Neural chromatic analysis. Extract high-fidelity design palettes and verify accessibility directly in your browser."
        url="https://safetools.space/image/colors"
      />
      <ColorLabClient />
    </>
  );
}
