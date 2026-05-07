import { Metadata } from "next";
import EditorStudioClient from "./EditorStudioClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Professional Online Image Editor - Free & Private | SafeTools",
  description: "Edit images online with pro-grade tools. Crop, resize, filter, and mask sensitive data. 100% private, browser-based image editing with zero server uploads.",
  keywords: ["online image editor", "crop image online", "image filter online", "redact sensitive data from image", "private photo editor", "browser image processing"],
  openGraph: {
    title: "SafeTools Pro Studio | Professional Image Engineering",
    description: "Architect your visual assets securely in your browser. Powerful, private, and precise.",
    type: "website",
    url: "https://safetools.space/image/editor",
  },
};

export default function ImageEditorPage() {
  return (
    <>
      <SEOStructuredData 
        name="Pro Image Editor"
        description="Professional-grade image editing directly in your browser. Crop, resize, filter, and redact data securely."
        url="https://safetools.space/image/editor"
      />
      <EditorStudioClient />
    </>
  );
}
