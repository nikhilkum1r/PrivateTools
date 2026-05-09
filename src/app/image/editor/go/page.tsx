import { Metadata } from "next";
import EditorStudioClient from "../EditorStudioClient";

export const metadata: Metadata = {
  title: "Creative Studio | Pro Image Editor",
  description: "Advanced browser-based image editing studio. Edit your photos with professional tools in a secure, isolated environment.",
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Creative Studio | Pro Image Editor",
    description: "Advanced browser-based image editing studio. Edit your photos with professional tools in a secure, isolated environment.",
    type: "website",
    url: "https://safetools.space/image/editor/go",
  },
  twitter: {
    card: "summary_large_image",
    title: "Creative Studio | Pro Image Editor",
    description: "Advanced browser-based image editing studio. Edit your photos with professional tools in a secure, isolated environment.",
    images: ["/og-image.webp"],
  },
  alternates: { canonical: "/image/editor/go" },
};

export default function EditorStudioGoPage() {
  return <EditorStudioClient mode="studio" />;
}
