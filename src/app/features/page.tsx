import FeaturesClient from "./FeaturesClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SafeTools Features | Zero-Server Privacy Infrastructure",
  description: "Explore the advanced privacy architecture of SafeTools. Built with WebAssembly, client-side sandboxing, and zero-server processing for maximum security.",
  keywords: "privacy tools, client-side processing, webassembly, secure file tools, no-upload converter",
};

export default function FeaturesPage() {
  return <FeaturesClient />;
}
