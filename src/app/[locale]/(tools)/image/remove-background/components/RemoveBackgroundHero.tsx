"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ImageIcon } from "lucide-react";
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

      <div className="pt-24 pb-12 px-4 container mx-auto text-center max-w-4xl space-y-12 relative">
        {/* Floating tech badges */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 0.6, x: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="absolute top-20 left-0 hidden xl:flex flex-col gap-2 items-start"
        >
          <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="text-[8px] font-black tracking-widest text-white/40 uppercase">Engine: ONNX Runtime Web</span>
          </div>
          <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="text-[8px] font-black tracking-widest text-white/40 uppercase">Node: TensorFlow.js</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="space-y-8"
        >
          <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center relative shadow-[0_0_50px_rgba(34,197,94,0.15)] group transition-all hover:scale-110">
            <Sparkles className="w-10 h-10 text-emerald-500 transition-transform group-hover:rotate-12" />
            <div className="absolute -inset-2 bg-emerald-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          
          <div className="space-y-6">
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase text-foreground italic leading-[0.9]">
              {t("title") || "Remove Image Backgrounds"}
            </h1>
            <p className="text-xl md:text-2xl font-bold text-muted-foreground max-w-3xl mx-auto leading-tight italic opacity-80">
              {t("description") || "Remove backgrounds from images instantly using browser-based privacy-first processing with zero uploads."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                 <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                   {t("badge") || "Professional AI Segmentation — 100% Secure"}
                 </p>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                 <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                   Dual-Node Architecture
                 </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto group relative"
        >
          <div className="absolute -inset-4 bg-emerald-500/5 blur-3xl rounded-[4rem] opacity-0 group-hover:opacity-100 transition-opacity" />
          <DropZone 
            onFilesDrop={onUpload} 
            accept="image/*" 
            multiple={true} 
            title=" " 
            className="min-h-[300px] border-dashed border-white/10 bg-black/40 rounded-[3rem] hover:bg-black/60 hover:border-emerald-500/40 transition-all shadow-2xl backdrop-blur-3xl relative z-10" 
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center space-y-4 group-hover:scale-105 transition-transform">
             <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-8 h-8 text-emerald-500/60" />
             </div>
             <p className="text-xs font-black uppercase tracking-[0.3em] text-white/40">{t("dropzone.description") || "Drag Assets for Neural Processing"}</p>
          </div>
        </motion.div>
      </div>

      <div className="pb-12">
        <TrustLayer />
      </div>
    </section>
  );
}

