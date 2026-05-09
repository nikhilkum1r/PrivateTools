import PricingClient from "./PricingClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SafeTools Pricing | Free Forever Privacy Tools",
  description: "SafeTools is 100% free for everyone. Access 150+ professional file tools with no subscriptions, no accounts, and no limits. Support the mission optionally.",
  keywords: "free online tools, no subscription privacy tools, unlimited file converter, open source tools, support privacy software",
};

export default function PricingPage() {
  return <PricingClient />;
}
