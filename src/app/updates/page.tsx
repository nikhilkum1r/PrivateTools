import UpdatesClient from "./UpdatesClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Latest Updates & News | SafeTools Product Feed",
  description: "Stay informed about the latest features, architectural breakthroughs, and security updates from SafeTools. The home for privacy-first product announcements.",
  keywords: "safetools updates, product news, privacy tools blog, latest software features, zero server announcements",
};

export default function UpdatesPage() {
  return <UpdatesClient />;
}
