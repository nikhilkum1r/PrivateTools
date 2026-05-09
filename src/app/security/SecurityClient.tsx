"use client";

import React from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { WhySafeTools } from "@/components/shared/WhySafeTools";
import { LocalProcessingGuide } from "@/components/shared/LocalProcessingGuide";
import { ShieldCheck, Lock, Eye, Cpu, Database, ServerOff, Globe, Zap, AlertTriangle, Fingerprint } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export default function SecurityPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Navbar />

      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-6 max-w-6xl space-y-32">
          
          {/* Hero Section */}
          <section className="text-center space-y-8 py-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="w-24 h-24 mx-auto rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-2xl">
                <ShieldCheck className="w-12 h-12 text-primary" />
              </div>
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-foreground">
                  Security <span className="text-primary">Architecture</span>
                </h1>
                <p className="text-xl md:text-2xl font-bold text-muted-foreground max-w-3xl mx-auto leading-tight italic">
                  How SafeTools mathematically guarantees your privacy through local-first browser isolation.
                </p>
              </div>
            </motion.div>
          </section>

          {/* Comparison: Local vs Cloud */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="p-10 rounded-[3rem] bg-red-500/5 border border-red-500/20 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black uppercase italic text-foreground">Traditional Cloud Tools</h2>
              </div>
              <ul className="space-y-4">
                {[
                  "Files uploaded to remote servers over HTTPS",
                  "Data processed on centralized cloud hardware",
                  "Temporary storage (risky persistence)",
                  "Potential for government subpoenas or leaks",
                  "Tracking scripts analyze your file metadata"
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm font-medium text-muted-foreground">
                    <div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shrink-0 mt-0.5">✕</div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-10 rounded-[3rem] bg-emerald-500/5 border border-emerald-500/20 space-y-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                 <ShieldCheck className="w-32 h-32 text-primary" />
               </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black uppercase italic text-foreground">SafeTools Local-First</h2>
              </div>
              <ul className="space-y-4">
                {[
                  "Zero file uploads (Files stay on device)",
                  "Processing happens via WebAssembly locally",
                  "No server-side storage or databases",
                  "Mathematically immune to server-side breaches",
                  "Privacy by design: No tracking, no logs"
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm font-medium text-muted-foreground">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 mt-0.5">✓</div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Deep Dive Sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Sandboxed WebAssembly",
                desc: "We use WebAssembly (WASM) to run heavy logic inside a memory-isolated sandbox. This ensures no system access.",
                icon: Cpu
              },
              {
                title: "Zero Persistence",
                desc: "All processing happens in volatile RAM. Once you close the tab, your data is gone forever.",
                icon: Database
              },
              {
                title: "Client-Side Encryption",
                desc: "Cryptography tools use the Web Crypto API to ensure keys never leave your browser context.",
                icon: Lock
              }
            ].map((card, i) => (
              <div key={i} className="p-8 rounded-[2rem] glass-card border border-border space-y-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <card.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black uppercase italic text-foreground">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">{card.desc}</p>
              </div>
            ))}
          </div>

          <LocalProcessingGuide />

          <WhySafeTools />

          {/* Detailed Policy Text */}
          <section className="max-w-3xl mx-auto space-y-8 py-16 border-t border-border/50">
            <div className="space-y-4">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter text-foreground">Mathematical Privacy</h2>
              <p className="text-muted-foreground font-medium leading-relaxed">
                Most "privacy-focused" tools rely on trust. They promise not to look at your data. SafeTools removes the need for trust entirely. Because we cannot see your files, we cannot breach your privacy. This is <strong>Privacy by Infrastructure</strong>.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-2">
                <h4 className="font-black text-xs uppercase tracking-widest text-primary italic">No Servers</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">We don't maintain file servers. There is literally no place for your data to be stored on our end.</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-black text-xs uppercase tracking-widest text-primary italic">No Accounts</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">We don't track users. You use the tools anonymously, and your usage is private to your browser.</p>
              </div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
