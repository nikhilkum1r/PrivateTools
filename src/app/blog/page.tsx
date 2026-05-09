import BlogClient from "./BlogClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Safe Journal | Privacy-First Technology & Engineering Blog",
  description: "Deep dives into WebAssembly, local-first computing, and digital security. Read the latest insights from the SafeTools engineering team.",
  keywords: "privacy blog, tech journal, webassembly articles, local-first computing guide, secure software engineering",
  openGraph: {
    title: "The Safe Journal | Privacy-First Technology & Engineering Blog",
    description: "Deep dives into WebAssembly, local-first computing, and digital security. Read the latest insights from the SafeTools engineering team.",
    type: "website",
    url: "https://safetools.space/blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Safe Journal | Privacy-First Technology & Engineering Blog",
    description: "Deep dives into WebAssembly, local-first computing, and digital security. Read the latest insights from the SafeTools engineering team.",
    images: ["/og-image.webp"],
  },
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return <BlogClient />;
}
