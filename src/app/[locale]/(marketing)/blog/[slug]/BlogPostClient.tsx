"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowLeft, Clock, Tag, Share2 } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdUnit } from "@/components/shared/AdUnit";
import { ShareTool } from "@/components/shared/ShareTool";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
}

export default function BlogPostClient({ post }: { post: BlogPost }) {
  const t = useTranslations("blog");

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main id="main-content" className="flex-grow">
        {/* Hero */}
        <section className="relative pt-36 pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.08),transparent_50%)]" />
          <div className="container mx-auto px-6 relative z-10 max-w-3xl space-y-6">
            <Link href="/blog">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground -ml-3">
                <ArrowLeft className="w-4 h-4" /> {t("backToBlog")}
              </Button>
            </Link>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <Badge variant="outline" className="rounded-full border-primary/20 text-primary font-semibold text-[10px] uppercase tracking-wider px-3 py-1">
                {post.category}
              </Badge>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3 h-3" /> {post.readTime}
              </span>
              <span>{post.date}</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
              {post.title}
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {post.excerpt}
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container mx-auto px-6 max-w-3xl">
            <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-relaxed prose-a:text-primary">
              <p className="text-lg leading-relaxed text-muted-foreground">
                {post.excerpt}
              </p>

              <div className="my-12 p-8 rounded-2xl bg-secondary/30 border border-border/50 space-y-4">
                <h3 className="text-xl font-bold tracking-tight">Key Takeaways</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">All file processing happens locally in your browser  no server uploads required.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">WebAssembly enables near-native performance for complex operations like image processing and PDF manipulation.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">Privacy-first architecture eliminates data breach risk by design, not just by policy.</span>
                  </li>
                </ul>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                The local-first approach represents a fundamental shift in how web applications handle sensitive data. Rather than trusting third-party servers with your files, SafeTools processes everything using browser-native APIs, WebAssembly modules, and client-side AI models.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                This architecture means your documents, images, and personal files never leave your device. The processing pipeline runs entirely within your browser&apos;s sandbox, providing the same level of privacy as a desktop application while maintaining the convenience of a web tool.
              </p>
            </div>

            {/* Ad placement */}
            <div className="my-12">
              <AdUnit type="in-article" />
            </div>

            {/* Share section */}
            <div className="mt-16">
              <ShareTool title={post.title} />
            </div>

            {/* Related posts */}
            <div className="mt-16 pt-12 border-t border-border/50 space-y-8">
              <h3 className="text-xl font-bold tracking-tight">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/blog" className="group p-6 rounded-2xl bg-secondary/20 border border-border/50 hover:border-primary/20 transition-all space-y-3">
                  <Badge variant="outline" className="text-[10px] font-semibold uppercase tracking-wider border-primary/20 text-primary">Technology</Badge>
                  <h4 className="font-bold tracking-tight group-hover:text-primary transition-colors">Explore More Articles</h4>
                  <p className="text-sm text-muted-foreground">Discover more insights about privacy, security, and local-first technology.</p>
                </Link>
                <Link href="/tools" className="group p-6 rounded-2xl bg-secondary/20 border border-border/50 hover:border-primary/20 transition-all space-y-3">
                  <Badge variant="outline" className="text-[10px] font-semibold uppercase tracking-wider border-primary/20 text-primary">Tools</Badge>
                  <h4 className="font-bold tracking-tight group-hover:text-primary transition-colors">Try SafeTools</h4>
                  <p className="text-sm text-muted-foreground">Experience the privacy-first approach with our suite of browser-based tools.</p>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
