"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ImageIcon, 
  Minimize2, 
  RefreshCw, 
  Settings2, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  Sparkles
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";

const imageTools = [
  {
    title: "Compress Image (KB/MB)",
    desc: "Reduce file size up to 90% with zero visible quality loss. Bulk optimization for web.",
    icon: Minimize2,
    href: "/image/compress",
    color: "from-blue-500 to-cyan-500",
    tags: ["Most Popular", "High Speed"]
  },
  {
    title: "Convert Image Format",
    desc: "Convert between 10+ formats including HEIC, AVIF, WebP and PDF in batch mode.",
    icon: RefreshCw,
    href: "/image/convert",
    color: "from-purple-500 to-pink-500",
    tags: ["Universal", "10+ Formats"]
  },
  {
    title: "Edit Images",
    desc: "The full powerhouse: Resize, crop, rotate, watermark, filters and OCR extraction.",
    icon: Settings2,
    href: "/image/editor",
    color: "from-orange-500 to-red-500",
    tags: ["All-in-One", "Pro Features"]
  }
];

export default function ImageHubClient() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold"
            >
              <Sparkles className="w-4 h-4" />
              Next-Gen Image Processing
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl md:text-2xl font-black tracking-tight"
            >
              Image <span className="text-primary italic">Powerhouse</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium"
            >
              Professional-grade local image tools. 100% privacy, zero uploads, GPU-accelerated.
            </motion.p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {imageTools.map((tool, i) => (
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
                    <div className={cn("absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-5 blur-3xl -mr-16 -mt-6 group-hover:opacity-10 transition-opacity", tool.color)} />
                    
                    <div className="space-y-6 relative z-10">
                      <div className={cn("w-11 h-11 rounded-2xl bg-gradient-to-br flex items-center justify-center text-foreground shadow-lg group-hover:scale-110 transition-transform duration-500", tool.color)}>
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

          {/* Security Banner */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="premium-glass p-8 rounded-3xl border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold">Privacy Guaranteed</h4>
                <p className="text-sm text-muted-foreground">All processing is done in your browser using WASM. Your images never hit our servers.</p>
              </div>
            </div>
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-secondary flex items-center justify-center overflow-hidden">
                   <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-background bg-primary text-[10px] font-black flex items-center justify-center text-primary-foreground">
                +10k
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
