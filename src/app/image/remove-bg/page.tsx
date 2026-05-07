import type { Metadata } from "next";
import RemoveBgClient from "./RemoveBgClient";

export const metadata: Metadata = {
  title: "AI Background Remover - Remove Background from Image Locally",
  description: "Remove image backgrounds instantly with AI. 100% private, browser-based background removal using state-of-the-art RMBG-1.4 model. No uploads required.",
  keywords: ["remove background from image", "ai background remover", "free background remover", "local bg remover", "private photo editor", "no upload background removal"],
};

export default function RemoveBgPage() {
  return <RemoveBgClient />;
}
