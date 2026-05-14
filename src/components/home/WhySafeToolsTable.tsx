"use client";

import React from "react";
import { Check, X, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export function WhySafeToolsTable() {
   const hp = useTranslations("home");

   return (
      <section className="py-24 bg-background/50 backdrop-blur-sm">
         <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
               <div className="text-center mb-16 space-y-4">
                  <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight font-heading">
                     {hp.rich("whySafeTools.title", { 
                        span: (chunks: React.ReactNode) => <span className="text-primary">{chunks}</span>, 
                        br: () => <br /> 
                     })}
                  </h2>
               </div>

               <div className="overflow-hidden rounded-2xl border border-border glass-card shadow-2xl">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="bg-secondary/50 dark:bg-secondary/30 backdrop-blur-sm border-b border-border">
                           <th className="p-8 text-sm font-semibold uppercase tracking-wider text-muted-foreground">{hp("whySafeTools.table.feature")}</th>
                           <th className="p-8 text-sm font-semibold uppercase tracking-wider text-primary text-center">{hp("whySafeTools.table.safe")}</th>
                           <th className="p-8 text-sm font-semibold uppercase tracking-wider text-muted-foreground text-center">{hp("whySafeTools.table.trad")}</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-border">
                        {Array.isArray(hp.raw("whySafeTools.items")) && (hp.raw("whySafeTools.items") as Array<{ title: string; safe: boolean; trad: boolean | string }>).map((row, i) => (
                           <tr key={i} className="hover:bg-secondary/50 dark:bg-secondary/30 backdrop-blur-sm transition-colors">
                              <td className="p-8 font-bold text-foreground">{row.title}</td>
                              <td className="p-8 text-center"><Check className="mx-auto w-6 h-6 text-emerald-500" /></td>
                              <td className="p-8 text-center">
                                 {row.trad === true ? <Check className="mx-auto w-6 h-6 text-emerald-500" /> :
                                    row.trad === false ? <X className="mx-auto w-6 h-6 text-rose-500" /> :
                                       <AlertCircle className="mx-auto w-6 h-6 text-amber-500" />}
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </section>
   );
}
