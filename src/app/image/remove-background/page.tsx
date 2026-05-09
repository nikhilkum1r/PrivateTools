import { Metadata } from "next";
import RemoveBackgroundClient from "./RemoveBackgroundClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Remove Image Background Online | Free Privacy-First Background Remover",
  description: "Remove image backgrounds securely in your browser with zero uploads and zero tracking. Fast privacy-first AI background remover for photos and graphics.",
  keywords: ["remove background", "background remover", "AI background remover", "transparent background maker", "remove image background", "browser background remover", "local AI image editor", "privacy image tools"],
  openGraph: {
    title: "Remove Image Background Online | Free Privacy-First Background Remover",
    description: "Remove image backgrounds securely in your browser with zero uploads and zero tracking.",
    url: "https://safetools.space/image/remove-background",
  },
};

const BACKGROUND_REMOVER_FAQ = [
  {
    question: "Are images uploaded to servers?",
    answer: "No. Background removal happens locally inside your browser."
  },
  {
    question: "Can I export transparent PNG files?",
    answer: "Yes. Transparent PNG export is fully supported."
  },
  {
    question: "Does this tool work offline?",
    answer: "Yes. Offline support is enabled through PWA functionality once the AI model is cached."
  },
  {
    question: "Can SafeTools access my images?",
    answer: "No. Images remain locally processed and are never stored or transmitted."
  },
  {
    question: "Does AI background removal support high-resolution images?",
    answer: "Yes. Performance depends on your device's memory and browser capabilities."
  }
];

export default function RemoveBackgroundPage() {
  return (
    <>
      <SEOStructuredData
        name="AI Background Remover"
        description="Remove image backgrounds securely in your browser with zero uploads and zero tracking."
        url="https://safetools.space/image/remove-background"
        faqItems={BACKGROUND_REMOVER_FAQ}
      />
      <RemoveBackgroundClient />
    </>
  );
}
