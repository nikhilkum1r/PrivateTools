"use client";

import React from "react";
import { motion } from "framer-motion";
import { WifiOff, Lock, Terminal, CloudOff, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";

export function PrivacyEngineHeartbeat() {
   const hp = useTranslations("home");

   return (
      <section className="py-24 relative overflow-hidden glass-card border-y border-border">
         <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,var(--glow-secondary),transparent_70%)]" />
         <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-20">
               <div className="flex-1 space-y-10">
                  <div className="space-y-6">
                     <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 py-2 px-6 rounded-full font-semibold uppercase tracking-wider text-[10px]">{hp("privacyEngine.badge")}</Badge>
                     <h2 className="text-5xl md:text-8xl font-extrabold tracking-tight font-heading leading-[0.85]">
                        {hp.rich("privacyEngine.title", { 
                           span: (chunks: React.ReactNode) => <span className="text-emerald-600 dark:text-emerald-500">{chunks}</span>, 
                           br: () => <br /> 
                        })}
                     </h2>
                     <p className="text-xl text-muted-foreground font-medium leading-relaxed">{hp("privacyEngine.description")}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                     {Array.isArray(hp.raw("privacyEngine.stats")) && (hp.raw("privacyEngine.stats") as Array<{ label: string; value: string }>).map((stat, i) => {
                        const icons = [WifiOff, Lock, Terminal, CloudOff];
                        const Icon = icons[i % icons.length];
                        return (
                          <div key={i} className="space-y-2">
                             <div className="flex items-center gap-2 text-emerald-500">
                                <Icon className="w-4 h-4" />
                                <span className="text-[10px] font-semibold uppercase tracking-wider">{stat.label}</span>
                             </div>
                             <div className="text-3xl font-extrabold tracking-tight font-heading">{stat.value}</div>
                          </div>
                        );
                     })}
                  </div>
               </div>
               <div className="flex-1 relative">
                  <div className="aspect-square rounded-3xl border border-border/50 bg-background/50 backdrop-blur-xl flex items-center justify-center relative group overflow-hidden">
                     {/* Pulse Animation */}
                     <motion.div
                        animate={{
                           scale: [1, 1.1, 1],
                           opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 bg-emerald-500/5 rounded-full blur-3xl"
                     />
                     <div className="relative z-10 flex flex-col items-center gap-6">
                        <div className="w-40 h-40 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 relative overflow-hidden">
                           <motion.div
                              animate={{ y: [-100, 100] }}
                              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                              className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent w-full h-20"
                           />
                           <ShieldCheck className="w-20 h-20 drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
                        </div>
                        <div className="text-center">
                           <div className="text-2xl section-header">{hp("privacyEngine.heartbeat")}</div>
                           <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-500/60 flex items-center justify-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              {hp("privacyEngine.wasmHeartbeat")}
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}
