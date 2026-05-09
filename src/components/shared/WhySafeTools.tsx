"use client";

import React from "react";
import { Shield, Zap, Globe, Lock, Smartphone, CloudOff } from "lucide-react";
import { motion } from "framer-motion";

export const WhySafeTools = () => {
  const reasons = [
    {
      title: "Local Processing",
      desc: "Files never leave your browser. All computations happen on your own hardware.",
      icon: Smartphone,
    },
    {
      title: "Zero Cloud Dependency",
      desc: "No remote servers, no data storage, no tracking. Total data sovereignty.",
      icon: CloudOff,
    },
    {
      title: "Privacy-First Architecture",
      desc: "Built with a security-first mindset using modern WebAssembly sandboxing.",
      icon: Shield,
    },
    {
      title: "Fast Performance",
      desc: "Eliminate upload and download wait times with sub-second local rendering.",
      icon: Zap,
    },
    {
      title: "Modern Cyber Design",
      desc: "A premium, distraction-free interface designed for efficiency and safety.",
      icon: Lock,
    },
    {
      title: "Cross-Platform",
      desc: "Seamless experience across Desktop, Mobile, and Tablet with PWA support.",
      icon: Globe,
    },
  ];

  return (
    <section className="py-24 space-y-16">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic font-heading text-foreground">
          Why <span className="text-primary">SafeTools?</span>
        </h2>
        <p className="text-lg text-muted-foreground font-medium">
          Traditional online tools are slow and insecure. SafeTools rebuilds the utility stack for the modern, private web.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 container mx-auto px-6">
        {reasons.map((reason, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-[2.5rem] glass-card border border-border/50 hover:border-primary/30 transition-all group bg-secondary/5"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <reason.icon className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-black uppercase italic tracking-tight mb-4 font-heading text-foreground">
              {reason.title}
            </h3>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              {reason.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
