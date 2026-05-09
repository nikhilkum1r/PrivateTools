import DevelopersClient from "./DevelopersClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SafeTools for Developers | Local-First Processing Engine",
  description: "Learn how to build and contribute to SafeTools. Explore our local-first WebAssembly architecture, client-side AI integration, and privacy-preserving developer utilities.",
  keywords: "developer tools, webassembly api, client-side processing, privacy architecture, open source security tools",
};

export default function DevelopersPage() {
  return <DevelopersClient />;
}
