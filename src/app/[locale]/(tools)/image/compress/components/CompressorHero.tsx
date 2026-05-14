"use client";

import React from "react";
import { motion } from "framer-motion";
import { Monitor, ArrowRight, Cpu, Download, Zap, Shield, Lock, Globe, ShieldCheck } from "lucide-react";
import { DropZone } from "@/components/shared/DropZone";
import { TrustLayer } from "@/components/shared/TrustLayer";

interface CompressorHeroProps {
  t: any;
  defaultFormat?: string;
  onFilesDrop: (files: File[]) => void;
}

export function CompressorHero({ t, defaultFormat, onFilesDrop }: CompressorHeroProps) {
  return (
    <motion.div
      key="upload-stage"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl mx-auto space-y-12"
    >
      <div className="text-center space-y-8">
        <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full glass-card border border-primary/20 shadow-2xl shadow-primary/5">
          <div className="flex items-center gap-2">
            <Monitor className="w-3.5 h-3.5 text-primary" />
            <span className="text-[8px] font-semibold uppercase tracking-wider opacity-60">{t("hero.device")}</span>
          </div>
          <ArrowRight className="w-3 h-3 opacity-20" />
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span className="text-[8px] font-semibold uppercase tracking-wider text-emerald-500">{t("hero.engine")}</span>
          </div>
          <ArrowRight className="w-3 h-3 opacity-20" />
          <div className="flex items-center gap-2">
            <Download className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-primary/60">{t("hero.badge")}</span>
          </div>
        </div>

        <h1 className="text-4xl md:text-8xl font-bold tracking-tight font-heading leading-none">
          {defaultFormat && defaultFormat !== "original"
            ? t("hero.titleSpecific", { format: defaultFormat.toUpperCase() })
            : t("hero.title")}
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl leading-relaxed font-medium max-w-4xl mx-auto">
          {defaultFormat && defaultFormat !== "original"
            ? t("hero.descriptionSpecific", { format: defaultFormat.toUpperCase() })
            : t("hero.description")
          }
        </p>
      </div>

      <div className="relative group max-w-4xl mx-auto">
        <motion.div
          className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent blur-md z-20 pointer-events-none opacity-0 group-hover:opacity-100"
          animate={{ top: ['0%', '100%'] }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        />
        
        <div className="absolute -inset-4 bg-primary/20 blur-[100px] rounded-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-blue-500/30 to-primary/30 rounded-[45px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse" />

        <div className="relative overflow-hidden rounded-3xl border border-border/40 group-hover:border-primary/50 transition-all duration-700 shadow-2xl glass-card">
          <DropZone
            onFilesDrop={onFilesDrop}
            multiple
            maxSize={1024}
            title={t("dropzone.title")}
            description={t("dropzone.description")}
            accept="image/*,.heic,.heif,.webp,.avif,.tiff,.tif,.svg"
            className="h-80 border-none bg-transparent hover:bg-primary/[0.02] transition-colors"
          />
          
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/40 rounded-tl-[40px] pointer-events-none" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/40 rounded-tr-[40px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/40 rounded-bl-[40px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/40 rounded-br-[40px] pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { l: t("benefits.local"), i: ShieldCheck },
          { l: t("benefits.zero"), i: Shield },
          { l: t("benefits.noTracking"), i: Lock },
          { l: t("benefits.fast"), i: Zap },
          { l: t("benefits.browser"), i: Globe }
        ].map((b, i) => (
          <div key={i} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-secondary/20 border border-border/50 gap-2 hover:bg-secondary/40 transition-colors">
            <b.i className="w-5 h-5 text-primary" />
            <span className="text-[8px] font-semibold uppercase tracking-wider text-center">{b.l}</span>
          </div>
        ))}
      </div>

      <TrustLayer />
    </motion.div>
  );
}
