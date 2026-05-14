"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Globe, Download, Zap, ShieldCheck, Shield, Lock, ImageIcon, Layers, Sparkles } from "lucide-react";
import { DropZone } from "@/components/shared/DropZone";

interface ConversionHeroProps {
  t: any;
  fromFormat?: string;
  toFormat?: string;
  handleFilesDrop: (files: File[]) => void;
}

export function ConversionHero({ t, fromFormat, toFormat, handleFilesDrop }: ConversionHeroProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="py-12 md:py-24 space-y-12 text-center"
    >
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-500">{t("hero.engine")}</span>
          </div>
          <ArrowRight className="w-3 h-3 opacity-20" />
          <div className="flex items-center gap-2">
            <Download className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-primary/60">{t("hero.privateConverter")}</span>
          </div>
        </div>

        <h1 className="text-4xl md:text-8xl font-bold tracking-tight font-heading leading-none" dangerouslySetInnerHTML={{ __html: fromFormat && toFormat 
            ? t.raw("hero.titleSpecific", { from: fromFormat.toUpperCase(), to: toFormat.toUpperCase() })
            : t.raw("hero.title") }} />
        <p className="text-muted-foreground text-lg md:text-xl leading-relaxed font-medium max-w-4xl mx-auto" dangerouslySetInnerHTML={{ __html: fromFormat && toFormat 
            ? t.raw("hero.descriptionSpecific", { from: fromFormat.toUpperCase(), to: toFormat.toUpperCase() })
            : t.raw("hero.description")
          }} />
      </div>

      <div className="relative group max-w-5xl mx-auto">
        <div className="absolute -inset-4 bg-primary/20 blur-[100px] rounded-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="relative overflow-hidden rounded-3xl border border-border/40 group-hover:border-primary/50 transition-all duration-700 shadow-2xl glass-card">
          <DropZone
            onFilesDrop={handleFilesDrop}
            multiple
            accept="image/*,.heic,.heif,.tiff,.psd,.svg"
            maxSize={1024}
            title={t.raw("hero.title")}
            description={t.raw("hero.description")}
            className="h-80 border-none bg-transparent hover:bg-primary/[0.02] transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { l: t("benefits.local"), i: ShieldCheck },
          { l: t("benefits.zero"), i: Shield },
          { l: t("benefits.no_tracking"), i: Lock },
          { l: t("benefits.fast"), i: Zap },
          { l: t("benefits.browser"), i: Globe }
        ].map((b, i) => (
          <div key={i} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-secondary/20 border border-border/50 gap-2 hover:bg-secondary/40 transition-colors">
            <b.i className="w-5 h-5 text-primary" />
            <span className="text-[8px] font-semibold uppercase tracking-wider text-center">{b.l}</span>
          </div>
        ))}
      </div>

      <div className="pt-20 space-y-12">
        <div className="flex flex-col items-center text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight font-heading">{t("performance.title")}</h2>
          <p className="text-xs font-bold tracking-wider text-muted-foreground/40">{t("performance.subtitle")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(Array.isArray(t.raw("performance.items")) ? (t.raw("performance.items") as Array<{ title: string; description: string }>) : []).map((f, i) => (
            <div key={i} className="p-8 rounded-2xl bg-secondary/10 border border-border flex flex-col gap-4 hover:bg-secondary/20 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                {React.createElement([Zap, ShieldCheck, ImageIcon, Layers, Sparkles, Globe][i % 6], { className: "w-6 h-6" })}
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold uppercase tracking-wider">{f.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
