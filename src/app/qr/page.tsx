import { Metadata } from "next";
import QRStudioClient from "./QRStudioClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "QR Code Generator - Create Custom QR Codes Online | SafeTools",
  description: "Generate professional QR codes for URLs, WiFi, Contacts, and Text. Customize colors, add logos, and export as PNG or SVG. 100% private, browser-based synthesis.",
  keywords: ["qr code generator", "create qr code online", "custom qr code with logo", "wifi qr code generator", "svg qr code creator", "private qr generator"],
  openGraph: {
    title: "SafeTools QR Studio | Professional Identity Matrix",
    description: "Synthesize high-fidelity QR codes instantly. Secure, private, and customizable.",
    type: "website",
    url: "https://safetools.space/qr",
  },
};

export default function QRGeneratorPage() {
  return (
    <>
      <SEOStructuredData 
        name="QR Code Generator"
        description="High-fidelity QR code synthesis directly in your browser. Customize colors, add logos, and export vectors locally."
        url="https://safetools.space/qr"
      />
      <QRStudioClient />
    </>
  );
}
