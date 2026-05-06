import { Metadata } from "next";
import { notFound } from "next/navigation";
import DevToolsStudioClient from "../DevToolsStudioClient";
import { TOOLS, ToolType } from "@/app/devtools/tools";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return TOOLS.map(t => ({ slug: t.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = TOOLS.find(t => t.id === slug);
  
  if (!tool) return { title: "Developer Tool" };
  
  return {
    title: `${tool.name} - Professional & Private | PrivateTools`,
    description: `${tool.desc}. Fast, browser-based utility with zero server interaction. Secure and high-performance processing for developers.`,
    keywords: [tool.name.toLowerCase(), tool.id, "developer utility", "private devtools", "local-first"],
    openGraph: {
      title: `${tool.name} Studio | PrivateTools`,
      description: tool.desc,
      type: "website",
    }
  };
}

export default async function DevToolSEOPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = TOOLS.find(t => t.id === slug);
  
  if (!tool) notFound();
  
  return <DevToolsStudioClient initialTool={slug as ToolType} />;
}
