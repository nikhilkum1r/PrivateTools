import { Metadata } from "next";
import AILabClient from "./AILabClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "AI Creative Lab - Local Browser-Based AI Image Tools | SafeTools",
  description: "Experimental AI-powered image tools including Background Remover, AI Upscaler, and Anime Filters. All running locally in your browser with zero privacy risks.",
  keywords: ["ai image tools online", "background remover browser", "ai upscaler online", "private ai tools", "browser based machine learning", "anime filter online"],
  openGraph: {
    title: "SafeTools AI Lab | Experimental Creative Intelligence",
    description: "Experience the next generation of creative tools powered by local AI. Secure, private, and experimental.",
    type: "website",
    url: "https://safetools.space/ai",
  },
};

export default function AILabPage() {
  return (
    <>
      <SEOStructuredData 
        name="AI Creative Lab"
        description="Experimental AI-powered image tools directly in your browser. All running locally with zero privacy risks."
        url="https://safetools.space/ai"
      />
      <AILabClient />
    </>
  );
}
