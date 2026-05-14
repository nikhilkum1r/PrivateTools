"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { DropZone } from "@/components/shared/DropZone";
import { TrustLayer } from "@/components/shared/TrustLayer";

interface RemoveBackgroundHeroProps {
  t: any;
  onUpload: (files: File[]) => void;
}

export function RemoveBackgroundHero({ t, onUpload }: RemoveBackgroundHeroProps) {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Background soft gradients */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30">
        <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] right-[5%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
      </div>

      <div className="pt-24 pb-12 px-4 container mx-auto text-center max-w-4xl space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="space-y-8"
        >
          <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center relative shadow-[0_0_50px_rgba(34,197,94,0.15)]">
            <Sparkles className="w-10 h-10 text-emerald-500" />
          </div>
          
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-foreground italic">
              {t("title") || "Remove Image Backgrounds"}
            </h1>
            <p className="text-xl md:text-2xl font-bold text-muted-foreground max-w-3xl mx-auto leading-tight italic">
              {t("description") || "Remove backgrounds from images instantly using browser-based privacy-first processing with zero uploads."}
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <p className="text-xs font-black text-emerald-500 uppercase tracking-widest">
                 {t("badge") || "Professional AI Segmentation — 100% Secure"}
               </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <DropZone 
            onFilesDrop={onUpload} 
            accept="image/*" 
            multiple={true} 
            title=" " 
            className="min-h-[280px] border-dashed border-white/10 bg-black/20 rounded-[3rem] hover:bg-black/40 hover:border-emerald-500/30 transition-all shadow-2xl backdrop-blur-3xl" 
          />
        </motion.div>
      </div>

      <div className="pb-12">
        <TrustLayer />
      </div>
    </section>
  );
}
