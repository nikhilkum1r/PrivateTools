import { Metadata } from "next";
import { locales } from "@/config/locales";
import { notFound } from "next/navigation";
import DevToolsStudioClient from "../DevToolsStudioClient";
import { TOOLS, ToolType } from "../tools";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  return TOOLS.map(t => ({ slug: t.id }));
}

import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "devtools" });
  
  const tool = TOOLS.find(t => t.id === slug);
  if (!tool) return { title: "Developer Tool" };
  
  const toolName = t(`tools.${slug}.name`);
  const toolDesc = t(`tools.${slug}.desc`);
  
  return {
    title: `${toolName} - Professional & Private | SafeTools`,
    description: `${toolDesc}. Fast, browser-based utility with zero server interaction. Secure and high-performance processing for developers.`,
    keywords: [toolName.toLowerCase(), slug, "developer utility", "private devtools", "local-first"],
    openGraph: {
      title: `${toolName} Studio | SafeTools`,
      description: toolDesc,
      type: "website",
    },
    alternates: {
      canonical: `/devtools/${slug}`,
    }
  };
}

export default async function DevToolSEOPage({ params }: PageProps) {
  const { locale } = await params;
  const { slug } = await params;
  const tool = TOOLS.find(t => t.id === slug);
  
  if (!tool) notFound();
  
  return <DevToolsStudioClient initialTool={slug as ToolType} />;
}
