"use client";

import React from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { WhySafeTools } from "@/components/shared/WhySafeTools";
import { LocalProcessingGuide } from "@/components/shared/LocalProcessingGuide";
import { ShieldCheck, Lock, Eye, Cpu, Database, ServerOff, Globe, Zap, AlertTriangle, Fingerprint } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

export default function SecurityPage() {
  const t = useTranslations("security");
  const common = useTranslations("common");

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Navbar />

      <main id="main-content" className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-6 max-w-6xl space-y-32">
          
          {/* Hero Section */}
          <section className="text-center space-y-8 py-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="w-24 h-24 mx-auto rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-2xl">
                <ShieldCheck className="w-12 h-12 text-primary" />
              </div>
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight uppercase text-foreground">
                  {t.rich("hero.title", {
                    span: (chunks) => <span className="text-primary">{chunks}</span>
                  })}
                </h1>
                <p className="text-xl md:text-2xl font-bold text-muted-foreground max-w-3xl mx-auto leading-tight">
                  {t("hero.description")}
                </p>
              </div>
            </motion.div>
          </section>

          {/* Comparison: Local vs Cloud */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="p-10 rounded-[3rem] bg-red-500/5 border border-red-500/20 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">{t("comparison.trad.title")}</h2>
              </div>
              <ul className="space-y-4">
                {(Array.isArray(t.raw("comparison.trad.items")) ? (t.raw("comparison.trad.items") as string[]) : []).map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm font-medium text-muted-foreground">
                    <div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shrink-0 mt-0.5">✕</div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-10 rounded-[3rem] bg-emerald-500/5 border border-emerald-500/20 space-y-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                 <ShieldCheck className="w-32 h-32 text-primary" />
               </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">{t("comparison.safe.title")}</h2>
              </div>
              <ul className="space-y-4">
                {(Array.isArray(t.raw("comparison.safe.items")) ? (t.raw("comparison.safe.items") as string[]) : []).map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm font-medium text-muted-foreground">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 mt-0.5">✓</div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Deep Dive Sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(Array.isArray(t.raw("deepDive")) ? (t.raw("deepDive") as Array<{ title: string; desc: string }>) : []).map((card, i) => {
              const icons = [Cpu, Database, Lock];
              const Icon = icons[i % icons.length];
              return (
                <div key={i} className="p-8 rounded-[2rem] glass-card border border-border space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{card.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium">{card.desc}</p>
                </div>
              );
            })}
          </div>

          <LocalProcessingGuide />

          <WhySafeTools />

          {/* Detailed Policy Text */}
          <section className="max-w-3xl mx-auto space-y-8 py-16 border-t border-border/50">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">{t("policy.title")}</h2>
              <div className="text-muted-foreground font-medium leading-relaxed">
                {t.rich("policy.content", {
                  strong: (chunks) => <strong>{chunks}</strong>
                })}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-primary">{t("policy.noServers.title")}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{t("policy.noServers.desc")}</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-primary">{t("policy.noAccounts.title")}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{t("policy.noAccounts.desc")}</p>
              </div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
