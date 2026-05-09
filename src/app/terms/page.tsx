import TermsClient from "./TermsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Local-First Sovereign Covenant | SafeTools",
  description: "Read our service covenant. Understand your rights to data sovereignty, local-first execution, and our commitment to zero-server processing architecture.",
  keywords: "terms of service, data sovereignty, local first agreement, privacy software legal, zero server terms",
};

export default function TermsPage() {
  return <TermsClient />;
}
