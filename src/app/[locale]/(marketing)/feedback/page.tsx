import FeedbackClient from "./FeedbackClient";
import { Metadata } from "next";
import { locales } from "@/config/locales";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
  title: "Feedback | Help Us Build SafeTools",
  description: "Share your experience with SafeTools. Your feedback drives our local-first roadmap. Tell us what features you want to see next.",
  keywords: "feedback safetools, feature requests, user experience survey, privacy tools roadmap, community feedback",
  openGraph: {
    title: "Feedback | Help Us Build SafeTools",
    description: "Share your experience with SafeTools. Your feedback drives our local-first roadmap. Tell us what features you want to see next.",
    type: "website",
    url: `https://safetools.space/${locale}/feedback`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Feedback | Help Us Build SafeTools",
    description: "Share your experience with SafeTools. Your feedback drives our local-first roadmap. Tell us what features you want to see next.",
    images: ["/og-image.webp"],
  },
  alternates: { 
      canonical: `/${locale}/feedback`,
      languages: Object.fromEntries(locales.map(l => [l, `/${l}/feedback`]))
    },
};
}

export default async function FeedbackPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <FeedbackClient />;
}
