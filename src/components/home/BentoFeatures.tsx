"use client";

import React from "react";
import { ShieldCheck, Lock, Fingerprint, Shield, Zap, Monitor, WifiOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";

export function BentoFeatures() {
   const hp = useTranslations("home");

   return (
      <section className="py-24 bg-secondary/80 dark:bg-secondary/40 backdrop-blur-sm cv-auto">
         <h2 className="sr-only">Core Features</h2>
         <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-auto md:h-[700px]">
               {/* Large Feature 1 */}
               <div className="md:col-span-2 md:row-span-2 p-10 rounded-3xl glass-card border border-border/50 flex flex-col justify-between group hover:border-primary/40 transition-all relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000 text-primary">
                     <ShieldCheck className="w-64 h-64" />
                  </div>
                  <div className="space-y-6 relative z-10 text-left">
                     <Badge className="bg-primary/10 text-primary border-primary/20 py-1 px-4 text-[10px] font-semibold uppercase tracking-wider">{hp("bento.privacy.badge")}</Badge>
                     <h3 className="text-4xl font-bold font-heading">{hp("bento.privacy.title")}</h3>
                     <p className="text-muted-foreground font-medium text-lg leading-relaxed max-w-md">{hp("bento.privacy.description")}</p>
                  </div>
                  <div className="pt-8 text-left">
                     <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-muted/40 backdrop-blur-sm flex items-center justify-center text-primary"><Lock className="w-6 h-6" /></div>
                        <div className="w-12 h-12 rounded-2xl bg-muted/40 backdrop-blur-sm flex items-center justify-center text-primary"><Fingerprint className="w-6 h-6" /></div>
                        <div className="w-12 h-12 rounded-2xl bg-muted/40 backdrop-blur-sm flex items-center justify-center text-primary"><Shield className="w-6 h-6" /></div>
                     </div>
                  </div>
               </div>

               {/* Medium Feature 1 */}
               <div className="md:col-span-2 p-10 rounded-3xl glass-card border border-border/50 flex flex-col justify-between group hover:border-primary/40 transition-all relative overflow-hidden text-left">
                  <div className="absolute -bottom-10 -right-10 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform text-primary">
                     <Zap className="w-48 h-48" />
                  </div>
                  <div className="space-y-4">
                     <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 py-1 px-4 text-[10px] font-semibold uppercase tracking-wider">{hp("bento.performance.badge")}</Badge>
                     <h3 className="text-3xl font-bold font-heading">{hp("bento.performance.title")}</h3>
                     <p className="text-muted-foreground font-medium text-sm leading-relaxed">{hp("bento.performance.description")}</p>
                  </div>
               </div>

               {/* Small Feature 1 */}
               <div className="p-8 rounded-3xl glass-card border border-border/50 flex flex-col gap-4 group hover:border-primary/40 transition-all text-left">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><Monitor className="w-6 h-6" /></div>
                  <h3 className="text-xl font-bold font-heading leading-tight">{hp("bento.crossPlatform.title")}</h3>
                  <p className="text-muted-foreground text-xs font-medium">{hp("bento.crossPlatform.description")}</p>
               </div>

               {/* Small Feature 2 */}
               <div className="p-8 rounded-3xl glass-card border border-border/50 flex flex-col gap-4 group hover:border-primary/40 transition-all text-left">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500"><WifiOff className="w-6 h-6" /></div>
                  <h3 className="text-xl font-bold font-heading leading-tight">{hp("bento.offlineFirst.title")}</h3>
                  <p className="text-muted-foreground text-xs font-medium">{hp("bento.offlineFirst.description")}</p>
               </div>
            </div>
         </div>
      </section>
   );
}
