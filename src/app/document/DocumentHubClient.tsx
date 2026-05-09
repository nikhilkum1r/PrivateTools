"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, FileInput, FileOutput, AlignLeft, ArrowRight, Zap } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { PrivacyBadge } from "@/components/shared/PrivacyBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const TOOLS = [
  {
    name: "Word to PDF Converter",
    icon: FileOutput,
    href: "/document/word-to-pdf",
    desc: "Convert .docx Word documents to PDF instantly in your browser.",
    tags: ["DOCX", "PDF"],
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    name: "PDF to Text Extractor",
    icon: FileInput,
    href: "/document/pdf-to-txt",
    desc: "Extract all text content from PDF files with paragraph structure preserved.",
    tags: ["PDF", "TXT"],
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    name: "Text Utilities",
    icon: AlignLeft,
    href: "/document/text-tools",
    desc: "Word count, case conversion, deduplication, Base64/URL encoding, and more.",
    tags: ["TXT", "Utility"],
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    name: "Compress PDF",
    icon: Zap,
    href: "/pdf/compress-pdf",
    desc: "Reduce PDF file size while maintaining document quality.",
    tags: ["PDF", "Optimization"],
    color: "text-orange-600",
    bg: "bg-orange-600/10",
  },
];

export default function DocumentHubClient() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-xl font-black tracking-tight">Document Tools</h1>
              <p className="text-muted-foreground mt-3 text-lg max-w-xl mx-auto">
                Convert, extract, and transform documents — all processed locally in your browser.
              </p>
            </div>
            <PrivacyBadge />
          </div>

          {/* Tool cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {TOOLS.map((tool, i) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Card className="h-full p-6 flex flex-col justify-between hover:border-primary/20 transition-all duration-300">
                  <div className="space-y-4">
                    <div className={`w-12 h-12 rounded-xl ${tool.bg} flex items-center justify-center`}>
                      <tool.icon className={`w-6 h-6 ${tool.color}`} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black">{tool.name}</h2>
                      <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{tool.desc}</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {tool.tags.map((t) => (
                        <Badge key={t} variant="secondary" className="text-[10px] font-black uppercase">{t}</Badge>
                      ))}
                    </div>
                  </div>
                  <Link href={tool.href} className="mt-6">
                    <Button variant="outline" className="w-full gap-2 rounded-xl hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
                      Open Tool <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
