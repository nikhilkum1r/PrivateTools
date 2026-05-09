import ChangelogClient from "./ChangelogClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SafeTools Changelog | Product Updates & Releases",
  description: "Stay up to date with the latest features, improvements, and fixes on SafeTools. Tracking our journey towards the world's most advanced privacy-first utility suite.",
  keywords: "product updates, changelog, new features, privacy tools releases, software version history",
};

export default function ChangelogPage() {
  return <ChangelogClient />;
}
