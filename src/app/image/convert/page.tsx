import { Metadata } from "next";
import ConversionStudioClient from "./ConversionStudioClient";

export const metadata: Metadata = {
  title: "Universal Image Converter - Free & Private | SafeTools",
  description: "Securely convert between 150+ image formats directly in your browser. Fast, private, and powerful batch processing.",
  openGraph: {
    title: "Universal Image Converter - Free & Private | SafeTools",
    description: "Securely convert between 150+ image formats directly in your browser. Fast, private, and powerful batch processing.",
    type: "website",
    url: "https://safetools.space/image/convert",
  },
  twitter: {
    card: "summary_large_image",
    title: "Universal Image Converter - Free & Private | SafeTools",
    description: "Securely convert between 150+ image formats directly in your browser. Fast, private, and powerful batch processing.",
    images: ["/og-image.webp"],
  },
  alternates: { canonical: "/image/convert" },
};

export default function UniversalConverterPage() {
  return <ConversionStudioClient />;
}
