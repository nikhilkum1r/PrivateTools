"use client";

import React from "react";
import { ArrowRight, Monitor, Smartphone, Shield } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function DesktopExperience() {
   const hp = useTranslations("home");
   const common = useTranslations("common");

   return (
      <section className="py-28 glass-card border-y border-border relative overflow-hidden">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,var(--glow-secondary),transparent_60%)]" />
         <div className="container mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center max-w-7xl mx-auto">
               <div className="space-y-10 order-2 lg:order-1">
                  <div className="space-y-6">
                     <Badge className="bg-primary/10 text-primary border-primary/20 py-2 px-6 rounded-full font-semibold uppercase tracking-wider text-[10px]">{hp("mobileExperience.badge")}</Badge>
                     <h2 className="text-5xl md:text-8xl font-extrabold tracking-tight font-heading leading-[0.85]">
                        {hp.rich("mobileExperience.title", { 
                           span: (chunks: React.ReactNode) => <span className="text-primary">{chunks}</span>, 
                           br: () => <br /> 
                        })}
                     </h2>
                     <p className="text-xl text-muted-foreground font-medium leading-relaxed">{hp("mobileExperience.subtitle")}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                     <div className="space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-secondary/50 dark:bg-secondary/30 backdrop-blur-sm flex items-center justify-center text-primary shadow-xl"><Monitor className="w-6 h-6" /></div>
                        <div className="font-bold tracking-tight font-heading text-lg">{hp("mobileExperience.desktop.title")}</div>
                        <p className="text-xs text-muted-foreground font-medium leading-relaxed">{hp("mobileExperience.desktop.description")}</p>
                     </div>
                     <div className="space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-secondary/50 dark:bg-secondary/30 backdrop-blur-sm flex items-center justify-center text-primary shadow-xl"><Smartphone className="w-6 h-6" /></div>
                        <div className="font-bold tracking-tight font-heading text-lg">{hp("mobileExperience.mobile.title")}</div>
                        <p className="text-xs text-muted-foreground font-medium leading-relaxed">{hp("mobileExperience.mobile.description")}</p>
                     </div>
                  </div>

                  <div className="pt-6">
                     <Button size="lg" className="h-16 px-10 rounded-[20px] bg-foreground text-background hover:bg-foreground/90 font-semibold uppercase tracking-wider text-xs group">
                        {hp("mobileExperience.waitlist")} <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                     </Button>
                  </div>
               </div>

               <div className="relative order-1 lg:order-2">
                  <div className="relative z-10 aspect-[4/3] rounded-3xl border-[12px] border-secondary bg-background shadow-[0_50px_100px_rgba(0,0,0,0.4)] overflow-hidden group">
                     <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-blue-500/10" />
                     <div className="p-8 h-full flex flex-col gap-6">
                        <div className="flex items-center justify-between border-b border-border/50 pb-6">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg"><Shield className="w-5 h-5" /></div>
                              <div className="section-header text-sm">{common("brand.desktop")}</div>
                           </div>
                           <div className="flex gap-2">
                              <div className="w-3 h-3 rounded-full bg-red-500/20" />
                              <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                              <div className="w-3 h-3 rounded-full bg-emerald-500/20" />
                           </div>
                        </div>
                        <div className="flex-1 grid grid-cols-3 gap-4">
                           {[1, 2, 3, 4, 5, 6].map(i => (
                              <div key={i} className="rounded-2xl border border-border/50 glass-card p-4 flex flex-col gap-3 group-hover:border-primary/30 transition-all">
                                 <div className="w-8 h-8 rounded-lg bg-secondary/50 dark:bg-secondary/30 backdrop-blur-sm" />
                                 <div className="h-2 w-12 bg-secondary/50 dark:bg-secondary/30 backdrop-blur-sm rounded-full" />
                                 <div className="h-1.5 w-8 bg-secondary/50 dark:bg-secondary/30 backdrop-blur-sm rounded-full" />
                              </div>
                           ))}
                        </div>
                        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">{hp("mobileExperience.status")}</div>
                           </div>
                           <div className="text-[10px] font-semibold uppercase tracking-wider opacity-40">{common("brand.build")}</div>
                        </div>
                     </div>
                  </div>
                  <div className="absolute -inset-10 bg-primary/20 blur-[100px] rounded-full opacity-50 z-0" />
               </div>
            </div>
         </div>
      </section>
   );
}
