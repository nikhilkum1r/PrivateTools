"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Database, 
  CloudOff, 
  Lock, 
  EyeOff, 
  ServerOff,
  Search,
  Languages,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  Command,
  Activity,
  Layers
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function FeaturesClient() {
  const t = useTranslations("site");

  const pillars = [
    {
      title: t("features.pillars.privacy.title"),
      desc: t("features.pillars.privacy.desc"),
      icon: ShieldCheck,
      color: "text-emerald-500 bg-emerald-500/10",
      features: [t("features.pillars.privacy.f1"), t("features.pillars.privacy.f2"), t("features.pillars.privacy.f3")]
    },
    {
      title: t("features.pillars.performance.title"),
      desc: t("features.pillars.performance.desc"),
      icon: Zap,
      color: "text-blue-500 bg-blue-500/10",
      features: [t("features.pillars.performance.f1"), t("features.pillars.performance.f2"), t("features.pillars.performance.f3")]
    },
    {
      title: t("features.pillars.tech.title"),
      desc: t("features.pillars.tech.desc"),
      icon: Cpu,
      color: "text-purple-500 bg-purple-500/10",
      features: [t("features.pillars.tech.f1"), t("features.pillars.tech.f2"), t("features.pillars.tech.f3")]
    }
  ];

  const comparison = [
    { feature: t("features.comparison.rows.processing.label"), safe: true, others: false },
    { feature: t("features.comparison.rows.data.label"), safe: true, others: false },
    { feature: t("features.comparison.rows.speed.label"), safe: true, others: true },
    { feature: t("features.comparison.rows.tracking.label"), safe: false, others: true },
    { feature: t("features.comparison.rows.cost.label"), safe: t("features.comparison.rows.cost.valueSafe"), others: t("features.comparison.rows.cost.valueOthers") }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main id="main-content" className="flex-grow">
        {/* HERO */}
        <section className="relative pt-40 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--glow-secondary),transparent_50%)] opacity-30" />
          <div className="container mx-auto px-6 relative z-10 text-center space-y-8">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-6"
             >
                <Badge variant="outline" className="py-2 px-6 rounded-full border-primary/30 text-primary font-semibold uppercase tracking-wider text-[10px]">{t("features.hero.badge")}</Badge>
                <h1 className="text-6xl md:text-9xl font-extrabold tracking-tight uppercase font-heading leading-tight" dangerouslySetInnerHTML={{ __html: t.raw("features.hero.title") }} />
                <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">{t("features.hero.subtitle")}</p>
             </motion.div>
          </div>
        </section>

        {/* PILLARS GRID */}
        <section className="py-20">
           <div className="container mx-auto px-6 max-w-7xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                 {pillars.map((pillar, i) => (
                   <motion.div
                     key={i}
                     initial={{ opacity: 0, scale: 0.95 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     viewport={{ once: true }}
                     transition={{ delay: i * 0.1 }}
                     className="p-12 rounded-[56px] bg-card border border-border/50 shadow-2xl group hover:border-primary/30 transition-all flex flex-col h-full"
                   >
                      <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center mb-10 transition-transform group-hover:scale-110 duration-500", pillar.color)}>
                         <pillar.icon className="w-10 h-10" />
                      </div>
                      
                      <div className="space-y-6 flex-grow">
                         <h3 className="text-3xl font-bold font-heading tracking-tight">{pillar.title}</h3>
                         <p className="text-muted-foreground font-medium leading-relaxed">{pillar.desc}</p>
                         
                         <ul className="space-y-4 pt-6">
                            {pillar.features.map((f, fi) => (
                              <li key={fi} className="flex items-center gap-3">
                                 <CheckCircle2 className="w-4 h-4 text-primary/40" />
                                 <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{f}</span>
                              </li>
                            ))}
                         </ul>
                      </div>
                   </motion.div>
                 ))}
              </div>
           </div>
        </section>

        {/* COMPARISON TABLE */}
        <section className="py-40 bg-secondary/10">
           <div className="container mx-auto px-6 max-w-5xl">
              <div className="space-y-20">
                 <div className="text-center space-y-6">
                    <Activity className="w-16 h-16 mx-auto text-primary" />
                    <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight uppercase font-heading">{t("features.comparison.title")}</h2>
                    <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">{t("features.comparison.subtitle")}</p>
                 </div>

                 <div className="rounded-[56px] border border-border overflow-hidden bg-card/50 backdrop-blur-3xl shadow-2xl">
                    <table className="w-full text-left border-collapse">
                       <thead>
                          <tr className="bg-secondary/20">
                             <th className="p-10 text-xs font-bold tracking-wider text-muted-foreground/40">{t("features.comparison.headers.feature")}</th>
                             <th className="p-10 text-xl font-bold font-heading text-primary flex items-center gap-3">
                                <ShieldCheck className="w-6 h-6" /> SafeTools
                             </th>
                             <th className="p-10 text-xl font-bold font-heading text-muted-foreground/40">{t("features.comparison.headers.others")}</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-border">
                          {comparison.map((row, i) => (
                            <tr key={i} className="group hover:bg-secondary/5 transition-colors">
                               <td className="p-10">
                                  <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/60">{row.feature}</span>
                               </td>
                               <td className="p-10">
                                  {typeof row.safe === "boolean" ? (
                                    row.safe ? <CheckCircle2 className="w-8 h-8 text-emerald-500" /> : <XCircle className="w-8 h-8 text-rose-500/40" />
                                  ) : (
                                    <span className="text-xl font-bold font-heading text-emerald-500">{row.safe}</span>
                                  )}
                               </td>
                               <td className="p-10">
                                  {typeof row.others === "boolean" ? (
                                    row.others ? <CheckCircle2 className="w-8 h-8 text-primary/40" /> : <XCircle className="w-8 h-8 text-rose-500/40" />
                                  ) : (
                                    <span className="text-xl font-bold font-heading text-muted-foreground/40">{row.others}</span>
                                  )}
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>
        </section>

        {/* ARCHITECTURE */}
        <section className="py-40">
           <div className="container mx-auto px-6 max-w-6xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                 <div className="space-y-12">
                    <div className="space-y-6">
                       <Layers className="w-16 h-16 text-primary" />
                       <h2 className="text-5xl font-bold font-heading tracking-tight leading-tight" dangerouslySetInnerHTML={{ __html: t.raw("features.architecture.title") }} />
                       <p className="text-xl text-muted-foreground font-medium leading-relaxed">{t("features.architecture.subtitle")}</p>
                    </div>

                    <div className="space-y-8">
                       {[
                         { title: t("features.architecture.items.wasm.title"), desc: t("features.architecture.items.wasm.desc") },
                         { title: t("features.architecture.items.encryption.title"), desc: t("features.architecture.items.encryption.desc") },
                         { title: t("features.architecture.items.pwa.title"), desc: t("features.architecture.items.pwa.desc") }
                       ].map((item, i) => (
                         <div key={i} className="flex gap-6 group">
                            <div className="text-2xl font-bold font-heading text-primary/20 group-hover:text-primary transition-colors">0{i+1}</div>
                            <div className="space-y-2">
                               <h4 className="text-xl font-bold font-heading tracking-tight">{item.title}</h4>
                               <p className="text-muted-foreground text-sm font-medium">{item.desc}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="relative group">
                    <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-blue-500/20 rounded-[64px] blur-3xl opacity-0 group-hover:opacity-100 transition duration-1000" />
                    <div className="relative p-12 rounded-[64px] bg-card border border-border shadow-2xl space-y-12 overflow-hidden">
                       <div className="absolute top-0 right-0 p-12 opacity-5">
                          <Command className="w-40 h-40" />
                       </div>
                       
                       <div className="space-y-6 relative z-10 text-center">
                          <Sparkles className="w-16 h-16 mx-auto text-primary animate-pulse" />
                          <h3 className="text-4xl font-bold font-heading">{t("features.cta.title")}</h3>
                          <p className="text-muted-foreground font-medium">{t("features.cta.description")}</p>
                       </div>

                       <div className="pt-6 relative z-10">
                          <Button className="w-full h-20 rounded-2xl bg-primary text-background font-bold tracking-wider text-lg group">
                             {t("features.cta.button")} <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                          </Button>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
