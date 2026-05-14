"use client";

import React from "react";
import { CheckCircle2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";

export function FeatureComparison() {
   const hp = useTranslations("home");

   return (
      <section className="py-24 bg-secondary/50 dark:bg-secondary/30 backdrop-blur-sm border-y border-border">
         <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center space-y-8 mb-14">
               <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight font-heading">
                  {hp.rich("featureComparison.title", { 
                     span: (chunks: React.ReactNode) => <span className="text-primary">{chunks}</span>, 
                     br: () => <br /> 
                  })}
               </h2>
               <p className="text-muted-foreground font-medium">{hp("featureComparison.subtitle")}</p>
            </div>

            <div className="max-w-5xl mx-auto overflow-hidden rounded-3xl border border-border glass-card shadow-2xl">
               <div className="grid grid-cols-3 bg-secondary/50 dark:bg-secondary/30 backdrop-blur-sm p-8 border-b border-border font-semibold uppercase tracking-wider text-xs">
                  <div>{hp("featureComparison.table.feature")}</div>
                  <div className="text-primary">{hp("featureComparison.table.safe")}</div>
                  <div className="opacity-40">{hp("featureComparison.table.trad")}</div>
               </div>
               {Array.isArray(hp.raw("featureComparison.items")) && (hp.raw("featureComparison.items") as Array<{ f: string; s: boolean | string; c: boolean | string }>).map((row, i) => (
                  <div key={i} className="grid grid-cols-3 p-8 border-b border-border/50 items-center hover:bg-secondary/50 dark:bg-secondary/30 backdrop-blur-sm transition-colors">
                     <div className="font-bold text-sm">{row.f}</div>
                     <div>
                        {row.s === true ? <CheckCircle2 className="text-emerald-500 w-6 h-6" /> : <Badge variant="outline" className="text-[8px] uppercase">{row.s as string}</Badge>}
                     </div>
                     <div>
                        {row.c === false ? <X className="text-red-500/40 w-6 h-6" /> : <span className="text-xs font-medium opacity-40">{row.c as string}</span>}
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>
   );
}
