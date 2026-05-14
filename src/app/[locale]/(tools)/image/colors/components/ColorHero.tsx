"use client";

import React from "react";
import { motion } from "framer-motion";
import { Wand2, Plus, ShieldCheck, Monitor, Lock, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ColorHeroProps {
  t: any;
  toolSectionRef: React.RefObject<HTMLDivElement | null>;
  handleFilesDrop: (files: File[]) => void;
}

export function ColorHero({ t, toolSectionRef, handleFilesDrop }: ColorHeroProps) {
  return (
    <section className="relative px-6 py-24 md:py-40 flex flex-col items-center text-center overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl space-y-12 relative z-10"
      >
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass-card border border-primary/20 shadow-2xl">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">{t("badge")}</span>
        </div>

        <div className="space-y-6">
          <h1 className="text-5xl md:text-8xl font-bold tracking-tight font-heading leading-[0.9]">
            {t("title")} <br />
            <span className="text-primary">{t("titleSecondary")}</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed">
            {t("description")}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button 
            size="lg" 
            className="h-16 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold uppercase tracking-wider text-sm shadow-[0_0_40px_rgba(var(--color-primary-rgb),0.3)] hover:scale-[1.02] active:scale-95 transition-all gap-3"
            onClick={() => toolSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Wand2 className="w-5 h-5" /> {t("extractNow")}
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="h-16 px-10 rounded-2xl border-border bg-secondary/50 font-semibold uppercase tracking-wider text-sm hover:bg-secondary transition-all gap-3"
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.onchange = (e) => {
                const files = (e.target as HTMLInputElement).files;
                if (files) handleFilesDrop(Array.from(files));
              };
              input.click();
            }}
          >
            <Plus className="w-5 h-5" /> {t("uploadImage")}
          </Button>
        </div>

        <div className="pt-12 grid grid-cols-2 md:grid-cols-5 gap-6">
          {(Array.isArray(t.raw("heroBadges")) ? (t.raw("heroBadges") as string[]) : []).map((b, i) => {
            const icons = [ShieldCheck, Monitor, Lock, Zap, Globe];
            const Icon = icons[i % icons.length];
            return (
              <div key={i} className="flex flex-col items-center gap-2 opacity-40 hover:opacity-100 transition-opacity">
                <Icon className="w-5 h-5 text-primary" />
                <span className="text-[9px] font-semibold uppercase tracking-wider">{b}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full animate-pulse" />
      </div>
    </section>
  );
}
