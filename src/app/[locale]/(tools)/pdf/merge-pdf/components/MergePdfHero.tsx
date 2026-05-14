"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Layers, Lock, ShieldCheck, Search, Zap, Cpu 
} from "lucide-react";

interface MergePdfHeroProps {
  t: any;
}

export function MergePdfHero({ t }: MergePdfHeroProps) {
  return (
    <section className="pt-24 pb-12 px-4 container mx-auto text-center max-w-4xl space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center relative shadow-[0_0_50px_rgba(59,130,246,0.1)]">
          <Layers className="w-10 h-10 text-blue-500" />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight uppercase text-foreground" dangerouslySetInnerHTML={{ __html: t.raw("hero.title") }} />
          <p className="text-xl md:text-2xl font-bold text-muted-foreground max-w-3xl mx-auto">
            {t("hero.description")}
          </p>
          <p className="text-sm font-medium text-emerald-400 bg-emerald-500/10 inline-block px-4 py-2 rounded-full border border-emerald-500/20">
            {t("hero.disclaimer")}
          </p>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-3 pt-4">
          {[
            { icon: Lock, text: t("hero.badges.local") },
            { icon: ShieldCheck, text: t("hero.badges.zero") },
            { icon: Search, text: t("hero.badges.no_tracking") },
            { icon: Zap, text: t("hero.badges.fast") },
            { icon: Cpu, text: t("hero.badges.browser") }
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
