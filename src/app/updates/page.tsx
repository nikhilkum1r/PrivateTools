import UpdatesClient from "./UpdatesClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Latest Updates & News | SafeTools Product Feed",
  description: "Stay informed about the latest features, architectural breakthroughs, and security updates from SafeTools. The home for privacy-first product announcements.",
  keywords: "safetools updates, product news, privacy tools blog, latest software features, zero server announcements",
  openGraph: {
    title: "Latest Updates & News | SafeTools Product Feed",
    description: "Stay informed about the latest features, architectural breakthroughs, and security updates from SafeTools. The home for privacy-first product announcements.",
    type: "website",
    url: "https://safetools.space/updates",
  },
  twitter: {
    card: "summary_large_image",
    title: "Latest Updates & News | SafeTools Product Feed",
    description: "Stay informed about the latest features, architectural breakthroughs, and security updates from SafeTools. The home for privacy-first product announcements.",
    images: ["/og-image.webp"],
  },
  alternates: { canonical: "/updates" },
};

export default function UpdatesPage() {
  return <UpdatesClient />;
}
