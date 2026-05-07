import type { Metadata } from "next";
import CompressPdfClient from "./CompressPdfClient";

export const metadata: Metadata = {
  title: "Compress PDF - Reduce PDF File Size Online for Free",
  description: "Reduce your PDF file size while maintaining document quality. Free, fast, and 100% private PDF compression that runs entirely in your browser.",
};

export default function CompressPdfPage() {
  return <CompressPdfClient />;
}
