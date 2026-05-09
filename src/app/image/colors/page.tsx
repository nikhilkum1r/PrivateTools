import { Metadata } from "next";
import ColorLabClient from "./ColorLabClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Image Color Picker & Palette Generator Online Free | SafeTools",
  description: "Extract colors from images instantly with our free privacy-first image color picker and palette generator. Generate HEX, RGB, HSL, CMYK, gradients, Tailwind colors, and accessibility-safe palettes online.",
  keywords: [
    "image color picker", "color palette generator", "extract colors from image", "online color picker",
    "HEX color extractor", "RGB color generator", "Tailwind palette generator", "CSS gradient generator",
    "accessibility contrast checker", "free image palette tool", "dominant color extractor",
    "brand color generator", "image color analyzer", "browser based color tool"
  ],
  openGraph: {
    title: "SafeTools Image Color Picker | Professional Palette Generator",
    description: "Extract professional color palettes securely in your browser. Precise, private, and powerful.",
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
