"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  FileText, 
  Files, 
  Scissors, 
  ArrowRight,
  ShieldCheck,
  Sparkles,
  FileSearch,
  Lock,
  Unlock
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const docTools = [
  {
    title: "Merge PDFs",
    desc: "Combine multiple PDFs and images into a single professional document in seconds.",
    icon: Files,
    href: "/pdf/merge",
    color: "from-red-500 to-orange-500",
    tags: ["Productivity", "Fast"]
  },
  {
    title: "Split PDF Pages",
    desc: "Extract specific pages or ranges from large documents. Precision slicing logic.",
    icon: Scissors,
    href: "/pdf/split",
    color: "from-blue-500 to-indigo-500",
    tags: ["Precision", "New"]
  },
  {
    title: "Unlock PDF",
    desc: "Remove passwords and security restrictions from your PDF files locally.",
    icon: Unlock,
    href: "/pdf/unlock",
    color: "from-blue-600 to-indigo-700",
    tags: ["Security", "Decryption"]
  },
  {
    title: "Lock PDF",
    desc: "Add strong password protection and encryption to your PDF files locally.",
    icon: Lock,
    href: "/pdf/lock",
    color: "from-indigo-600 to-blue-700",
    tags: ["Security", "Encryption"]
  },
  {
    title: "Metadata & EXIF Remover",
    desc: "Remove authors, creators, and hidden metadata from sensitive PDF documents.",
    icon: Lock,
    href: "/privacy/metadata",
    color: "from-green-500 to-emerald-500",
    tags: ["Privacy", "Essential"]
  }
];

export default function PDFHubClient() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto space-y-16">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold"
            >
              <FileSearch className="w-4 h-4" />
              Professional Document Suite
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-black tracking-tight"
            >
              Document <span className="text-primary italic">Powerhouse</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium"
            >
              Secure, local PDF and document tools. No data ever leaves your device.
            </motion.p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {docTools.map((tool, i) => (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.2 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <Link href={tool.href}>
                  <Card className="h-full p-8 flex flex-col justify-between border-primary/5 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 bg-card/50 backdrop-blur-sm relative overflow-hidden">
                    <div className={cn("absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-5 blur-3xl -mr-16 -mt-16 group-hover:opacity-10 transition-opacity", tool.color)} />
                    
                    <div className="space-y-6 relative z-10">
                      <div className={cn("w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center text-foreground shadow-lg group-hover:scale-110 transition-transform duration-500", tool.color)}>
                        <tool.icon className="w-8 h-8" />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {tool.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-[9px] uppercase tracking-widest font-black px-2 py-0">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <h3 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">{tool.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {tool.desc}
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 flex items-center gap-2 text-primary font-bold text-sm">
                      Open Tool
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Feature List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12">
            <div className="space-y-4">
              <h4 className="text-xl font-bold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                Zero-Knowledge Processing
              </h4>
              <p className="text-muted-foreground text-sm">
                Unlike online PDF tools, we never see your documents. Our specialized WASM engine performs all surgery directly on your device's memory.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                High Fidelity Results
              </h4>
              <p className="text-muted-foreground text-sm">
                We maintain vector quality and original resolution. Whether you're merging 100 images or splitting a 1GB manual, the output is perfect.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
