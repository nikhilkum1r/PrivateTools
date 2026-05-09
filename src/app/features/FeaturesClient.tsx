"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Shield, Zap, Lock, Cpu, Globe, 
  Smartphone, Monitor, Terminal, 
  Command, Heart, Layers, EyeOff,
  CloudOff, ZapOff, ShieldCheck, 
  ArrowRight, CheckCircle2, Sparkles
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Zero-Server Architecture",
    desc: "Your files never touch our servers. All processing happens locally in your browser's secure sandbox using high-performance WebAssembly.",
    icon: CloudOff,
    color: "from-blue-500 to-cyan-500",
    detail: "By moving the compute to the client, we eliminate the biggest security risk: data in transit and storage."
  },
  {
    title: "Military-Grade Privacy",
    desc: "No tracking pixels, no analytics cookies, and zero data collection. SafeTools is built for anonymity by design.",
    icon: EyeOff,
    color: "from-purple-500 to-pink-500",
    detail: "We don't just protect your data; we never see it. Your session is entirely private and non-persistent."
  },
  {
    title: "Sub-Second Latency",
    desc: "Experience near-instant processing. Without the need for large file uploads or network round-trips, tools feel like native apps.",
    icon: Zap,
    color: "from-yellow-500 to-orange-500",
    detail: "Process multi-gigabyte files instantly because the data never has to leave your RAM."
  },
  {
    title: "150+ Specialized Tools",
    desc: "A comprehensive suite of utilities for images, PDFs, security, and development—all in one unified, high-speed workspace.",
    icon: Layers,
    color: "from-emerald-500 to-teal-500",
    detail: "From HEIC conversion to JWT decoding, everything you need is one click away."
  },
  {
    title: "Command Palette (Cmd+K)",
    desc: "Navigate the entire platform with lightning speed using our keyboard-driven command interface. Instant access to any tool.",
    icon: Command,
    color: "from-indigo-500 to-blue-500",
    detail: "Stop clicking through menus. Just hit Cmd+K and type what you need."
  },
  {
    title: "Local Retention System",
    desc: "Personalize your workspace with local-first favorites and recently used tools. Your preferences stay on your device.",
    icon: Heart,
    color: "from-pink-500 to-rose-500",
    detail: "We use encrypted localStorage to remember what you love without ever knowing who you are."
  }
];

const techStack = [
  { name: "WebAssembly", desc: "Native-speed execution in the browser", icon: Cpu },
  { name: "Transformers.js", desc: "Local AI & Machine Learning", icon: Sparkles },
  { name: "FFmpeg.wasm", desc: "Professional video/audio engine", icon: Terminal },
  { name: "AES-256-GCM", desc: "Industry-standard local encryption", icon: Lock }
];

export default function FeaturesClient() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--glow-secondary),transparent_50%)]" />
          <div className="container mx-auto px-6 relative z-10 text-center space-y-8">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6 }}
               className="space-y-4"
             >
                <Badge variant="outline" className="py-2 px-6 rounded-full border-primary/30 text-primary uppercase font-black tracking-widest text-[10px]">Architecture Deep Dive</Badge>
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic font-heading leading-none">
                  Built for the <br /> <span className="text-primary">Privacy Era</span>
                </h1>
                <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto italic">
                  SafeTools is a complete departure from traditional cloud utilities. Explore the engineering that puts you back in control.
                </p>
             </motion.div>
          </div>
        </section>

        {/* CORE FEATURES BENTO GRID */}
        <section className="py-20">
           <div className="container mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {features.map((f, i) => (
                   <motion.div
                     key={i}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: i * 0.1 }}
                     className="group p-10 rounded-[40px] bg-secondary/10 border border-border/50 hover:bg-card hover:border-primary/30 transition-all shadow-sm hover:shadow-2xl"
                   >
                      <div className={cn("w-16 h-16 rounded-[20px] bg-gradient-to-br flex items-center justify-center text-foreground shadow-lg mb-8 group-hover:scale-110 transition-transform", f.color)}>
                         <f.icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-black uppercase italic mb-4 font-heading">{f.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-6 font-medium">{f.desc}</p>
                      <div className="pt-6 border-t border-border/50">
                         <p className="text-[10px] font-black uppercase tracking-widest text-primary italic font-heading">Deep Tech Info</p>
                         <p className="text-xs text-muted-foreground mt-2">{f.detail}</p>
                      </div>
                   </motion.div>
                 ))}
              </div>
           </div>
        </section>

        {/* INSIDE THE ENGINE (The Browser Visual) */}
        <section className="py-40 bg-card border-y border-border relative overflow-hidden">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--glow-secondary),transparent_70%)]" />
           <div className="container mx-auto px-6">
              <div className="flex flex-col lg:flex-row items-center gap-24 max-w-7xl mx-auto">
                 <div className="flex-1 space-y-12">
                    <div className="space-y-6">
                       <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic font-heading">Inside the <br /> <span className="text-primary">Safe Engine</span></h2>
                       <p className="text-xl text-muted-foreground font-medium leading-relaxed italic">Most tools send your data to a server. We send the code to your data.</p>
                    </div>
                    
                    <div className="space-y-8">
                       {techStack.map((tech, i) => (
                         <div key={i} className="flex gap-6 items-start group">
                            <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all shrink-0">
                               <tech.icon className="w-6 h-6" />
                            </div>
                            <div>
                               <div className="font-black uppercase italic font-heading text-lg">{tech.name}</div>
                               <div className="text-muted-foreground text-sm font-medium">{tech.desc}</div>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
                 
                 <div className="flex-1 relative">
                    {/* Visual Representation of local processing */}
                    <div className="relative z-10 aspect-square rounded-[60px] border-[16px] border-secondary bg-background shadow-2xl overflow-hidden flex items-center justify-center">
                       <div className="absolute inset-0 bg-grid-white/[0.02]" />
                       <div className="relative w-64 h-64">
                          <motion.div 
                             animate={{ rotate: 360 }}
                             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                             className="absolute inset-0 rounded-full border-4 border-dashed border-primary/20" 
                          />
                          <motion.div 
                             animate={{ rotate: -360 }}
                             transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                             className="absolute inset-8 rounded-full border-2 border-dashed border-blue-500/20" 
                          />
                          <div className="absolute inset-16 rounded-full bg-primary/10 backdrop-blur-xl border border-primary/30 flex items-center justify-center shadow-2xl">
                             <ShieldCheck className="w-12 h-12 text-primary" />
                          </div>
                          {/* Floating particles */}
                          {[1,2,3,4].map(i => (
                            <motion.div
                              key={i}
                              animate={{ 
                                x: [Math.random() * 100, Math.random() * -100, Math.random() * 100],
                                y: [Math.random() * 100, Math.random() * -100, Math.random() * 100],
                                opacity: [0, 1, 0]
                              }}
                              transition={{ duration: 5 + i, repeat: Infinity }}
                              className="absolute w-2 h-2 rounded-full bg-primary"
                            />
                          ))}
                       </div>
                    </div>
                    {/* Glow */}
                    <div className="absolute -inset-20 bg-primary/20 blur-[120px] rounded-full opacity-50 z-0" />
                 </div>
              </div>
           </div>
        </section>

        {/* COMPARISON RECAP */}
        <section className="py-40">
           <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto text-center space-y-12">
                 <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic font-heading">Better for You. <br /> <span className="text-primary">Better for Security.</span></h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-10 rounded-[40px] bg-red-500/5 border border-red-500/20 space-y-6 text-left">
                       <div className="text-red-500 font-black uppercase tracking-widest text-[10px]">Cloud Tools</div>
                       <ul className="space-y-4">
                          {[
                            "Uploads private files to unknown servers",
                            "Sells usage data to advertisers",
                            "Data exists in backups forever",
                            "Slow upload/download cycles",
                            "Vulnerable to server-side breaches"
                          ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm font-medium opacity-60">
                               <ZapOff className="w-4 h-4 shrink-0" /> {item}
                            </li>
                          ))}
                       </ul>
                    </div>
                    <div className="p-10 rounded-[40px] bg-emerald-500/5 border border-emerald-500/20 space-y-6 text-left">
                       <div className="text-emerald-500 font-black uppercase tracking-widest text-[10px]">SafeTools</div>
                       <ul className="space-y-4">
                          {[
                            "Data never leaves your browser",
                            "Zero tracking. Zero cookies.",
                            "Processed in RAM. Deleted instantly.",
                            "Near-zero latency performance",
                            "Client-side sandboxing protection"
                          ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm font-medium">
                               <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> {item}
                            </li>
                          ))}
                       </ul>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-40 bg-primary text-primary-foreground overflow-hidden relative">
           <div className="absolute top-0 right-0 p-20 opacity-10 rotate-12 scale-150">
              <Shield className="w-96 h-96" />
           </div>
           <div className="container mx-auto px-6 relative z-10 text-center space-y-10">
              <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic font-heading leading-[0.8]">Ready to <br /> Switch?</h2>
              <p className="text-xl font-medium opacity-80 max-w-xl mx-auto">Join thousands of professionals who have ditched cloud-based security risks for SafeTools.</p>
              <div className="pt-6">
                 <Button size="lg" className="h-20 px-12 rounded-[24px] bg-white text-primary hover:bg-white/90 font-black uppercase tracking-widest text-sm italic group">
                    Explore All Tools <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                 </Button>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
