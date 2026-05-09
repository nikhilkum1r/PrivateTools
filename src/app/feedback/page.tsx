import FeedbackClient from "./FeedbackClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feedback | Help Us Build SafeTools",
  description: "Share your experience with SafeTools. Your feedback drives our local-first roadmap. Tell us what features you want to see next.",
  keywords: "feedback safetools, feature requests, user experience survey, privacy tools roadmap, community feedback",
  openGraph: {
    title: "Feedback | Help Us Build SafeTools",
    description: "Share your experience with SafeTools. Your feedback drives our local-first roadmap. Tell us what features you want to see next.",
    type: "website",
    url: "https://safetools.space/feedback",
  },
  twitter: {
    card: "summary_large_image",
    title: "Feedback | Help Us Build SafeTools",
    description: "Share your experience with SafeTools. Your feedback drives our local-first roadmap. Tell us what features you want to see next.",
    images: ["/og-image.webp"],
  },
  alternates: { canonical: "/feedback" },
};

export default function FeedbackPage() {
  return <FeedbackClient />;
}
