"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Minimize2, 
  RefreshCw, 
  Settings2, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  Sparkles,
  Cpu,
  Smartphone,
  Eye,
  Lock,
  DownloadCloud,
  Search,
  ScanText,
  Palette,
  Info,
  Presentation
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const imageTools = [
  {
    title: "Ultra Compressor",
    desc: "Reduce file size up to 90% with zero visible quality loss. Bulk optimization for web performance.",
    icon: Minimize2,
    href: "/image/compress",
    color: "from-blue-500 to-cyan-500",
    tags: ["Most Popular", "High Speed"]
  },
  {
    title: "Format Converter",
    desc: "Convert between 150+ formats including HEIC, AVIF, WebP, and PDF in batch mode.",
    icon: RefreshCw,
    href: "/image/convert",
    color: "from-purple-500 to-pink-500",
    tags: ["Universal", "150+ Formats"]
  },
  {
    title: "Ultimate Editor",
    desc: "The full powerhouse: Resize, crop, rotate, watermark, filters, and high-precision OCR extraction.",
    icon: Settings2,
    href: "/image/editor",
    color: "from-orange-500 to-red-500",
    tags: ["All-in-One", "Pro Features"]
  },
  {
    title: "Color Lab",
    desc: "Extract professional color palettes, identify hex codes, and analyze dominant shades from any image.",
    icon: Palette,
    href: "/image/colors",
    color: "from-emerald-500 to-teal-500",
    tags: ["Design Tool", "WASM Powered"]
  },
  {
    title: "Icon Master",
    desc: "Generate professional-grade favicons, app icons, and progressive web app (PWA) assets in one click.",
    icon: Smartphone,
    href: "/image/favicon",
    color: "from-amber-500 to-orange-500",
    tags: ["Utility", "SEO Optimized"]
  },
  {
    title: "Presentation Lab",
    desc: "Convert your image sequences or screenshots into high-fidelity PowerPoint (PPTX) presentations.",
    icon: Presentation,
    href: "/image/to-pptx",
    color: "from-rose-500 to-orange-500",
    tags: ["Business", "Batch Tool"]
  }
];

export default function ImageHubClient() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Navbar />
      
      <main className="flex-grow relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] bg-primary/10 blur-[140px] rounded-full animate-pulse" />
          <div className="absolute bottom-[10%] right-[5%] w-[40%] h-[40%] bg-blue-500/10 blur-[140px] rounded-full animate-pulse" />
          <div 
            className="absolute inset-0 opacity-[0.4] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" 
            style={{ 
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(var(--foreground-rgb, 255, 255, 255), 0.05) 1px, transparent 0)`,
              backgroundSize: '32px 32px'
            }} 
          />
        </div>

        <div className="container mx-auto px-6 py-20 md:py-32 relative z-10">
          <div className="max-w-6xl mx-auto space-y-24">
            
            <Breadcrumbs />

            {/* Hero Section */}
            <div className="text-center space-y-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em]"
              >
                <Sparkles className="w-4 h-4" />
                Next-Gen Image Processing Matrix
              </motion.div>
              
              <div className="space-y-6">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase italic"
                >
                  Image <span className="text-primary">Powerhouse.</span>
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-muted-foreground text-xl md:text-2xl max-w-3xl mx-auto font-medium leading-relaxed italic"
                >
                  Professional-grade local imaging laboratory. <br className="hidden md:block"/> 
                  100% data sovereignty, zero uploads, hardware-accelerated.
                </motion.p>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <Badge variant="outline" className="px-4 py-2 border-border bg-card/50 backdrop-blur-sm text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <Cpu className="w-3.5 h-3.5 mr-2 text-primary" /> WASM Neural Engine
                </Badge>
                <Badge variant="outline" className="px-4 py-2 border-border bg-card/50 backdrop-blur-sm text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <ShieldCheck className="w-3.5 h-3.5 mr-2 text-emerald-500" /> GPU Acceleration
                </Badge>
              </div>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                    <Card className="h-full p-10 flex flex-col justify-between border-border hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 bg-card/40 backdrop-blur-3xl relative overflow-hidden rounded-[3rem]">
                      <div className={cn("absolute top-0 right-0 w-48 h-48 bg-gradient-to-br opacity-5 blur-[80px] -mr-24 -mt-24 group-hover:opacity-20 transition-opacity", tool.color)} />
                      
                      <div className="space-y-8 relative z-10">
                        <div className={cn("w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-500", tool.color)}>
                          <tool.icon className="w-8 h-8" />
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-2">
                            {tool.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-[8px] uppercase tracking-widest font-black px-2 py-0.5 bg-secondary border-border text-muted-foreground/60">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <h3 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors uppercase text-foreground">{tool.title}</h3>
                          <p className="text-muted-foreground text-sm leading-relaxed font-medium italic">
                            {tool.desc}
                          </p>
                        </div>
                      </div>

                      <div className="mt-10 flex items-center gap-3 text-primary font-black text-[10px] uppercase tracking-[0.2em] italic">
                        Initialize Studio
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* SEO Content: FAQ & Information */}
            <section className="py-24 border-t border-border space-y-24">
              <div className="max-w-4xl mx-auto space-y-20">
                <div className="space-y-6 text-center">
                  <Badge variant="outline" className="py-2 px-6 rounded-full border-primary/30 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
                    Image Expert Knowledge Base
                  </Badge>
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-foreground">Visual Processing <span className="text-primary">Intelligence.</span></h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    {
                      q: "Is it safe to process sensitive documents/images?",
                      a: "Yes. Because SafeTools runs entirely in your browser's memory, your sensitive data (IDs, bank statements, personal photos) never leaves your computer. We provide 'Air-Gapped' security for your visual assets."
                    },
                    {
                      q: "How does the Image Compressor maintain quality?",
                      a: "We use the browser's native Canvas API combined with advanced quantization algorithms (similar to MozJPEG and Libvips) to strip redundant metadata and optimize pixel density without losing perceptible detail."
                    },
                    {
                      q: "Can I convert HEIC or RAW files to JPG?",
                      a: "Absolutely. Our Format Converter utilizes specialized WASM decoders to handle modern Apple (HEIC) and professional camera (RAW) formats, converting them to web-standard WebP or JPEG instantly."
                    },
                    {
                      q: "Does the OCR Tool work on handwriting?",
                      a: "Our OCR engine (powered by Tesseract.js) is optimized for printed text, but it can handle clear handwriting. It works in 100+ languages and extracts text directly from the image buffer in your browser."
                    }
                  ].map((faq, i) => (
                    <div key={i} className="p-10 bg-card/40 backdrop-blur-xl border border-border space-y-4 hover:border-primary/20 transition-all group rounded-[2.5rem]">
                      <h3 className="text-lg font-black uppercase tracking-tight group-hover:text-primary transition-colors flex items-center gap-4 text-foreground">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs">Q</div>
                        {faq.q}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed font-medium pl-12 italic border-l border-border">{faq.a}</p>
                    </div>
                  ))}
                </div>

                {/* Technical Analysis */}
                <div className="p-12 border border-border bg-gradient-to-br from-secondary/30 to-transparent rounded-[3rem] space-y-8">
                  <div className="flex items-center gap-4">
                    <Layers className="w-6 h-6 text-primary" />
                    <h3 className="text-2xl font-black uppercase tracking-tighter italic text-foreground">Client-Side Rendering Architecture</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed font-medium italic">
                    SafeTools leverages the **OffscreenCanvas** and **ImageBitmap** APIs to perform high-frequency image transformations without blocking the main UI thread. 
                    By utilizing **WebGPU** (where available) and **WebAssembly**, we achieve near-native performance for complex filters and batch operations. 
                    This "Edge-at-the-User" model ensures that privacy is not a performance trade-off, but a technical advantage.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-border">
                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">Engine</span>
                      <p className="text-sm font-black text-primary uppercase italic">V8 / WASM</p>
                    </div>
                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">Latency</span>
                      <p className="text-sm font-black text-primary uppercase italic">Sub-10ms</p>
                    </div>
                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">Privacy</span>
                      <p className="text-sm font-black text-primary uppercase italic">Absolute</p>
                    </div>
                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">Batch</span>
                      <p className="text-sm font-black text-primary uppercase italic">Parallel</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Security Banner */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="p-12 rounded-[4rem] border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-primary/5 to-blue-600/5 relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 left-0 p-8 opacity-5">
                 <Lock className="w-32 h-32" />
              </div>
              <div className="flex items-center gap-8 relative z-10">
                <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary shadow-2xl border border-primary/20">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-2xl font-black uppercase tracking-tighter text-foreground italic">Privacy Hardened.</h4>
                  <p className="text-muted-foreground font-medium italic">All processing occurs in local volatile memory. No tracking. No telemetry.</p>
                </div>
              </div>
              <div className="flex -space-x-4 relative z-10">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-background bg-secondary flex items-center justify-center overflow-hidden">
                     <div className="w-full h-full bg-gradient-to-br from-primary/40 to-primary/10" />
                  </div>
                ))}
                <div className="w-12 h-12 rounded-full border-4 border-background bg-primary text-[10px] font-black flex items-center justify-center text-white">
                  +10K
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Structured Data: SoftwareApplication & FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Image Powerhouse",
            "operatingSystem": "Web-based",
            "applicationCategory": "MultimediaApplication",
            "description": "Professional-grade browser-based image toolkit. Bulk compression, conversion, and editing with zero-server privacy.",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "90% Lossless Compression",
              "150+ Format Conversion",
              "Privacy-First Metadata Removal",
              "Local OCR Text Extraction",
              "Batch Image Processing"
            ]
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://safetools.space"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Image Powerhouse",
                "item": "https://safetools.space/image"
              }
            ]
          })
        }}
      />
    </div>
  );
}

