"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Globe, 
  Lock, 
  Zap 
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface OCRHeroProps {
  t: any;
  scrollToTool: () => void;
}

export function OCRHero({ t, scrollToTool }: OCRHeroProps) {
  return (
    <section data-google-ads-ignore="true" className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-40">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--primary-rgb)_0%,_transparent_70%)] opacity-[0.03] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-semibold uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {t("hero.badge")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-7xl font-extrabold tracking-tight leading-[0.9]"
          >
            {t.rich("hero.title", {
              span: (chunks: React.ReactNode) => <span className="text-primary not-italic">{chunks}</span>
            })}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto font-medium"
          >
            {t("hero.description")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Button
              onClick={scrollToTool}
              className="h-14 px-8 rounded-2xl bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-500 text-primary-foreground font-bold text-sm uppercase tracking-wider shadow-2xl shadow-primary/30 group active:scale-95 transition-all"
            >
              {t("hero.extractNow")} <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              onClick={scrollToTool}
              className="h-14 px-8 rounded-2xl border-primary/20 hover:border-primary/40 hover:bg-primary/5 font-bold text-sm uppercase tracking-wider text-primary transition-all active:scale-95"
            >
              {t("hero.uploadImage")}
            </Button>
            <Button
              variant="ghost"
              onClick={scrollToTool}
              className="h-14 px-8 rounded-2xl text-muted-foreground hover:text-primary font-bold text-sm uppercase tracking-wider hover:bg-primary/5 transition-all active:scale-95"
            >
              {t("hero.tryDemo")}
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 pt-8"
          >
            {[
              { icon: ShieldCheck, label: t("hero.badges.private") },
              { icon: Globe, label: t("hero.badges.browser") },
              { icon: Lock, label: t("hero.badges.noUpload") },
              { icon: Zap, label: t("hero.badges.ai") },
              { icon: Sparkles, label: t("hero.badges.free") }
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                <badge.icon className="w-3.5 h-3.5 text-primary" />
                {badge.label}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
