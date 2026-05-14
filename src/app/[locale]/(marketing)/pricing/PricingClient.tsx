"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Check, 
  Heart, 
  Zap, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Layers,
  Infinity as InfinityIcon,
  ZapOff,
  Clock,
  ExternalLink
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const freeFeatures = [
  "150+ Professional Tools",
  "Unlimited File Processing",
  "Zero File Size Limits",
  "Hardware-Accelerated Speed",
  "100% Private & Local",
  "No Account Required",
  "No Ads or Trackers",
  "Full Local Engine Access"
];

export default function PricingClient() {
  const t = useTranslations("pricing");
  const common = useTranslations("common");

  const freeFeatures = t.raw("plan.features") as string[];



  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main id="main-content" className="flex-grow">
        {/* HERO - ANTI-SAAS STATEMENT */}
        <section className="relative pt-40 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--glow-secondary),transparent_50%)]" />
          <div className="container mx-auto px-6 relative z-10 text-center space-y-8">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-6"
             >
                <Badge variant="outline" className="py-2 px-6 rounded-full border-primary/30 text-primary font-semibold uppercase tracking-wider text-[10px]">{t("hero.badge")}</Badge>
                <h1 className="text-6xl md:text-9xl font-extrabold tracking-tight uppercase font-heading leading-none">
                   {t.rich("hero.title", {
                      br: () => <br />,
                      span: (chunks: React.ReactNode) => <span className="text-primary">{chunks}</span>
                   })}
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto">
                   {t("hero.subtitle")}
                </p>
             </motion.div>
          </div>
        </section>

        {/* THE "INFINITY" PLAN CARD */}
        <section className="py-20">
           <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto">
                 <motion.div
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="relative group"
                 >
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-blue-500 rounded-[60px] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000" />
                    <div className="relative bg-card border border-border rounded-[60px] p-12 md:p-20 shadow-2xl overflow-hidden">
                       <div className="absolute top-0 right-0 p-12 opacity-5 -rotate-12">
                          <InfinityIcon className="w-64 h-64" />
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
                          <div className="space-y-10">
                             <div className="space-y-4">
                                <h2 className="text-4xl font-bold font-heading">{t("plan.title")}</h2>
                                <div className="flex items-baseline gap-2">
                                   <span className="text-7xl font-extrabold tracking-tight font-heading">{t("plan.price")}</span>
                                   <span className="text-muted-foreground font-bold">{t("plan.forever")}</span>
                                </div>
                             </div>
                             <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                                {t("plan.description")}
                             </p>
                             <div className="pt-4">
                                <Button size="lg" className="h-16 px-10 rounded-2xl bg-primary hover:bg-primary/90 font-semibold uppercase tracking-wider text-sm w-full md:w-auto">
                                   {t("plan.button")} <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                             </div>
                          </div>

                          <div className="space-y-6">
                             <div className="text-[10px] font-semibold uppercase tracking-wider text-primary font-heading">{t("plan.included")}</div>
                             <div className="grid grid-cols-1 gap-4">
                                {freeFeatures.map((feat, i) => (
                                  <div key={i} className="flex items-center gap-3 text-sm font-bold">
                                     <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                        <Check className="w-3 h-3" />
                                     </div>
                                     {feat}
                                  </div>
                                ))}
                             </div>
                          </div>
                       </div>
                    </div>
                 </motion.div>
              </div>
           </div>
        </section>

        {/* COMPARISON RECAP */}
        <section className="py-40 bg-secondary/10">
           <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto space-y-16">
                 <div className="text-center space-y-4">
                    <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight uppercase font-heading">
                      {t.rich("comparison.title", {
                        br: () => <br />,
                        span: (chunks: React.ReactNode) => <span className="text-primary">{chunks}</span>
                      })}
                    </h2>
                    <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
                      {t.rich("comparison.subtitle", {
                        b: (chunks: React.ReactNode) => <b>{chunks}</b>
                      })}
                    </p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-10 rounded-3xl bg-card border border-border space-y-6 relative overflow-hidden group">
                       <ZapOff className="absolute -top-4 -right-4 w-32 h-32 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform" />
                       <h3 className="text-2xl font-bold font-heading">{t("comparison.cloud.title")}</h3>
                       <ul className="space-y-4">
                          <li className="flex items-center gap-3 text-sm text-muted-foreground line-through">{t("comparison.cloud.unlimited_strike")}</li>
                          {(Array.isArray(t.raw("comparison.cloud.features")) ? (t.raw("comparison.cloud.features") as string[]) : []).map((f, i) => (
                             <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">{f}</li>
                          ))}
                       </ul>
                    </div>
                    <div className="p-10 rounded-3xl bg-primary text-primary-foreground space-y-6 relative overflow-hidden group shadow-2xl">
                       <InfinityIcon className="absolute -top-4 -right-4 w-32 h-32 opacity-10 -rotate-12 group-hover:rotate-0 transition-transform" />
                       <h3 className="text-2xl font-bold font-heading">{t("comparison.safe.title")}</h3>
                       <ul className="space-y-4">
                          {(Array.isArray(t.raw("comparison.safe.features")) ? (t.raw("comparison.safe.features") as string[]) : []).map((f, i) => (
                             <li key={i} className="flex items-center gap-3 text-sm font-bold"><Check className="w-4 h-4" /> {f}</li>
                          ))}
                       </ul>
                    </div>
                 </div>
              </div>
           </div>
        </section>



        {/* FINAL MANIFESTO CALL */}
        <section className="py-40 bg-secondary/30">
           <div className="container mx-auto px-6 text-center space-y-10">
              <Sparkles className="w-16 h-16 mx-auto text-primary opacity-50" />
              <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight uppercase font-heading leading-none">
                {t.rich("final.title", {
                  br: () => <br />
                })}
              </h2>
              <p className="text-xl text-muted-foreground font-medium">{t("final.subtitle")}</p>
              <div className="pt-10 flex flex-wrap justify-center gap-6">
                 <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-background border border-border">
                    <Heart className="w-4 h-4 text-pink-500" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider">{t("final.independent")}</span>
                 </div>
                 <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-background border border-border">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider">{t("final.zeroServer")}</span>
                 </div>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
