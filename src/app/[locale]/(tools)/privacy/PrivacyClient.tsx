"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ShieldAlert, 
  Lock, 
  EyeOff, 
  ServerOff, 
  CloudOff, 
  Search,
  ShieldCheck,
  Zap,
  Globe,
  Fingerprint,
  FileLock2,
  Trash2,
  WifiOff,
  Database,
  ArrowRight
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function PrivacyClient() {
  const t = useTranslations("privacy");

  const commitmentsRaw = t.raw("commitments.items") as Array<{ title: string; desc: string }>;
  const commitments = [
    { ...commitmentsRaw[0], icon: ServerOff, color: "from-blue-500 to-cyan-500" },
    { ...commitmentsRaw[1], icon: EyeOff, color: "from-purple-500 to-pink-500" },
    { ...commitmentsRaw[2], icon: Trash2, color: "from-orange-500 to-red-500" },
    { ...commitmentsRaw[3], icon: ShieldCheck, color: "from-emerald-500 to-teal-500" }
  ];

  const pillarsRaw = t.raw("pillars") as Array<{ title: string; desc: string }>;
  const pillars = [
    { ...pillarsRaw[0], icon: WifiOff },
    { ...pillarsRaw[1], icon: Database },
    { ...pillarsRaw[2], icon: Lock }
  ];

  const verificationSteps = t.raw("verification.steps") as Array<{ title: string; desc: string }>;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main id="main-content" className="flex-grow">
        {/* CINEMATIC HERO */}
        <section className="relative pt-40 pb-32 overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--glow-secondary),transparent_50%)]" />
          <div className="container mx-auto px-6 relative z-10 text-center space-y-10">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-6"
             >
                <Badge variant="outline" className="py-2 px-6 rounded-full border-primary/30 text-primary font-semibold uppercase tracking-wider text-[10px]">{t("hero.badge")}</Badge>
                <h1 className="text-6xl md:text-9xl font-extrabold tracking-tight uppercase font-heading leading-[0.85]">
                    {t.rich("hero.title", {
                     span: (chunks: React.ReactNode) => <span className="text-primary">{chunks}</span>,
                     br: () => <br />
                   })}
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-3xl mx-auto leading-relaxed">
                   {t("hero.subtitle")}
                </p>
             </motion.div>
          </div>
        </section>

        {/* THE THREE PILLARS */}
        <section className="py-32">
           <div className="container mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                 {pillars.map((pillar, i) => (
                   <motion.div 
                     key={i}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: i * 0.1 }}
                     className="space-y-6 text-center md:text-left"
                   >
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto md:mx-0">
                         <pillar.icon className="w-7 h-7" />
                      </div>
                      <h3 className="text-2xl font-bold font-heading">{pillar.title}</h3>
                      <p className="text-muted-foreground font-medium leading-relaxed">{pillar.desc}</p>
                   </motion.div>
                 ))}
              </div>
           </div>
        </section>

        {/* THE 10-SECOND PROOF (Interactive-style static section) */}
        <section className="py-32 bg-background text-foreground relative overflow-hidden">
           <div className="absolute inset-0 bg-grid-white/[0.02]" />
           <div className="container mx-auto px-6 relative z-10">
              <div className="max-w-6xl mx-auto">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <div className="space-y-10">
                       <div className="space-y-6">
                          <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight uppercase font-heading leading-tight">
                            {t.rich("verification.title", {
                              span: (chunks: React.ReactNode) => <span className="text-primary">{chunks}</span>,
                              br: () => <br />
                            })}
                          </h2>
                          <p className="text-xl text-muted-foreground font-medium">{t("verification.subtitle")}</p>
                       </div>
                       
                       <div className="space-y-8">
                          {verificationSteps.map((step, i) => (
                            <div key={i} className="flex gap-6 items-start">
                               <div className="text-3xl font-bold text-primary/30 font-heading shrink-0">{`0${i + 1}`}</div>
                               <div>
                                  <div className="text-xl font-bold font-heading mb-2">{step.title}</div>
                                  <div className="text-muted-foreground text-sm font-medium leading-relaxed">{step.desc}</div>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>

                    {/* Verification Card Visual */}
                    <div className="relative group">
                       <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000" />
                       <div className="relative bg-card border border-white/10 rounded-3xl p-12 space-y-8 shadow-2xl">
                          <div className="flex items-center justify-between">
                             <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                             </div>
                             <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">{t("verification.card.network")}</Badge>
                          </div>
                          <div className="space-y-6">
                             <div className="h-4 w-3/4 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div 
                                  animate={{ width: ["0%", "100%", "100%"] }}
                                  transition={{ duration: 3, repeat: Infinity }}
                                  className="h-full bg-primary" 
                                />
                             </div>
                             <div className="space-y-3 font-mono text-xs text-muted-foreground">
                                <div className="flex justify-between"><span>{t("verification.card.system")}</span> <span>{t("verification.card.initializing")}</span></div>
                                <div className="flex justify-between"><span>{t("verification.card.system")}</span> <span>{t("verification.card.active")}</span></div>
                                <div className="flex justify-between"><span>{t("verification.card.system")}</span> <span>{t("verification.card.blocked")}</span></div>
                                <div className="flex justify-between text-emerald-500"><span>{t("verification.card.success")}</span> <span>{t("verification.card.complete")}</span></div>
                             </div>
                          </div>
                          <div className="pt-4 flex items-center gap-3">
                             <ShieldCheck className="w-12 h-12 text-primary" />
                             <div>
                                <div className="font-bold text-sm">{t("verification.card.label")}</div>
                                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{t("verification.card.sublabel")}</div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* CORE COMMITMENTS BENTO */}
        <section className="py-40">
           <div className="container mx-auto px-6">
              <div className="text-center space-y-6 mb-20">
                 <Badge variant="outline" className="py-2 px-6 rounded-full border-primary/30 text-primary font-semibold uppercase tracking-wider text-[10px]">{t("commitments.badge")}</Badge>
                 <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight uppercase font-heading">
                   {t.rich("commitments.title", {
                     span: (chunks: React.ReactNode) => <span className="text-primary">{chunks}</span>,
                     br: () => <br />
                   })}
                 </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                 {commitments.map((c, i) => (
                   <motion.div
                     key={i}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: i * 0.1 }}
                     className="p-12 rounded-3xl bg-secondary/5 border border-border/50 hover:bg-card hover:border-primary/30 transition-all group"
                   >
                      <div className={cn("w-16 h-16 rounded-[24px] bg-gradient-to-br flex items-center justify-center text-foreground shadow-xl mb-10 group-hover:scale-110 transition-transform", c.color)}>
                         <c.icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-3xl font-bold font-heading mb-4">{c.title}</h3>
                      <p className="text-muted-foreground text-lg font-medium leading-relaxed">{c.desc}</p>
                   </motion.div>
                 ))}
              </div>
           </div>
        </section>

        {/* DATA TYPES PROTECTION GRID */}
        <section className="py-32 bg-secondary/10">
           <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto space-y-16">
                 <div className="space-y-6 text-center">
                    <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase font-heading">{t("protection.title")}</h2>
                    <p className="text-xl text-muted-foreground font-medium">{t("protection.subtitle")}</p>
                 </div>
                 
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {(Array.isArray(t.raw("protection.items")) ? (t.raw("protection.items") as Array<{ label: string }>) : []).map((item, i) => {
                      const icons = [Fingerprint, FileLock2, Lock, ShieldAlert];
                      const Icon = icons[i % icons.length];
                      return (
                        <div key={i} className="aspect-square rounded-3xl bg-card border border-border flex flex-col items-center justify-center gap-4 hover:border-primary/30 transition-all group">
                           <Icon className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                           <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">{item.label}</span>
                        </div>
                      );
                    })}
                 </div>
              </div>
           </div>
        </section>

        {/* FINAL MANIFESTO BLOCK */}
        <section className="py-40 border-t border-border/50">
           <div className="container mx-auto px-6">
              <div className="max-w-3xl mx-auto text-center space-y-12">
                 <h2 className="text-5xl font-extrabold tracking-tight uppercase font-heading">
                   {t.rich("final.title", {
                     br: (chunks: React.ReactNode) => <br />
                   })}
                 </h2>
                 <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                    {t("final.subtitle")}
                 </p>
                 <div className="pt-6">
                    <Link href="/">
                       <Button size="lg" className="h-20 px-12 rounded-[24px] bg-primary text-primary-foreground hover:bg-primary/90 font-bold tracking-wider text-sm group">
                          {t("final.button")} <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                       </Button>
                    </Link>
                 </div>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
