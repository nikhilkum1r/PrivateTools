import { Metadata } from "next";
import SteganographyClient from "./SteganographyClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Image Steganography - Hide Text in Images Online | SafeTools",
  description: "Securely hide secret messages inside images using LSB bit-injection. Professional-grade steganography with zero visual trace. 100% private, browser-based encryption.",
  keywords: ["image steganography", "hide text in image online", "lsb steganography online", "secret message in photo", "private steganography tool", "digital watermarking"],
  openGraph: {
    title: "SafeTools Secret Studio | Professional LSB Mutation",
    description: "Vanish classified data inside standard pixels with zero visual trace. Secure, private, and powerful.",
    type: "website",
    url: "https://safetools.space/steganography",
  },
};

export default function SteganographyPage() {
  return (
    <>
      <SEOStructuredData 
        name="Image Steganography"
        description="LSB bit-injection engine. Vanish classified data inside standard PNG pixels with zero visual trace directly in your browser."
        url="https://safetools.space/steganography"
      />
      <SteganographyClient />
    </>
  );
}
