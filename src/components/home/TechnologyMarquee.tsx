"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";

export function TechnologyMarquee() {
   const hp = useTranslations("home");

   return (
      <section className="py-24 glass-card border-y border-border overflow-hidden">
         <div className="container mx-auto px-6 mb-12">
            <div className="text-center space-y-4">
               <Badge className="bg-primary/10 text-primary border-primary/20 py-2 px-6 rounded-full font-semibold uppercase tracking-wider text-[10px]">{hp("techMarquee.badge")}</Badge>
               <h2 className="text-4xl font-extrabold tracking-tight font-heading">
                  {hp.rich("techMarquee.title", { 
                     span: (chunks: React.ReactNode) => <span className="text-primary">{chunks}</span>, 
                     br: () => <br /> 
                  })}
               </h2>
            </div>
         </div>
         <div className="flex gap-12 animate-marquee whitespace-nowrap py-4">
            {Array.isArray(hp.raw("techMarquee.items")) && (hp.raw("techMarquee.items") as Array<{ name: string; desc: string }>).concat(Array.isArray(hp.raw("techMarquee.items")) ? hp.raw("techMarquee.items") as Array<{ name: string; desc: string }> : []).map((tech, i) => (
               <div key={i} className="inline-flex items-center gap-4 px-10 py-6 rounded-2xl bg-secondary/50 dark:bg-secondary/30 backdrop-blur-sm border border-border/50">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-lg">{tech.name[0]}</div>
                  <div>
                     <div className="font-bold tracking-tight font-heading text-lg">{tech.name}</div>
                     <div className="text-[10px] font-semibold uppercase tracking-wider opacity-40">{tech.desc}</div>
                  </div>
               </div>
            ))}
         </div>
      </section>
   );
}
