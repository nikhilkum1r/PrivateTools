"use client";

import React from "react";
import { motion } from "framer-motion";
import { Scissors, ShieldCheck, Lock, Search, Zap, Cpu } from "lucide-react";

interface SplitPdfHeroProps {
  t: any;
}

export function SplitPdfHero({ t }: SplitPdfHeroProps) {
  return (
    <section className="pt-24 pb-8 px-4 container mx-auto text-center max-w-4xl space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center relative shadow-[0_0_50px_rgba(59,130,246,0.15)]">
          <Scissors className="w-10 h-10 text-blue-500" />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight uppercase text-foreground" dangerouslySetInnerHTML={{ __html: t.raw("hero.title") }} />
          <p className="text-xl md:text-2xl font-bold text-muted-foreground max-w-3xl mx-auto">
            {t("hero.subtitle")}
          </p>
          <div className="text-sm font-medium text-blue-500 bg-blue-500/10 inline-block px-4 py-2 rounded-full border border-blue-500/20">
            {t("hero.badge")}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-3 pt-4">
          {[
            { icon: ShieldCheck, text: t("hero.trust.local") },
            { icon: Lock, text: t("hero.trust.zero") },
            { icon: Search, text: t("hero.trust.no_tracking") },
            { icon: Zap, text: t("hero.trust.fast") },
            { icon: Cpu, text: t("hero.trust.browser") }
          ].map((badge, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card bg-secondary/30 border border-border">
              <badge.icon className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{badge.text}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
