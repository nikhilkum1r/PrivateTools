import BlogClient from "./BlogClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Safe Journal | Privacy-First Technology & Engineering Blog",
  description: "Deep dives into WebAssembly, local-first computing, and digital security. Read the latest insights from the SafeTools engineering team.",
  keywords: "privacy blog, tech journal, webassembly articles, local-first computing guide, secure software engineering",
};

export default function BlogPage() {
  return <BlogClient />;
}
