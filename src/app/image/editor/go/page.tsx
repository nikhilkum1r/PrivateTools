import { Metadata } from "next";
import EditorStudioClient from "../EditorStudioClient";

export const metadata: Metadata = {
  title: "Creative Studio | Pro Image Editor",
  description: "Advanced browser-based image editing studio. Edit your photos with professional tools in a secure, isolated environment.",
  robots: {
    index: false,
    follow: true,
  }
};

export default function EditorStudioGoPage() {
  return <EditorStudioClient mode="studio" />;
}
