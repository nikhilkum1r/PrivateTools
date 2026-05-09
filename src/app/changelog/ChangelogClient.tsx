"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  ShieldCheck, 
  Code2, 
  Cpu, 
  Rocket, 
  Sparkles,
  ArrowRight,
  Plus,
  History,
  CheckCircle2,
  Clock,
  ExternalLink
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { cn } from "@/lib/utils";

const changelogData = [
  {
    date: "May 2026",
    version: "v2.0.0",
    title: "The Masterpiece Upgrade",
    desc: "A massive architectural shift focused on user retention, technical transparency, and premium UI.",
    highlights: [
      { type: "New", text: "Global Command Palette (Cmd+K) for instant navigation." },
      { type: "New", text: "Local Retention System: Favorites & Recently used tools." },
      { type: "Improved", text: "Privacy Command Center visualizes local WASM activity." },
      { type: "Improved", text: "New high-performance Technology Marquee." }
    ],
    image: "/changelog/v2-hero.png", // Mockup path
    color: "bg-primary"
  },
  {
    date: "April 2026",
    version: "v1.8.0",
    title: "AI Studio Expansion",
    desc: "Bringing state-of-the-art AI processing directly to the browser with WebGPU support.",
    highlights: [
      { type: "New", text: "Pro AI Background Remover with local segment-anything support." },
      { type: "New", text: "Smart OCR Engine for 50+ languages." },
      { type: "Improved", text: "WASM multithreading support for large PDF processing." }
    ],
    color: "bg-purple-500"
  },
  {
    date: "March 2026",
    version: "v1.5.0",
    title: "The Zero-Server Milestone",
    desc: "Successfully migrated 100% of tool logic to client-side WebAssembly.",
    highlights: [
      { type: "New", text: "FFmpeg.wasm integration for video transcoding." },
      { type: "New", text: "Browser-based PDF Encryption & Password removal." },
      { type: "Fixed", text: "Resolved COOP/COEP isolation issues for worker threads." }
    ],
    color: "bg-emerald-500"
  }
];

export default function ChangelogClient() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative pt-40 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--glow-secondary),transparent_50%)]" />
          <div className="container mx-auto px-6 relative z-10 text-center space-y-8">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-6"
             >
                <Badge variant="outline" className="py-2 px-6 rounded-full border-primary/30 text-primary uppercase font-black tracking-widest text-[10px]">Product Updates</Badge>
                <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic font-heading leading-none">
                   What's <br /> <span className="text-primary italic">New?</span>
                </h1>
                <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto italic">
                   Track our progress as we build the world's most advanced privacy-first utility suite.
                </p>
             </motion.div>
          </div>
        </section>

        {/* TIMELINE SECTION */}
        <section className="py-20">
           <div className="container mx-auto px-6 max-w-5xl">
              <div className="relative space-y-32">
                 {/* The Line */}
                 <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-border/50 -translate-x-1/2 hidden md:block" />

                 {changelogData.map((item, i) => (
                   <div key={i} className="relative">
                      {/* Date Marker (Desktop) */}
                      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 -top-12 px-6 py-2 rounded-full bg-secondary border border-border items-center gap-2 z-20">
                         <Clock className="w-3 h-3 text-muted-foreground" />
                         <span className="text-[10px] font-black uppercase tracking-widest">{item.date}</span>
                      </div>

                      <div className={cn(
                        "flex flex-col md:flex-row items-center gap-12 lg:gap-24",
                        i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                      )}>
                         {/* Content */}
                         <motion.div 
                           initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                           whileInView={{ opacity: 1, x: 0 }}
                           viewport={{ once: true }}
                           className="flex-1 space-y-8"
                         >
                            <div className="space-y-4">
                               <div className="flex items-center gap-3">
                                  <Badge className={cn("text-foreground font-black italic", item.color)}>{item.version}</Badge>
                                  <span className="md:hidden text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.date}</span>
                               </div>
                               <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tight font-heading leading-tight">{item.title}</h2>
                               <p className="text-lg text-muted-foreground font-medium italic">{item.desc}</p>
                            </div>

                            <div className="space-y-3">
                               {item.highlights.map((h, hi) => (
                                 <div key={hi} className="flex items-start gap-4 group">
                                    <Badge variant="outline" className={cn(
                                       "mt-1 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm shrink-0",
                                       h.type === "New" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500" :
                                       h.type === "Improved" ? "border-blue-500/30 bg-blue-500/10 text-blue-500" :
                                       "border-orange-500/30 bg-orange-500/10 text-orange-500"
                                    )}>
                                       {h.type}
                                    </Badge>
                                    <span className="text-sm font-bold text-foreground/80 group-hover:text-foreground transition-colors">{h.text}</span>
                                 </div>
                               ))}
                            </div>
                         </motion.div>

                         {/* Visual / Badge Placeholder */}
                         <motion.div 
                           initial={{ opacity: 0, scale: 0.8 }}
                           whileInView={{ opacity: 1, scale: 1 }}
                           viewport={{ once: true }}
                           className="flex-1 w-full"
                         >
                            <div className="aspect-video rounded-[40px] bg-secondary/20 border border-border flex items-center justify-center relative overflow-hidden group shadow-2xl">
                               <div className={cn("absolute inset-0 opacity-10 blur-[80px] rounded-full", item.color)} />
                               <div className="relative z-10 flex flex-col items-center gap-4">
                                  <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center text-foreground shadow-xl group-hover:scale-110 transition-transform", item.color)}>
                                     {i === 0 ? <Sparkles className="w-10 h-10" /> : i === 1 ? <Cpu className="w-10 h-10" /> : <ShieldCheck className="w-10 h-10" />}
                                  </div>
                                  <div className="text-[10px] font-black uppercase tracking-widest opacity-40">System Release Visual</div>
                               </div>
                            </div>
                         </motion.div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* FEEDBACK / CTA */}
        <section className="py-40 border-t border-border/50">
           <div className="container mx-auto px-6 text-center space-y-12">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary border border-border">
                 <History className="w-4 h-4 text-primary" />
                 <span className="text-[10px] font-black uppercase tracking-widest">More updates coming every week</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic font-heading">Help Us Shape the <br /> <span className="text-primary italic">Future.</span></h2>
              <p className="text-xl text-muted-foreground font-medium italic max-w-2xl mx-auto">Have a tool request or found a bug? Join our community on GitHub and help us build the ultimate local-first privacy suite.</p>
              <div className="pt-6 flex flex-wrap justify-center gap-6">
                 <Button size="lg" className="h-16 px-10 rounded-2xl bg-primary hover:bg-primary/90 font-black uppercase italic tracking-widest text-sm group">
                    View on GitHub <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                 </Button>
                 <Button variant="outline" size="lg" className="h-16 px-10 rounded-2xl border-border hover:bg-secondary font-black uppercase italic tracking-widest text-sm">
                    Follow Updates
                 </Button>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
