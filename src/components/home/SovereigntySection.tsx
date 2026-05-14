"use client";

import React from "react";
import { CheckCircle2, Verified } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";

export function SovereigntySection() {
   const hp = useTranslations("home");

   return (
      <section id="privacy" className="py-24 bg-primary text-primary-foreground overflow-hidden relative">
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-foreground/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />

         <div className="container mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               <div className="space-y-8">
                  <Badge className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 py-2 px-6 rounded-full font-semibold uppercase tracking-wider text-[10px]">{hp("sovereignty.badge")}</Badge>
                  <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none font-heading">
                     {hp.rich("sovereignty.title", { 
                        span: (chunks: React.ReactNode) => <span className="opacity-60">{chunks}</span>, 
                        br: () => <br /> 
                     })}
                  </h2>
                  <p className="text-xl opacity-90 leading-relaxed font-medium">
                     {hp("sovereignty.description")}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                     {Array.isArray(hp.raw("sovereignty.points")) && (hp.raw("sovereignty.points") as string[]).map((item, i) => (
                        <div key={i} className="flex items-center gap-3 font-bold text-lg">
                           <CheckCircle2 className="w-6 h-6 shrink-0" />
                           {item}
                        </div>
                     ))}
                  </div>
               </div>
               <div className="bg-primary-foreground/5 backdrop-blur-xl p-12 rounded-3xl border border-primary-foreground/10 space-y-6">
                  <h3 className="text-2xl font-bold tracking-tight">{hp("sovereignty.foundation.title")}</h3>
                  <p className="text-lg opacity-80 leading-relaxed">
                     {hp("sovereignty.foundation.description")}
                  </p>
                  <div className="pt-8 flex items-center gap-4">
                     <div className="w-16 h-16 rounded-2xl bg-primary-foreground/10 flex items-center justify-center"><Verified className="w-10 h-10" /></div>
                     <div>
                        <div className="text-sm font-semibold uppercase tracking-wider">{hp("sovereignty.foundation.badge")}</div>
                        <div className="text-xs opacity-60">{hp("sovereignty.foundation.verified")}</div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}
