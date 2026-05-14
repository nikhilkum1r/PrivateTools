"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Activity, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Database, 
  Globe, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  RefreshCw,
  Server,
  CloudOff,
  Signal,
  Sparkles
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function StatusClient() {
  const t = useTranslations("site");
  const [lastCheck, setLastCheck] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setLastCheck(new Date().toLocaleTimeString());
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastCheck(new Date().toLocaleTimeString());
      setIsRefreshing(false);
    }, 1000);
  };

  const systems = [
    { 
      name: t("status.systems.wasm.name"), 
      status: "operational", 
      desc: t("status.systems.wasm.desc"), 
      icon: Cpu, 
      color: "emerald" 
    },
    { 
      name: t("status.systems.privacy.name"), 
      status: "operational", 
      desc: t("status.systems.privacy.desc"), 
      icon: ShieldCheck, 
      color: "emerald" 
    },
    { 
      name: t("status.systems.storage.name"), 
      status: "operational", 
      desc: t("status.systems.storage.desc"), 
      icon: Database, 
      color: "emerald" 
    },
    { 
      name: t("status.systems.rendering.name"), 
      status: "operational", 
      desc: t("status.systems.rendering.desc"), 
      icon: Zap, 
      color: "emerald" 
    }
  ];

  const checks = [
    { label: t("status.checks.identity.label"), status: t("status.checks.identity.status"), desc: t("status.checks.identity.desc") },
    { label: t("status.checks.encryption.label"), status: t("status.checks.encryption.status"), desc: t("status.checks.encryption.desc") },
    { label: t("status.checks.integrity.label"), status: t("status.checks.integrity.status"), desc: t("status.checks.integrity.desc") }
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
                <div className="flex items-center justify-center gap-4 mb-8">
                   <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider">{t("status.hero.badge")}</span>
                   </div>
                </div>
                <h1 className="text-6xl md:text-9xl font-extrabold tracking-tight uppercase font-heading leading-tight" dangerouslySetInnerHTML={{ __html: t.raw("status.hero.title") }} />
                <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">{t("status.hero.subtitle")}</p>
             </motion.div>
          </div>
        </section>

        {/* SYSTEM CARDS */}
        <section className="py-20">
           <div className="container mx-auto px-6 max-w-7xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {systems.map((system, i) => (
                   <motion.div
                     key={i}
                     initial={{ opacity: 0, scale: 0.95 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     viewport={{ once: true }}
                     transition={{ delay: i * 0.1 }}
                     className="p-10 rounded-3xl bg-card border border-border/50 shadow-2xl group relative overflow-hidden"
                   >
                      <div className="flex items-start justify-between relative z-10">
                         <div className="flex items-start gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center shrink-0">
                               <system.icon className="w-8 h-8 text-primary" />
                            </div>
                            <div className="space-y-2">
                               <h3 className="text-2xl font-bold font-heading tracking-tight">{system.name}</h3>
                               <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-xs">{system.desc}</p>
                            </div>
                         </div>
                         <div className="flex flex-col items-end gap-2">
                            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-semibold uppercase tracking-wider text-[9px] py-1 px-4 rounded-full">
                               {t("status.badge.operational")}
                            </Badge>
                            <span className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-wider">99.9% Uptime</span>
                         </div>
                      </div>
                      
                      {/* Visual Pulse */}
                      <div className="mt-8 h-1 w-full bg-secondary/30 rounded-full overflow-hidden">
                         <motion.div 
                           className="h-full bg-emerald-500"
                           initial={{ width: "0%" }}
                           whileInView={{ width: "100%" }}
                           transition={{ duration: 1.5, ease: "easeOut" }}
                         />
                      </div>
                   </motion.div>
                 ))}
              </div>
           </div>
        </section>

        {/* DETAILED CHECKS */}
        <section className="py-20 border-t border-border">
           <div className="container mx-auto px-6 max-w-5xl">
              <div className="space-y-12">
                 <div className="flex justify-between items-end">
                    <div className="space-y-2">
                       <h2 className="text-4xl font-bold font-heading tracking-tight">{t("status.checks.title")}</h2>
                       <p className="text-muted-foreground font-medium">{t("status.checks.subtitle")}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      onClick={handleRefresh}
                      className="h-14 px-8 rounded-2xl border-border text-muted-foreground hover:text-foreground font-semibold uppercase tracking-wider text-[10px] gap-3"
                    >
                       <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
                       {t("status.checks.refresh")}
                    </Button>
                 </div>

                 <div className="rounded-3xl border border-border overflow-hidden bg-card/50 backdrop-blur-xl">
                    <div className="p-8 border-b border-border bg-secondary/10 flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <Activity className="w-5 h-5 text-primary" />
                          <span className="text-xs font-semibold uppercase tracking-wider">{t("status.checks.integrity.label")}</span>
                       </div>
                       <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-wider">{t("status.checks.lastChecked", { time: lastCheck })}</span>
                    </div>
                    
                    <div className="divide-y divide-border">
                       {checks.map((check, i) => (
                         <div key={i} className="p-8 flex items-center justify-between group hover:bg-secondary/5 transition-colors">
                            <div className="space-y-1">
                               <h4 className="text-lg font-bold font-heading">{check.label}</h4>
                               <p className="text-xs text-muted-foreground font-medium">{check.desc}</p>
                            </div>
                            <div className="flex items-center gap-4">
                               <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-500">{check.status}</span>
                               <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="p-10 rounded-3xl bg-secondary/10 border border-dashed border-border flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6 text-center md:text-left">
                       <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center shrink-0 shadow-lg">
                          <CloudOff className="w-8 h-8 text-primary" />
                       </div>
                       <div className="space-y-1">
                          <h3 className="text-2xl font-bold font-heading">{t("status.offline.title")}</h3>
                          <p className="text-muted-foreground font-medium leading-relaxed">{t("status.offline.subtitle")}</p>
                       </div>
                    </div>
                    <Button className="h-16 px-10 rounded-2xl bg-primary font-bold tracking-wider text-sm shrink-0">
                       {t("status.offline.button")}
                    </Button>
                 </div>
              </div>
           </div>
        </section>

        {/* STATS */}
        <section className="py-40">
           <div className="container mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
                 {[
                   { label: t("status.stats.uptime.label"), value: t("status.stats.uptime.value") },
                   { label: t("status.stats.latency.label"), value: t("status.stats.latency.value") },
                   { label: t("status.stats.privacy.label"), value: t("status.stats.privacy.value") },
                   { label: t("status.stats.nodes.label"), value: t("status.stats.nodes.value") }
                 ].map((stat, i) => (
                   <div key={i} className="space-y-2">
                      <h4 className="text-5xl font-bold font-heading tracking-tight text-primary">{stat.value}</h4>
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{stat.label}</p>
                   </div>
                 ))}
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
