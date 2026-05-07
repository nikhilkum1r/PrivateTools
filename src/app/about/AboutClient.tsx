"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Cpu, 
  Globe, 
  Zap, 
  Lock, 
  Database,
  CloudOff,
  UserCheck,
  ChevronRight,
  Fingerprint,
  Award,
  BookOpen,
  Verified,
  ShieldAlert,
  List
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AboutClient() {
  const tocItems = [
    { name: "The Manifesto", id: "manifesto" },
    { name: "Trust Signals", id: "trust" },
    { name: "Core Pillars", id: "pillars" },
    { name: "Tech Stack", id: "tech" }
  ];

  const pillars = [
    {
      icon: CloudOff,
      title: "Zero-Server Policy",
      desc: "Your files are never uploaded. We process everything locally in your browser using WebAssembly and Client-side JS. This ensures true data sovereignty.",
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      icon: Database,
      title: "No Data Persistence",
      desc: "Once you close the tab, your session and files are purged from memory. We don't use databases or server-side logs. Your workspace is temporary and secure.",
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
    {
      icon: Fingerprint,
      title: "Identity Protection",
      desc: "No tracking, no analytics, and no fingerprinting. We don't even know you're here—and we like it that way. We prioritize anonymity over metrics.",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    }
  ];

  const technologies = [
    { name: "ffmpeg.wasm", desc: "Professional video & audio encoding in-browser." },
    { name: "pdf-lib", desc: "High-fidelity document manipulation." },
    { name: "ONNX Runtime", desc: "Client-side AI for image upscaling and OCR." },
    { name: "WebAssembly", desc: "Native performance via high-speed binaries." }
  ];

  const trustSignals = [
    { icon: Award, label: "GDPR Compliant", value: "By Architecture" },
    { icon: Verified, label: "Security Verified", value: "Local-Only" },
    { icon: BookOpen, label: "Open Standards", value: "Verified Engines" },
    { icon: ShieldAlert, label: "Threat Model", value: "Zero-Access" }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-y-auto lg:overflow-hidden selection:bg-blue-500/30">
      <Navbar />

      <main className="flex-grow pt-32">
        <div className="container mx-auto px-8 mb-12">
           <Breadcrumbs />
        </div>

        {/* Hero Section */}
        <section id="manifesto" className="relative pb-20 px-4">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 py-2 px-6 rounded-full uppercase tracking-[0.3em] text-[10px] font-black">
                Our Manifesto
              </Badge>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-6xl md:text-8xl font-black tracking-tighter leading-none"
            >
              Privacy is a <br/> <span className="text-blue-500">Human Right.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-muted-foreground text-xl md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed"
            >
              SafeTools was built to bridge the gap between powerful professional utilities and absolute data sovereignty. 
              We believe you shouldn't have to sacrifice your identity for a PDF conversion or video transcode.
            </motion.p>
          </div>
        </section>

        {/* Table of Contents - Mobile Sticky/Floating Desktop */}
        <nav className="sticky top-20 z-50 flex justify-center py-4 px-4 bg-muted/40 backdrop-blur-3xl border-y border-border pointer-events-auto">
           <div className="flex items-center gap-2 md:gap-8 overflow-x-auto no-scrollbar scroll-smooth">
              <div className="hidden md:flex items-center gap-2 text-muted-foreground/50 text-[10px] font-black uppercase tracking-widest mr-4">
                 <List className="w-3.5 h-3.5" /> Contents
              </div>
              {tocItems.map(item => (
                <a 
                  key={item.id} 
                  href={`#${item.id}`} 
                  className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 hover:text-primary transition-colors whitespace-nowrap px-4 py-2 rounded-full border border-transparent hover:border-border"
                >
                  {item.name}
                </a>
              ))}
           </div>
        </nav>

        {/* E-E-A-T Signals */}
        <section id="trust" className="container mx-auto px-4 py-32 border-b border-border bg-white/[0.01]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {trustSignals.map((signal, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center text-blue-400">
                  <signal.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">{signal.label}</p>
                  <p className="text-sm font-black uppercase italic">{signal.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pillars Section */}
        <section id="pillars" className="py-32 px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * i }}
              >
                <Card className="p-10 bg-secondary/30 border-border h-full rounded-[3rem] hover:bg-secondary/50 transition-all group relative overflow-hidden">
                  <div className={`w-16 h-16 rounded-2xl ${pillar.bg} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                    <pillar.icon className={`w-8 h-8 ${pillar.color}`} />
                  </div>
                  <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">{pillar.title}</h3>
                  <p className="text-muted-foreground leading-relaxed font-medium italic">
                    {pillar.desc}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tech Deep Dive */}
        <section id="tech" className="py-32 px-4 relative">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 py-2 px-6 rounded-full uppercase tracking-[0.3em] text-[10px] font-black">
                The Engine
              </Badge>
              <h2 className="text-5xl font-black tracking-tight leading-none">
                Hardware Performance. <br/> <span className="opacity-40 italic">Zero Server Latency.</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                We utilize cutting-edge browser technologies to move processing power from the cloud to your local CPU and GPU. 
                Using WebAssembly (WASM), we run high-performance C++ and Rust binaries directly in your browser's V8 engine. This bypasses the need for server-side APIs and data transit.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {technologies.map(tech => (
                  <div key={tech.name} className="p-4 rounded-2xl bg-white/[0.03] border border-border space-y-1">
                    <div className="text-[11px] font-black uppercase tracking-widest text-emerald-500">{tech.name}</div>
                    <p className="text-[10px] text-muted-foreground/60 font-medium">{tech.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
               <div className="absolute inset-0 bg-blue-500/10 blur-[80px] rounded-full" />
               <Card className="relative p-8 bg-muted/40 border-border backdrop-blur-3xl rounded-[3rem] shadow-2xl overflow-hidden">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <Zap className="w-6 h-6 text-foreground" />
                    </div>
                    <div>
                      <h4 className="font-black uppercase tracking-widest text-[10px] opacity-40">Performance Metrics</h4>
                      <p className="text-sm font-bold">Local Computing Engine v4.0</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                     {[
                       { label: "Data Leak Risk", value: "0%", color: "bg-emerald-500" },
                       { label: "Processing Speed", value: "Native", color: "bg-blue-500" },
                       { label: "Cloud Dependency", value: "None", color: "bg-purple-500" }
                     ].map(stat => (
                       <div key={stat.label} className="space-y-2">
                         <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                           <span>{stat.label}</span>
                           <span>{stat.value}</span>
                         </div>
                         <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: "100%" }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className={`h-full ${stat.color}`} 
                            />
                         </div>
                       </div>
                     ))}
                  </div>
               </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-40 px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-12 bg-gradient-to-br from-blue-600 to-blue-800 p-20 rounded-[4rem] shadow-2xl shadow-blue-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-20 opacity-10 rotate-12 scale-150">
              <ShieldCheck className="w-64 h-64" />
            </div>
            
            <div className="relative z-10 space-y-6">
              <h2 className="text-5xl font-black tracking-tight leading-none">Ready to take control?</h2>
              <p className="text-foreground/80 text-xl font-medium max-w-xl mx-auto">
                Explore our full suite of professional utilities and experience the power of private, localized file processing.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6 pt-8">
                <Link href="/" className={cn(buttonVariants({ size: "lg" }), "h-16 px-12 rounded-2xl bg-white text-blue-600 hover:bg-white/90 font-black text-lg gap-3")}>
                  Get Started <ChevronRight className="w-5 h-5" />
                </Link>

              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "About SafeTools",
            "description": "The mission and manifesto of SafeTools—a zero-server file utility toolkit for secure video, image, and document processing.",
            "publisher": {
              "@type": "Organization",
              "name": "SafeTools",
              "logo": "https://safetools.space/logo.png"
            },
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Zero-Server Policy",
                  "description": "Files never leave the browser. Localized execution via WASM."
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Identity Protection",
                  "description": "No tracking, no analytics, no fingerprinting."
                }
              ]
            }
          })
        }}
      />
    </div>
  );
}
