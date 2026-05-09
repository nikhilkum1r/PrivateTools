"use client";

import React from "react";
import { CheckCircle2, ShieldCheck, Lock, EyeOff, WifiOff } from "lucide-react";
import { motion } from "framer-motion";

export const TrustLayer = () => {
  const trustPoints = [
    { label: "Processed Locally", icon: CheckCircle2, color: "text-emerald-500" },
    { label: "No Uploads", icon: ShieldCheck, color: "text-blue-500" },
    { label: "No Tracking", icon: EyeOff, color: "text-purple-500" },
    { label: "Privacy-First", icon: Lock, color: "text-amber-500" },
    { label: "Works Offline", icon: WifiOff, color: "text-rose-500" },
  ];

  return (
    <section className="w-full py-8 border-y border-border/50 bg-secondary/5 backdrop-blur-sm overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
          {trustPoints.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 group cursor-default"
            >
              <div className={`p-2 rounded-xl bg-background/50 border border-border group-hover:border-primary/30 transition-all ${point.color}`}>
                <point.icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
                {point.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
