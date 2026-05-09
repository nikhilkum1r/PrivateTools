import CookiesClient from "./CookiesClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | Zero-Tracking Manifesto | SafeTools",
  description: "Read our cookie policy. Spoiler: We don't use tracking cookies. Learn how SafeTools protects your privacy by eliminating all third-party trackers.",
  keywords: "cookie policy, no cookies, privacy manifesto, tracker free online tools, safetools privacy",
};

export default function CookiesPage() {
  return <CookiesClient />;
}
