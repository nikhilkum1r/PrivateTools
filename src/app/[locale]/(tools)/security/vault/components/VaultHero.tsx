"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Shield, Zap, EyeOff, HardDrive } from "lucide-react";

interface VaultHeroProps {
  t: any;
}

export function VaultHero({ t }: VaultHeroProps) {
  return (
    <section className="pt-24 pb-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            {t("hero.badge")}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground" dangerouslySetInnerHTML={{ __html: t.raw("hero.title") }} />
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("hero.description")}
          </p>
          
          {/* Hero Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            {[
              { icon: Lock, text: t("hero.badges.privacy") },
              { icon: Shield, text: t("hero.badges.local") },
              { icon: Zap, text: t("hero.badges.zero") },
              { icon: EyeOff, text: t("hero.badges.noTracking") },
              { icon: HardDrive, text: t("hero.badges.offline") }
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border shadow-sm">
                <badge.icon className="w-4 h-4 text-[#22C55E]" />
                <span className="text-sm font-medium text-foreground">{badge.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
