import { Metadata } from "next";
import { locales } from "@/config/locales";
import EditorStudioClient from "../EditorStudioClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
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
    url: `https://safetools.space/${locale}/image/editor/go`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Creative Studio | Pro Image Editor",
    description: "Advanced browser-based image editing studio. Edit your photos with professional tools in a secure, isolated environment.",
    images: ["/og-image.webp"],
  },
  alternates: { 
      canonical: `/${locale}/image/editor/go`,
      languages: Object.fromEntries(locales.map(l => [l, `/${l}/image/editor/go`]))
    },
};
}

export default async function EditorStudioGoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <EditorStudioClient mode="studio" />;
}
