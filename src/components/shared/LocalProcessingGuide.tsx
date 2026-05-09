"use client";

import React from "react";
import { ShieldCheck, Cpu, HardDrive, ArrowRightLeft } from "lucide-react";

export const LocalProcessingGuide = () => {
  return (
    <section className="py-24 rounded-[3rem] glass-card bg-black/20 border border-border overflow-hidden relative">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <ShieldCheck className="w-64 h-64 text-primary" />
      </div>

      <div className="max-w-4xl mx-auto px-6 space-y-12 relative z-10">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-foreground">
            How Local Processing Protects Your Privacy
          </h2>
          <p className="text-muted-foreground font-medium text-lg italic">
            "Files and data are processed directly inside your browser instead of being uploaded to external servers."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Sandboxed Context",
              desc: "Your data stays in a secure, isolated browser environment that third parties cannot access.",
              icon: ShieldCheck
            },
            {
              title: "Hardware Power",
              desc: "We leverage your device's CPU, GPU, and RAM via WebAssembly for maximum speed.",
              icon: Cpu
            },
            {
              title: "Zero Persistence",
              desc: "Once you close the tab, all traces of the processing are wiped from memory automatically.",
              icon: HardDrive
            }
          ].map((step, i) => (
            <div key={i} className="space-y-4 p-6 rounded-3xl bg-secondary/10 border border-border/50">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <step.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-black uppercase italic text-foreground leading-tight">
                {step.title}
              </h3>
              <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-8 p-8 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/20">
          <div className="flex items-center gap-6">
            <div className="flex -space-x-3">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 font-bold text-[10px]">Cloud</div>
              <div className="w-12 h-12 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center text-white font-bold text-lg"><ArrowRightLeft className="w-5 h-5" /></div>
              <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 font-bold text-[10px]">SafeTools</div>
            </div>
            <div className="space-y-1">
              <p className="font-black uppercase italic text-xs text-foreground tracking-widest">Architectural Advantage</p>
              <p className="text-xs text-muted-foreground font-medium">SafeTools eliminates the "Cloud Upload" vulnerability entirely.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
